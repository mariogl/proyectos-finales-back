const express = require("express");

const usersRouter = express.Router();

usersRouter.post("/register");

module.exports = usersRouter;
