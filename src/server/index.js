require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const auth = require("./middlewares/auth");
const { generalError, notFoundError } = require("./middlewares/errors");
const projectsRouter = require("./routes/projectsRouter");
const challengesRouter = require("./routes/challengesRouter");
const usersRouter = require("./routes/usersRouter");
const { authUserRequestSchema } = require("./schemas/usersSchemas");

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        origin === process.env.ALLOWED_ORIGIN_LOCAL ||
        origin === "http://localhost:3001" ||
        origin === process.env.ALLOWED_ORIGIN_PRODUCTION
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/users", usersRouter);
app.use(validate(authUserRequestSchema), auth);
app.use("/challenges", challengesRouter);
app.use("/projects", projectsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
