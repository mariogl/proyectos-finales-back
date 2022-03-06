const mongoose = require("mongoose");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.connect(connectionString, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });

module.exports = connectDB;
