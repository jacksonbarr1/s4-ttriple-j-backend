const express = require("express");
const { body, param, query } = require("express-validator");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const bookingRequestController = require("../controllers/bookingRequest.controller");

const router = express.Router();

// POST /api/requests - Create a booking request
router.post(
  "/",
  authenticate,
  [
    body("senderId").isMongoId().notEmpty(),
    body("senderType").isIn(["Band", "Event"]),
    body("receiverId").isMongoId().notEmpty(),
    body("receiverType").isIn(["Band", "Event"]),
    body("message").optional().isString(),
  ],
  validate,
  bookingRequestController.createBookingRequest
);

// GET /api/requests - List sent or received requests
router.get(
  "/",
  authenticate,
  [query("type").isIn(["sent", "received"]).notEmpty()],
  validate,
  bookingRequestController.listBookingRequests
);

// GET /api/requests/:id - Get booking request details
router.get(
  "/:id",
  authenticate,
  [param("id").isMongoId()],
  validate,
  bookingRequestController.getBookingRequestById
);

// PATCH /api/requests/:id - Update booking request status (approve/deny)
router.patch(
  "/:id",
  authenticate,
  [param("id").isMongoId(), body("status").isIn(["Approved", "Denied"])],
  validate,
  bookingRequestController.updateBookingRequestStatus
);

// DELETE /api/requests/:id - Cancel booking request (sender only)
router.delete(
  "/:id",
  authenticate,
  [param("id").isMongoId()],
  validate,
  bookingRequestController.cancelBookingRequest
);

module.exports = router;
