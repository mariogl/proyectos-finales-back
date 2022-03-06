const { Joi } = require("express-validation");

const registerUserRequestSchema = {
  body: Joi.object({
    name: Joi.string().required().min(2),
    username: Joi.string().required().min(6),
    password: Joi.string().required().min(7),
  }),
};

module.exports = registerUserRequestSchema;
