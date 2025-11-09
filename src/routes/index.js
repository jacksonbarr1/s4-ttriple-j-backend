const express = require("express");
const authRoutes = require("./auth.routes");
const bandRoutes = require("./band.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/bands", bandRoutes);

module.exports = router;
