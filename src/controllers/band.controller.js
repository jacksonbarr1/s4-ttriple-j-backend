const Band = require("../models/band.model");
const User = require("../models/user.model");
const { normalizeStringArray } = require("../utils/sanitize");
const { normalizeLocation } = require("../utils/location");

const populateBandPayload = (payload) => {
  const fields = ["equipment", "tags", "links", "genres", "topTracks"];
  fields.forEach((field) => {
    if (Array.isArray(payload[field])) {
      payload[field] = normalizeStringArray(payload[field]);
    }
  });
  return payload;
};

const createBand = async (req, res, next) => {
  try {
    const payload = populateBandPayload({ ...req.body });
    payload.owner = req.user.id;
    payload.members = [req.user.id];

    payload.location = await normalizeLocation(payload.location);

    const band = await Band.create(payload);
    res.status(201).json({ band });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBand,
};
