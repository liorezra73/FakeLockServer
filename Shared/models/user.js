const Joi = require("@hapi/joi");
const validation = require("../validation");
const jwt = require("jsonwebtoken");

const user = Joi.object({
  username: validation.stringValidation(3, 100).alphanum(),
  fullName: validation.stringValidation(3, 200),
  address: validation.stringValidation(3, 200),
  jobAddress: validation.stringValidation(3, 200),
  password: validation.stringValidation(3, 1024),
  repeatPassword: Joi.ref("password"),
  birthDate: Joi.date()
    .max(new Date())
    .required()
}).with("password", "repeatPassword");

module.exports = user;
