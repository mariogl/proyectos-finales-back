const express = require("express");
const { validate } = require("express-validation");
const helmet = require("helmet");
const morgan = require("morgan");
const auth = require("./middlewares/auth");
const { generalError, notFoundError } = require("./middlewares/errors");
const usersRouter = require("./routes/usersRouter");
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
