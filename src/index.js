require("dotenv").config();
const debug = require("debug")("proyectos-api:server:initialize");
const chalk = require("chalk");
const connectDB = require("./database");
const app = require("./server");
const initializeServer = require("./server/initializeServer");

const port = +process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_CONNECTION).catch((error) => {
      debug(chalk.red(`Error al iniciar la base de datos: ${error.message}`));
      throw new Error();
    });
    debug(chalk.blue("Base de datos iniciada"));
    await initializeServer(app, port).catch((error) => {
      debug(chalk.red(`Error al iniciar el servidor: ${error.message}`));
      throw new Error();
    });
    debug(chalk.yellow(`Servidor iniciado en http://localhost:${port}`));
  } catch (error) {
    process.exit(1);
  }
})();
