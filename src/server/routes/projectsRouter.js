const express = require("express");
const {
  getProjects,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
  triggerPull,
} = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/sonardata", getProjectSonarData);
projectsRouter.get("/:challengeId", getProjects);
projectsRouter.post("/", createProject);
projectsRouter.post("/sonarscanner", triggerSonarScanner);
projectsRouter.post("/pull", triggerPull);
projectsRouter.post("/pull/all", triggerPull);

module.exports = projectsRouter;
