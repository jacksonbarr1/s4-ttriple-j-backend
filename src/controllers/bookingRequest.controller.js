const BookingRequest = require("../models/bookingRequest.model");
const Band = require("../models/band.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");

// Helper: get entity (Band or Event) and validate ownership
const getEntityAndValidateOwnership = async (entityId, entityType, userId) => {
  const Model = entityType === "Band" ? Band : Event;
  const entity = await Model.findById(entityId).exec();

  if (!entity) {
    throw new Error(`${entityType} not found`);
  }

  // Check if user owns the entity (band owner or event owner)
  const ownerId = entity.owner;
  if (!ownerId.equals(userId)) {
    throw new Error(`Unauthorized: user does not own this ${entityType}`);
  }

  return entity;
};

const createBookingRequest = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { senderId, senderType, receiverId, receiverType, message } = req.body;

    // Validate that user owns the sender entity
    await getEntityAndValidateOwnership(senderId, senderType, userId);

    // Check for duplicate request
    const existing = await BookingRequest.findOne({
      sender: senderId,
      senderType,
      receiver: receiverId,
      receiverType,
    }).exec();

    if (existing) {
      return next(new Error("A booking request already exists for this sender/receiver pair"));
    }

    const bookingRequest = await BookingRequest.create({
      sender: senderId,
      senderType,
      receiver: receiverId,
      receiverType,
      initiatedBy: userId,
      message: message || "",
      status: "Pending",
    });

    res.status(201).json({ request: bookingRequest });
  } catch (error) {
    next(error);
  }
};

const listBookingRequests = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { type } = req.query; // "sent" or "received"

    if (!type || !["sent", "received"].includes(type.toLowerCase())) {
      return next(new Error("Invalid type parameter. Use 'sent' or 'received'"));
    }

    let query = {};

    if (type.toLowerCase() === "sent") {
      // Requests sent by user's bands/events
      query = { initiatedBy: userId };
    } else {
      // Requests received by user's bands/events
      // We need to find all bands/events owned by the user, then find requests where they are the receiver
      const userBands = await Band.find({ owner: userId }).select("_id").exec();
      const userEvents = await Event.find({ owner: userId }).select("_id").exec();

      const bandIds = userBands.map((b) => b._id);
      const eventIds = userEvents.map((e) => e._id);

      query = {
        $or: [
          { receiver: { $in: bandIds }, receiverType: "Band" },
          { receiver: { $in: eventIds }, receiverType: "Event" },
        ],
      };
    }

    const requests = await BookingRequest.find(query)
      .populate("sender", "name")
      .populate("receiver", "name")
      .populate("initiatedBy", "username location")
      .sort({ createdAt: -1 })
      .exec();

    // Transform requests to match frontend expectations
    const transformedRequests = requests.map((req) => {
      const senderEntity = req.sender;
      const receiverEntity = req.receiver;
      const initiator = req.initiatedBy;

      let username = initiator?.username || "Unknown";
      let location = initiator?.location?.city || "Unknown";
      let bandOrEventName = senderEntity?.name || "Unknown";

      return {
        _id: req._id,
        id: req._id,
        username,
        location,
        bandName: bandOrEventName,
        dateSent: req.createdAt,
        status: req.status,
        senderId: req.sender,
        senderType: req.senderType,
        receiverId: req.receiver,
        receiverType: req.receiverType,
        message: req.message,
      };
    });

    res.json({ requests: transformedRequests });
  } catch (error) {
    next(error);
  }
};

const getBookingRequestById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const request = await BookingRequest.findById(id)
      .populate({
        path: "sender",
        refPath: "senderType",
      })
      .populate({
        path: "receiver",
        refPath: "receiverType",
      })
      .populate("initiatedBy", "username email phone location")
      .exec();

    if (!request) {
      return res.status(404).json({ error: "Booking request not found" });
    }

    // Check authorization: user must be associated with either sender or receiver
    const userBands = await Band.find({ owner: userId }).select("_id").exec();
    const userEvents = await Event.find({ owner: userId }).select("_id").exec();

    const bandIds = userBands.map((b) => b._id.toString());
    const eventIds = userEvents.map((e) => e._id.toString());

    const isAuthorized =
      (request.senderType === "Band" && bandIds.includes(request.sender._id.toString())) ||
      (request.senderType === "Event" && eventIds.includes(request.sender._id.toString())) ||
      (request.receiverType === "Band" && bandIds.includes(request.receiver._id.toString())) ||
      (request.receiverType === "Event" && eventIds.includes(request.receiver._id.toString()));

    if (!isAuthorized) {
      return res.status(403).json({ error: "Unauthorized to view this request" });
    }

    // Only show contact info if status is Approved
    const senderContactInfo = request.status === "Approved" ? request.sender.contactInfo : undefined;
    const receiverContactInfo = request.status === "Approved" ? request.receiver.contactInfo : undefined;

    const responseData = {
      request: {
        _id: request._id,
        sender: {
          _id: request.sender._id,
          name: request.sender.name,
          type: request.senderType,
          location: request.sender.location,
          ...(senderContactInfo && { contact: senderContactInfo }),
        },
        receiver: {
          _id: request.receiver._id,
          name: request.receiver.name,
          type: request.receiverType,
          location: request.receiver.location,
          ...(receiverContactInfo && { contact: receiverContactInfo }),
        },
        message: request.message,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

const updateBookingRequestStatus = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Denied"].includes(status)) {
      return next(new Error("Invalid status. Use 'Approved' or 'Denied'"));
    }

    const request = await BookingRequest.findById(id).exec();

    if (!request) {
      return res.status(404).json({ error: "Booking request not found" });
    }

    // Only the receiver (event/band owner) can approve/deny
    const receiverEntity = await (request.receiverType === "Band" ? Band : Event)
      .findById(request.receiver)
      .exec();

    if (!receiverEntity) {
      return res.status(404).json({ error: `${request.receiverType} not found` });
    }

    if (!receiverEntity.owner || !receiverEntity.owner.equals(userId)) {
      return res.status(403).json({ error: "Only the receiver can approve or deny this request" });
    }

    request.status = status;
    await request.save();

    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const cancelBookingRequest = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const request = await BookingRequest.findById(id).exec();

    if (!request) {
      return res.status(404).json({ error: "Booking request not found" });
    }

    // Only the sender (initiator) can cancel
    if (!request.initiatedBy.equals(userId)) {
      return res.status(403).json({ error: "Only the sender can cancel this request" });
    }

    await BookingRequest.findByIdAndDelete(id).exec();

    res.json({ message: "Booking request cancelled" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookingRequest,
  listBookingRequests,
  getBookingRequestById,
  updateBookingRequestStatus,
  cancelBookingRequest,
};
