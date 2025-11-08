const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { NODE_ENV = "development" } = process.env;

const ENV = {
  env: NODE_ENV,
  app: {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://mongo:27017/ttriplej",
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
  },
};

module.exports = ENV;
