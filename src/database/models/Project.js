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
  trello: String,
  repo: {
    back: String,
    front: String,
  },
});

const Project = model("Project", ProjectSchema, "projects");

module.exports = Project;
