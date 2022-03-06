module.exports = {
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js",
    "!src/server/initializeServer.js",
    "!src/database/index.js",
  ],
};
