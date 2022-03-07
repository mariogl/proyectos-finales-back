const createCustomError = (message, statusCode) => ({
  message,
  statusCode,
});

module.exports = createCustomError;
