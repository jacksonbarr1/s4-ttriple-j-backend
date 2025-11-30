const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema(
  {
    // Sender can be either a Band or Event
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderType",
    },
    senderType: {
      type: String,
      required: true,
      enum: ["Band", "Event"],
    },
    // Receiver can be either a Band or Event
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverType",
    },
    receiverType: {
      type: String,
      required: true,
      enum: ["Band", "Event"],
    },
    // User who initiated the request (band member or event organizer)
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Message from requester (optional)
    message: {
      type: String,
      default: "",
    },
    // Status of the request
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate requests (same sender/receiver pair)
bookingRequestSchema.index({ sender: 1, senderType: 1, receiver: 1, receiverType: 1 }, { unique: true });

const BookingRequest = mongoose.model("BookingRequest", bookingRequestSchema);

module.exports = BookingRequest;
