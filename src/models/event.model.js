const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
  },
  { _id: false },
);

const dateSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    capacity: { type: String },
    compensation: { type: Number },
    eventDate: { type: dateSchema, required: true },
    location: { type: locationSchema, required: true },
    requirements: { type: [String], default: [] },
    equipmentProvided: { type: [String], default: [] },
    contactInfo: { type: contactInfoSchema, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({ "location.coordinates": "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
