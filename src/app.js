const express = require("express");
const cors = require("cors");
const ENV = require("./config/env");

const app = express();

app.use(cors());
app.use(express.json());

module.exports = app;
