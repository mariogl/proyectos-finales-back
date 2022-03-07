const Project = require("../../database/models/Project");

const getAllProjects = async (req, res) => {
  const projects = await Project.find().sort({ student: 1 });

  res.json({
    projects,
  });
};

module.exports = {
  getAllProjects,
};
