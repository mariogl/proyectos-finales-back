const { Joi } = require("express-validation");
const userDataMinimums = require("../utils/constants");

const registerUserRequestSchema = {
  body: Joi.object({
    name: Joi.string().required().min(userDataMinimums.name),
    username: Joi.string().required().min(userDataMinimums.username),
    password: Joi.string().required().min(userDataMinimums.password),
  }),
};

module.exports = registerUserRequestSchema;
