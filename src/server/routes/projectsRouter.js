const express = require("express");
const {
  getProjects,
  createProject,
  getProjectSonarData,
  triggerPull,
} = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/sonardata", getProjectSonarData);
projectsRouter.get("/:challengeId", getProjects);
projectsRouter.post("/", createProject);
projectsRouter.post("/pull", triggerPull);
projectsRouter.post("/pull/all", triggerPull);
projectsRouter.get("/:challengeId/filter/tutor/:tutorId", getProjects);

module.exports = projectsRouter;
