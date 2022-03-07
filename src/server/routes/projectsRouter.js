const express = require("express");
const { getAllProjects } = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/", getAllProjects);

module.exports = projectsRouter;
