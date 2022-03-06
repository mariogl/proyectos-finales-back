const express = require("express");
const { validate } = require("express-validation");
const { registerUser } = require("../controllers/users");
const {
  registerUserRequestSchema,
  loginUserRequestSchema,
} = require("../schemas/usersSchemas");

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(registerUserRequestSchema),
  registerUser
);

usersRouter.post("login", validate(loginUserRequestSchema));

module.exports = usersRouter;
