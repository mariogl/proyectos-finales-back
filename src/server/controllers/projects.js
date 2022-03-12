require("dotenv").config();
const axios = require("axios");
const Project = require("../../database/models/Project");

const getAllProjects = async (req, res) => {
  const projects = await Project.find()
    .sort({ student: 1 })
    .populate("tutor", "-password -username");

  res.json({
    projects,
  });
};

const createProject = async (req, res) => {
  const { name, student, trello, tutor } = req.body;

  const slug = student.replaceAll(" ", "-");

  const createdProject = await Project.create({
    name,
    student,
    trello,
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
          username: "admin",
          password: "admin",
        },
      }
    );
    res.json({
      codeSmells: measures[1].value,
      coverage: measures[0].value,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectSonarData,
};
