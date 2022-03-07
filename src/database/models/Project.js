const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  student: {
    type: String,
    required: true,
  },
  trello: {
    type: String,
  },
});

const Project = model("Project", ProjectSchema, "projects");

module.exports = Project;
