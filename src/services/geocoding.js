const opencage = require("opencage-api-client");
const ENV = require("../config/env");

const cache = new Map();

const normalizeKeyPart = (value) => (value || "").trim().toLowerCase();

const buildCacheKey = ({ city, state, country }) => {
  return [city, state, country].map(normalizeKeyPart).join("|");
};

const fetchGeocoding = async (query) => {
  try {
    const key = ENV.services && ENV.services.geocoding && ENV.services.geocoding.apiKey;
    const params = key ? { key, q: query } : { q: query };
    const data = await opencage.geocode(params);
    if (data && data.status && data.status.code === 200 && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return {
        type: "Point",
        coordinates: [lng, lat],
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const geocodeLocation = async ({ city, state, country }) => {
  if (!ENV.services.geocoding.enabled) {
    return null;
  }

  const parts = [city, state, country]
    .map((part) => (part || "").trim())
    .filter(Boolean);
  if (!parts.length) {
    return null;
  }

  const cacheKey = buildCacheKey({ city, state, country });
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const query = parts.join(", ");

  const coordinates = await fetchGeocoding(query);
  cache.set(cacheKey, coordinates);

  return coordinates;
};

module.exports = {
  geocodeLocation,
};
