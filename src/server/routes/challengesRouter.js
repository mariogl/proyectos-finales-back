const express = require("express");
const { getAllChallenges } = require("../controllers/challenges");

const challengesRouter = express.Router();

challengesRouter.get("/", getAllChallenges);

module.exports = challengesRouter;
