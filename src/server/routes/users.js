const express = require("express");
const { validate } = require("express-validation");
const { registerUser } = require("../controllers/users");
const registerUserRequestSchema = require("../schemas/usersSchemas");

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(registerUserRequestSchema),
  registerUser
);

module.exports = usersRouter;
