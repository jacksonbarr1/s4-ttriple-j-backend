const express = require("express");
const { body, param, query } = require("express-validator");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const eventController = require("../controllers/event.controller");

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
  "/",
  authenticate,
  [
    body("name").isString().notEmpty(),
    body("eventDate.start").isISO8601(),
    body("eventDate.end").isISO8601(),
    ...locationValidators,
    body("contactInfo.email").isEmail(),
    body("contactInfo.phone").optional().isString(),
    body("compensation").optional().isNumeric(),
  ],
  validate,
  eventController.createEvent,
);

router.get(
  "/",
  authenticate,
  [
    query("sortStrategy").optional().isIn(["nearest", "timePosted", "compensation"]),
    query("search").optional().isString(),
    query("requirements").optional().isString(),
    query("equipmentProvided").optional().isString(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
  ],
  validate,
  eventController.listEvents,
);

router.get(
  "/me",
  authenticate,
  [],
  validate,
  eventController.getMyEvents,
);

router.get(
  "/:id",
  authenticate,
  [param("id").isMongoId()],
  validate,
  eventController.getEventById,
);

module.exports = router;
