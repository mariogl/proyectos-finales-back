const express = require("express");
const {
  getAllProjects,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
} = require("../controllers/projects");

const projectsRouter = express.Router();

projectsRouter.get("/", getAllProjects);
projectsRouter.post("/", createProject);
projectsRouter.get("/sonardata", getProjectSonarData);
projectsRouter.post("/sonarscanner", triggerSonarScanner);

module.exports = projectsRouter;
