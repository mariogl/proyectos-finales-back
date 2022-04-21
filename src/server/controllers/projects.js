require("dotenv").config();
const debug = require("debug")("proyectos-api:server:controllers:projects");
const { exec } = require("child_process");
const axios = require("axios");
const Project = require("../../database/models/Project");

const getProjects = async (req, res) => {
  const { challengeId } = req.params;
  const projects = await Project.find({ challenge: challengeId })
    .sort({ student: 1 })
    .populate("tutor", "-password -username");

  res.json({
    projects,
  });
};

const createProject = async (req, res) => {
  const { challenge, name, student, trello, tutor, folder } = req.body;

  const slug = student.replaceAll(" ", "-");

  const createdProject = await Project.create({
    challenge,
    name,
    student,
    trello,
    folder,
    repo: {
      front: `${slug}_Front-${process.env.GIT_REPO_SUFIX}`,
      back: `${slug}_Back-${process.env.GIT_REPO_SUFIX}`,
    },
    tutor,
  });
  res.status(201);
  res.json({
    project: createdProject,
  });
};

const getProjectSonarData = async (req, res, next) => {
  const { projectKey } = req.query;
  try {
    const {
      data: {
        component: { measures },
      },
    } = await axios.get(
      `${process.env.SONARQUBE_API}measures/component?component=${projectKey}&metricKeys=code_smells,coverage`,
      {
        auth: {
          username: process.env.SONARQUBE_USERNAME,
          password: process.env.SONARQUBE_PASSWORD,
        },
      }
    );
    res.json({
      codeSmells: measures[1].value,
      coverage: measures[0].value,
    });
  } catch {
    const error = new Error("SonarQube validation error");
    error.statusCode = 401;
    next(error);
  }
};

const triggerSonarScanner = (req, res) => {
  exec(
    "sonar-scanner.bat",
    {
      cwd: "C:\\formaciones\\skylab-coders\\202110\\week9\\proyectos-finales\\back\\adam",
    },
    (error, stdout) => {
      if (!error) {
        debug(stdout);
        res.json({ scanner: "ok" });
      }
    }
  );
};

module.exports = {
  getProjects,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
};
