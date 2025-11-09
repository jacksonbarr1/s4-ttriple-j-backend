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
  const userId = (req.user && (req.user._id || req.user.id)) || null;
  payload.owner = userId;
  payload.members = userId ? [userId] : [];

    payload.location = await normalizeLocation(payload.location);

    const band = await Band.create(payload);
    res.status(201).json({ band });
  } catch (error) {
    next(error);
  }
};

const BandFilterMetrics = require("../models/bandFilterMetrics.model");

const listBands = async (req, res, next) => {
  try {
    const { sortStrategy = "timePosted", search } = req.query;
    const filters = {};
    if (req.query.genres) {
      const arr = req.query.genres.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) filters.genres = { $in: arr };
    }
    if (req.query.tags) {
      const arr = req.query.tags.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) filters.tags = { $in: arr };
    }
    if (req.query.experienceLevel) {
      filters.experienceLevel = req.query.experienceLevel;
    }
    if (req.query.owner) {
      filters.owner = req.query.owner;
    }

    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    // cap
    const MAX_RESULTS = 1000;

    let bands = [];

    if (sortStrategy === "nearest") {
      const user = req.user;
      if (!user || !user.location || !user.location.coordinates) {
        return res.status(400).json({ error: "User location required for nearest sorting" });
      }
      // support both shapes: either coordinates is an array [lng,lat] or an object { type, coordinates: [...] }
      const coordsField = user.location.coordinates;
      const coordsArray = Array.isArray(coordsField) ? coordsField : (coordsField && coordsField.coordinates);
      if (!Array.isArray(coordsArray) || coordsArray.length < 2) {
        return res.status(400).json({ error: "User location required for nearest sorting" });
      }
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

      bands = await Band.aggregate(pipeline).exec();
    } else {
      bands = await Band.find(filters).sort({ createdAt: -1 }).limit(MAX_RESULTS).exec();
    }

    // record metrics
    try {
      const metric = new BandFilterMetrics({
        user: req.user ? req.user._id : null,
        sortStrategy,
        filters: req.query, // store raw query for analysis
        search: search || null,
        resultCount: Array.isArray(bands) ? bands.length : 0,
      });
      await metric.save();
    } catch (err) {
      // don't fail the request for metrics errors
      console.error("Failed to save list metrics", err);
    }

    return res.json({ bands });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBand,
  listBands,
};
