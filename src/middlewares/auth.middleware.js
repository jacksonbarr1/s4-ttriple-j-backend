const jwt = require("jsonwebtoken");
const ENV = require("../config/env");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const payload = jwt.verify(token, ENV.security.jwtSecret);


    try {
      const user = await User.findById(payload.id).select("-password").lean();
      req.user = user || payload;
    } catch (err) {
      req.user = payload;
    }

    return next();
  } catch (error) {
    return next(new Error("Invalid or expired authentication token"));
  }
};

module.exports = {
  authenticate,
};
