const mongoose = require("mongoose");
const ENV = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.db.uri, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, disconnectDB };
