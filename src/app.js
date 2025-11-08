const express = require("express");
const cors = require("cors");
const ENV = require("./config/env");
const apiRouter = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

module.exports = app;
