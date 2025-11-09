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

const availabilitySchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { _id: false },
);

const bandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    headerImages: { type: [String], default: [] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: { type: locationSchema, required: true },
    topTracks: { type: [String], default: [] },
    previousEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    equipment: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    links: { type: [String], default: [] },
    genres: { type: [String], default: [] },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "professional"],
      required: true,
    },
    availability: { type: [availabilitySchema], default: [] },
    averageRating: { type: Number, default: null },
    contactInfo: { type: contactInfoSchema, required: true },
  },
  {
    timestamps: true,
  },
);

bandSchema.index({ "location.coordinates": "2dsphere" });

const Band = mongoose.model("Band", bandSchema);

module.exports = Band;
