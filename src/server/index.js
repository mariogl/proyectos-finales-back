const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { generalError, notFoundError } = require("./middlewares/errors");

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(notFoundError);
app.use(generalError);

module.exports = app;
