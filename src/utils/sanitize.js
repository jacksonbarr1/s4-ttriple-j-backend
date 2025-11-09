const normalizeStringArray = (arr) => {
  return arr
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

module.exports = {
  normalizeStringArray,
};
