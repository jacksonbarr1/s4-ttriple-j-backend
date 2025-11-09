const { geocodeLocation } = require("../services/geocoding");

const normalizeLocation = async (location) => {
  if (!location) {
    return location;
  }

  const sanitized = {
    city: location.city,
    state: location.state,
    country: location.country,
  };

  const coordinates = await geocodeLocation(sanitized);
  if (coordinates) {
    sanitized.coordinates = coordinates;
  }

  return sanitized;
};

module.exports = {
  normalizeLocation,
};
