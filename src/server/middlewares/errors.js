require("dotenv").config();
const debug = require("debug")("proyectos-api:server:middlewares:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");
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
  debug(chalk.red(error.message));

  if (error instanceof ValidationError) {
    debug(chalk.red(error.details));
  }

  const errorResponse = {
    statusCode: error.statusCode ?? 500,
    message: error.statusCode ? error.message : "General server error",
  };

  res
    .status(errorResponse.statusCode)
    .json({ error: true, message: errorResponse.message });
};

module.exports = {
  notFoundError,
  generalError,
};
