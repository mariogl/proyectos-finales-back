const { Joi } = require("express-validation");
const userDataMinimums = require("../utils/constants");

const registerUserRequestSchema = {
  body: Joi.object({
    name: Joi.string().required().min(userDataMinimums.name),
    username: Joi.string().required().min(userDataMinimums.username),
    password: Joi.string().required().min(userDataMinimums.password),
  }),
};

const loginUserRequestSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const authUserRequestSchema = {
  headers: Joi.object({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }).unknown(),
};

module.exports = {
  loginUserRequestSchema,
  registerUserRequestSchema,
  authUserRequestSchema,
};
