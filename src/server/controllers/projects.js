require("dotenv").config();
const debug = require("debug")("proyectos-api:server:controllers:projects");
const chalk = require("chalk");
const { execSync } = require("child_process");
const path = require("path");
const Project = require("../../database/models/Project");
const sonarService = require("./sonarService");

const basedir = process.env.BASE_DIR;
const basedirBack = path.join(basedir, "back");
const basedirFront = path.join(basedir, "front");

const getProjects = async (req, res) => {
  const { challengeId, tutorId } = req.params;
  const { byCoverage } = req.query;
  const query = { challenge: challengeId };
  if (tutorId) {
    query.tutor = tutorId;
  }

  const projects = await Project.find(query)
    .sort({ student: 1 })
    .populate("tutor", "-password -username")
    .lean();

  let resultProjects = await sonarService(projects);

  if (byCoverage === "high" || byCoverage === "low") {
    resultProjects = resultProjects.filter((resultProject) =>
      byCoverage === "low"
        ? resultProject.sonarInfoFront.coverage < 80 ||
          resultProject.sonarInfoBack.coverage < 80
        : resultProject.sonarInfoFront.coverage >= 80 ||
          resultProject.sonarInfoBack.coverage >= 80
    );
  }

  res.json({
    projects: resultProjects,
  });
};

const createProject = async (req, res) => {
  const { challenge, name, student, trello, tutor, repo, sonarKey, prod } =
    req.body;

  const createdProject = await Project.create({
    challenge,
    name,
    student,
    trello,
    repo,
    tutor,
    prod,
    sonarKey,
  });
  res.status(201);
  res.json({
    project: createdProject,
  });
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
  triggerPull,
};
