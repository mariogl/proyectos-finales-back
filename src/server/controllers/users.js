require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    const error = createCustomError("Wrong credentials", 401);
    return next(error);
  }

  const userData = {
    id: existingUser.id,
    name: existingUser.name,
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return res.json({ token });
};

module.exports = {
  loginUser,
  registerUser,
};
