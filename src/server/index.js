const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { validate } = require("../database/models/User");
const auth = require("./middlewares/auth");
const { generalError, notFoundError } = require("./middlewares/errors");
const usersRouter = require("./routes/users");
const { authUserRequestSchema } = require("./schemas/usersSchemas");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/users", usersRouter);
app.get("/", validate(authUserRequestSchema), auth);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
