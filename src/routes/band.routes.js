const express = require("express");
const { body, param, query } = require("express-validator");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const bandController = require("../controllers/band.controller");

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
    body("experienceLevel").isIn(["beginner", "intermediate", "professional"]),
    ...locationValidators,
    body("contactInfo.email").isEmail(),
    body("contactInfo.phone").isString().notEmpty(),
  ],
  validate,
  bandController.createBand,
);

// router.get(
//   "/",
//   authenticate,
//   [
//     query("page").optional().isInt({ min: 1 }),
//     query("limit").optional().isInt({ min: 1, max: 100 }),
//     query("owner").optional().isBoolean(),
//     query("search").optional().isString(),
//   ],
//   validate,
//   bandController.listBands,
// );
//
// router.get(
//   "/:id",
//   authenticate,
//   [param("id").isMongoId()],
//   validate,
//   bandController.getBandById,
// );
//
// router.patch(
//   "/:id",
//   authenticate,
//   [
//     param("id").isMongoId(),
//     body("experienceLevel")
//       .optional()
//       .isIn(["beginner", "intermediate", "professional"]),
//     body("availability").optional().isArray(),
//     body("availability.*.start").isISO8601(),
//     body("availability.*.end").isISO8601(),
//   ],
//   validate,
//   bandController.updateBand,
// );
//
// router.delete(
//   "/:id",
//   authenticate,
//   [param("id").isMongoId()],
//   validate,
//   bandController.deleteBand,
// );
//
// router.post(
//   "/:id/members",
//   authenticate,
//   [param("id").isMongoId(), body("userId").isMongoId()],
//   validate,
//   bandController.addMember,
// );
//
// router.delete(
//   "/:id/members/:userId",
//   authenticate,
//   [param("id").isMongoId(), param("userId").isMongoId()],
//   validate,
//   bandController.removeMember,
// );

module.exports = router;
