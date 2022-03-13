const express = require("express");
const { validate } = require("express-validation");
const { registerUser, loginUser, getUsers } = require("../controllers/users");
const auth = require("../middlewares/auth");
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
usersRouter.get("/", auth, getUsers);

module.exports = usersRouter;
