const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ENV = require("../config/env");
const { normalizeLocation } = require("../utils/location");

const buildToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    ENV.security.jwtSecret,
    { expiresIn: "7d" },
  );
};

const register = async (req, res, next) => {
  try {
    const { email, username, password, location } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      return next(new Error("Email or username already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const loc = await normalizeLocation(location);

    const user = await User.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      location: loc,
    });

    const token = buildToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const query = email
      ? { email: email.toLowerCase() }
      : { username: username.toLowerCase() };

    const user = await User.findOne(query).select("+password");

    if (!user) {
      return next(new Error("Invalid email/username or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new Error("Invalid email/username or password"));
    }

    const token = buildToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
