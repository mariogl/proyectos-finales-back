require("dotenv").config();
const Challenge = require("../../database/models/Challenge");

const getAllChallenges = async (req, res) => {
  const challenges = await Challenge.find().sort({ date: 1 });

  res.json({
    challenges,
  });
};

module.exports = {
  getAllChallenges,
};
