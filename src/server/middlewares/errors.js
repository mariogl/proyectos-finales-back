const createCustomError = require("../utils/errors");

const notFoundError = (req, res, next) => {
  const error = createCustomError("Endpoint not found", 404);
  next(error);
};

const generalError = (
  error,
  req,
  res,
  // eslint-disable-next-line no-unused-vars
  next
) => {
  const errorResponse = {
    statusCode: error.statusCode ?? 500,
    message: error.statusCode !== 500 ? error.message : "General server error",
  };

  res
    .status(errorResponse.statusCode)
    .json({ error: true, message: errorResponse.message });
};

module.exports = {
  notFoundError,
  generalError,
};