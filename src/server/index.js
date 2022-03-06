const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { generalError, notFoundError } = require("./middlewares/errors");
const usersRouter = require("./routes/users");

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
