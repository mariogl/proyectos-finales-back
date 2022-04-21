const express = require("express");
const {
  getProjects,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
} = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/:challengeId", getProjects);
projectsRouter.post("/", createProject);
projectsRouter.get("/sonardata", getProjectSonarData);
projectsRouter.post("/sonarscanner", triggerSonarScanner);

module.exports = projectsRouter;
