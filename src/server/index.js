const express = require("express");
const { generalError, notFoundError } = require("./middlewares/errors");

const app = express();

app.use(notFoundError);
app.use(generalError);

module.exports = app;
