require("dotenv").config();
const debug = require("debug")("proyectos-api:server:initialize");
const chalk = require("chalk");
const app = require("./server");
const initializeServer = require("./server/initializeServer");

const port = +process.env.PORT || 4000;

(async () => {
  try {
    await initializeServer(app, port);
    debug(chalk.yellow(`Servidor iniciado en http://localhost:${port}`));
  } catch (error) {
    debug(chalk.red(`Error al iniciar el servidor: ${error.message}`));
  }
})();
