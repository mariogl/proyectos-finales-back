const createCustomError = (message, statusCode = 500) => ({
  message,
  statusCode,
});

module.exports = createCustomError;
