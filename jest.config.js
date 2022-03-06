module.exports = {
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server/initializeServer.js",
    "!src/database/index.js",
  ],
};
