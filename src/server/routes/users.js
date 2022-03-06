const express = require("express");
const { validate } = require("express-validation");
const { registerUser, loginUser } = require("../controllers/users");
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

usersRouter.post("/login", validate(loginUserRequestSchema), loginUser);

module.exports = usersRouter;
