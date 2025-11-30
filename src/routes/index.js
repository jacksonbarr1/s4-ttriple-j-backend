const express = require("express");
const authRoutes = require("./auth.routes");
const bandRoutes = require("./band.routes");
const eventRoutes = require("./event.routes");
const experimentRoutes = require("./experiment.routes");
const bookingRequestRoutes = require("./bookingRequest.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/bands", bandRoutes);
router.use("/events", eventRoutes);
router.use('/experiments', experimentRoutes);
router.use('/requests', bookingRequestRoutes);

module.exports = router;
