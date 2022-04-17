const { Schema, model } = require("mongoose");

const ChallengeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Challenge = model("Challenge", ChallengeSchema, "challenges");

module.exports = Challenge;
