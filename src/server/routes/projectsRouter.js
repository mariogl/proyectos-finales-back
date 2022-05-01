const express = require("express");
const {
  getProjects,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
  triggerPull,
} = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/:challengeId", getProjects);
projectsRouter.post("/", createProject);
projectsRouter.get("/sonardata", getProjectSonarData);
projectsRouter.post("/sonarscanner", triggerSonarScanner);
projectsRouter.post("/pull", triggerPull);
projectsRouter.post("/pull/all", triggerPull);

module.exports = projectsRouter;
