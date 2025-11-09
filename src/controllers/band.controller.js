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
const ABTestMetric = require("../models/abTestMetric.model");

const listBands = async (req, res, next) => {
  try {
    const rawSortStrategy = req.query.sortStrategy; // undefined when client didn't send
    const search = req.query.search;
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

    // If the client did NOT explicitly provide a sortStrategy, treat this as
    // the user's first "explore" call.  Assign a persistent A/B group (50/50)
    // on the user document if they don't already have one. Group mapping:
    // - A => default sort 'nearest'
    // - B => default sort 'timePosted'
    // NOTE: we only persist for authenticated users (route uses authenticate middleware).
    let sortStrategy = rawSortStrategy || 'timePosted';
    if (rawSortStrategy === undefined && req.user) {
      try {
        const user = req.user;
        if (!user.experiment || user.experiment.name !== 'explore_default_sort') {
          // assign 50/50
          const group = Math.random() < 0.5 ? 'A' : 'B';
          const experiment = { name: 'explore_default_sort', group, assignedAt: new Date() };
          // persist to DB
          await User.findByIdAndUpdate(user._id || user.id, { experiment }, { new: true }).exec();
          // record assignment event
          try {
            await ABTestMetric.create({ user: user._id || user.id, group, eventType: 'assignment', details: { assignedTo: group } });
          } catch (e) {
            console.error('Failed to record AB assignment metric', e);
          }
          // apply assigned default
          sortStrategy = group === 'A' ? 'nearest' : 'timePosted';
        } else {
          // already assigned
          const group = user.experiment.group;
          sortStrategy = group === 'A' ? 'nearest' : 'timePosted';
        }
      } catch (err) {
        // don't block the request for assignment failures; fall back to timePosted
        console.error('Failed to assign AB experiment for user', err);
        sortStrategy = 'timePosted';
      }
    }

    if (sortStrategy === 'nearest') {
      const user = req.user;
      // If user lacks coords, gracefully fall back to timePosted instead of failing.
      if (!user || !user.location || !user.location.coordinates) {
        sortStrategy = 'timePosted';
      }
    }

    if (sortStrategy === "nearest") {
      const user = req.user;
      // support both shapes: either coordinates is an array [lng,lat] or an object { type, coordinates: [...] }
      const coordsField = user.location.coordinates;
      const coordsArray = Array.isArray(coordsField) ? coordsField : (coordsField && coordsField.coordinates);
      if (!Array.isArray(coordsArray) || coordsArray.length < 2) {
        // fallback to timePosted if coords are invalid
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

        bands = await Band.aggregate(pipeline).exec();
      }
    }

    if (sortStrategy !== 'nearest') {
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
