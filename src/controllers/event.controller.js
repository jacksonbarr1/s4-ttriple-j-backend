const Event = require("../models/event.model");
const { normalizeStringArray } = require("../utils/sanitize");
const { normalizeLocation } = require("../utils/location");

const populateEventPayload = (payload) => {
  const fields = ["requirements", "equipmentProvided"];
  fields.forEach((field) => {
    if (Array.isArray(payload[field])) {
      // normalize to lowercase for easier matching
      payload[field] = normalizeStringArray(payload[field]).map((s) => s.toLowerCase());
    }
  });
  return payload;
};

const createEvent = async (req, res, next) => {
  try {
    const payload = populateEventPayload({ ...req.body });
    const userId = (req.user && (req.user._id || req.user.id)) || null;
    // events owned by user
    payload.owner = userId;

    payload.location = await normalizeLocation(payload.location);

    const event = await Event.create(payload);
    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
};

const listEvents = async (req, res, next) => {
  try {
    const rawSortStrategy = req.query.sortStrategy; // undefined when client didn't send
    const search = req.query.search;
    const filters = {};

    if (req.query.requirements) {
      const arr = req.query.requirements
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (arr.length) filters.requirements = { $all: arr };
    }
    if (req.query.equipmentProvided) {
      const arr = req.query.equipmentProvided
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (arr.length) filters.equipmentProvided = { $all: arr };
    }

    // date filtering: events with eventDate.start between startDate and endDate (inclusive)
    if (req.query.startDate || req.query.endDate) {
      const dateFilter = {};
      if (req.query.startDate) dateFilter.$gte = new Date(req.query.startDate);
      if (req.query.endDate) dateFilter.$lte = new Date(req.query.endDate);
      // match eventDate.start in range
      filters["eventDate.start"] = dateFilter;
    }

    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    const MAX_RESULTS = 1000;

    let events = [];

    // default sortStrategy: timePosted unless AB or other logic desired; use provided value
    let sortStrategy = rawSortStrategy || 'timePosted';

    // support 'nearest' only if user has coordinates
    if (sortStrategy === 'nearest') {
      const user = req.user;
      if (!user || !user.location || !user.location.coordinates) {
        sortStrategy = 'timePosted';
      }
    }

    if (sortStrategy === "nearest") {
      const user = req.user;
      const coordsField = user.location.coordinates;
      const coordsArray = Array.isArray(coordsField) ? coordsField : (coordsField && coordsField.coordinates);
      if (!Array.isArray(coordsArray) || coordsArray.length < 2) {
        sortStrategy = 'timePosted';
      } else {
        const [lng, lat] = coordsArray;

        const geoNearStage = {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distanceMeters",
            spherical: true,
            query: filters,
          },
        };

        const pipeline = [geoNearStage, { $limit: MAX_RESULTS }];

        events = await Event.aggregate(pipeline).exec();
      }
    }

    if (sortStrategy === 'compensation') {
      events = await Event.find(filters).sort({ compensation: -1 }).limit(MAX_RESULTS).exec();
    }

    if (sortStrategy !== 'nearest' && sortStrategy !== 'compensation') {
      events = await Event.find(filters).sort({ createdAt: -1 }).limit(MAX_RESULTS).exec();
    }

    return res.json({ events });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id).exec();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json({ event });
  } catch (error) {
    next(error);
  }
};

const getMyEvents = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const events = await Event.find({ owner: userId }).sort({ createdAt: -1 }).exec();
    res.json({ events });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  listEvents,
  getEventById,
  getMyEvents,
};

