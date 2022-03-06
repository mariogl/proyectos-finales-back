require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const createCustomError = require("../utils/errors");

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.ROUNDS_BCRYPT
    );
    await User.create({
      name,
      username,
      password: hashedPassword,
    });
    res.status(201).json({});
  } catch {
    const error = createCustomError("User already exists", 409);
    next(error);
  }
};

const loginUser = () => {};

module.exports = {
  loginUser,
  registerUser,
};
