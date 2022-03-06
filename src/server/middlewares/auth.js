const jwt = require("jsonwebtoken");
const createCustomError = require("../utils/errors");

const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!jwt.verify(token, process.env.JWT_SECRET)) {
    const error = createCustomError("Token invalid", 401);
    return next(error);
  }
  return next();
};

module.exports = auth;
