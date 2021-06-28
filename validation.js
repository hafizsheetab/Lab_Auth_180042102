//Validation
const Joi = require("@hapi/joi");

//Registration Validation
const registrationValidation = (data) => {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    rePassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
  };
  return Joi.validate(data, schema);
};

const loginValidation = (data) => {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(data, schema);
};

module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;