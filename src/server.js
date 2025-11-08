const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/database");
const ENV = require("./config/env");

const server = http.createServer(app);

const start = async () => {
  try {
    // Start the HTTP server first so the container is listening on the required PORT
    server.listen(ENV.app.port, () => {
      console.log(`Server is running on port ${ENV.app.port}`);
    });

    connectDB().catch((err) => {
      console.error("Failed to connect to DB:", err);
    });
  } catch (error) {
    // If something unexpected happens while starting, log and exit.
    console.error("Failed to start server ", error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = { server, start };
