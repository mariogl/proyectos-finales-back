const initializeServer = (app, port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve();
    });

    server.on("error", (error) => {
      reject(error);
    });
  });

module.exports = initializeServer;
