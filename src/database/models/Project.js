const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
  },
  student: {
    type: String,
    required: true,
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  trello: String,
  repo: {
    back: String,
    front: String,
  },
  prod: {
    back: String,
    front: String,
  },
  sonarKey: {
    back: String,
    front: String,
  },
});

const Project = model("Project", ProjectSchema, "projects");

module.exports = Project;
