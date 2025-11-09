const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

const locationValidators = [
  body("location.city").isString().notEmpty(),
  body("location.state").isString().notEmpty(),
  body("location.country").isString().notEmpty(),
  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .custom((value) => {
      return value.every((coord) => typeof coord === "number");
    }),
];

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("username").isLength({ min: 3, max: 30 }),
    body("password").isLength({ min: 6 }),
    ...locationValidators,
  ],
  validate,
  authController.register,
);

router.post(
  "/login",
  [
    body("email").optional().isEmail(),
    body("username").optional().isLength({ min: 3, max: 30 }),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  authController.login,
);

router.get("/me", authenticate, authController.getProfile);

module.exports = router;
