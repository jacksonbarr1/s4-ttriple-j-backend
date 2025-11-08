const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/database");
const ENV = require("./config/env");

const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB();
    server.listen(ENV.app.port, () => {
      console.log(`Server is running on port ${ENV.app.port}`);
    });
  } catch (error) {
    console.error("Failed to start server ", error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = { server, start };
