require("dotenv").config();
const jwt = require("jsonwebtoken");
const createCustomError = require("../utils/errors");

const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    const error = createCustomError("Token invalid", 401);
    next(error);
  }
};

module.exports = auth;
