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

const getProjectsByTutor = async (req, res) => {
  const { challengeId, tutorId } = req.params;
  const projects = await Project.find({
    challenge: challengeId,
    tutor: tutorId,
  })
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
      `https://sonarcloud.io/api/measures/component?component=${projectKey}&metricKeys=sqale_index,code_smells,bugs,vulnerabilities,security_hotspots,coverage`
    );
    const debt = measures.find(
      (measure) => measure.metric === "sqale_index"
    ).value;
    const codeSmells = measures.find(
      (measure) => measure.metric === "code_smells"
    ).value;
    const bugs = measures.find((measure) => measure.metric === "bugs").value;
    const vulnerabilities = measures.find(
      (measure) => measure.metric === "vulnerabilities"
    ).value;
    const coverage = measures.find(
      (measure) => measure.metric === "coverage"
    ).value;
    const securityHotspots = measures.find(
      (measure) => measure.metric === "security_hotspots"
    ).value;

    res.json({
      debt,
      codeSmells,
      bugs,
      vulnerabilities,
      securityHotspots,
      coverage,
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
  getProjectsByTutor,
  createProject,
  getProjectSonarData,
  triggerSonarScanner,
  triggerPull,
};
