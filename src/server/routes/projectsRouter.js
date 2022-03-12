const express = require("express");
const {
  getAllProjects,
  createProject,
  getProjectSonarData,
} = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/", getAllProjects);
projectsRouter.post("/", createProject);
projectsRouter.get("/sonardata", getProjectSonarData);

module.exports = projectsRouter;
