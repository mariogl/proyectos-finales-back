require("dotenv").config();
const debug = require("debug")("proyectos-api:server:controllers:projects");
const chalk = require("chalk");
const { exec, execSync } = require("child_process");
const axios = require("axios");
const path = require("path");
const Project = require("../../database/models/Project");

const basedir = process.env.BASE_DIR;
const basedirBack = path.join(basedir, "back");
const basedirFront = path.join(basedir, "front");

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

const trigerPullProject = (project) =>
  new Promise((resolve, reject) => {
    try {
      if (project.repo.back) {
        debug(chalk.green(`Ejecutando git pull en back: ${project.name}`));
        process.chdir(path.join(basedirBack, project.name));
        const stdoutPullBack = execSync("git pull", {
          encoding: "utf-8",
        });
        debug(stdoutPullBack);
        const stdoutDiffBack = execSync("git diff --name-only HEAD@{1} HEAD", {
          encoding: "utf-8",
        });
        debug(stdoutDiffBack);
        if (stdoutDiffBack.includes("package.json")) {
          const stdoutInstall = execSync("npm i", {
            encoding: "utf-8",
          });
          debug(stdoutInstall);
        }
      }

      if (project.repo.front) {
        debug(chalk.green(`Ejecutando git pull en front: ${project.name}`));
        process.chdir(path.join(basedirFront, project.name));
        const stdoutPullFront = execSync("git pull", {
          encoding: "utf-8",
        });
        debug(stdoutPullFront);
        const stdoutDiffFront = execSync("git diff --name-only HEAD@{1} HEAD", {
          encoding: "utf-8",
        });
        debug(stdoutDiffFront);
        if (stdoutDiffFront.includes("package.json")) {
          debug(chalk.green("Instalando nuevas dependencias"));
          const stdoutInstall = execSync("npm i", {
            encoding: "utf-8",
          });
          debug(stdoutInstall);
        }
      }

      resolve();
    } catch (error) {
      debug(chalk.red(error.message));
      reject();
    }
  });

const triggerPull = async (req, res, next) => {
  const { projectId, projectIds, parallel } = req.body;
  try {
    if (projectId) {
      const project = await Project.findById(projectId);
      debug(chalk.green(`Iniciando pull en ${project.name}`));
      await trigerPullProject(project);
      res.json({ pull: "ok" });
    } else {
      const projects = await Project.find({ _id: { $in: projectIds } });
      debug(chalk.green(`Iniciando pull en ${projects.length} proyectos`));
      if (parallel) {
        const pullPromises = projects.map((project) =>
          trigerPullProject(project)
        );
        await Promise.all(pullPromises);
        res.json({ pull: "ok" });
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const project of projects) {
          // eslint-disable-next-line no-await-in-loop
          await trigerPullProject(project);
        }
        res.json({ pull: "ok" });
      }
    }
  } catch (error) {
    const message = "Error en git pull";
    debug(chalk.red(message));
    next(new Error(message));
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
  triggerPull,
};
