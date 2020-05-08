const Joi = require("@hapi/joi");
const validation = require("../validation")


const login = Joi.object({
  username: validation.stringValidation(3, 200).alphanum().required(),
  password: validation.stringValidation(3, 1024).required(),
})

module.exports = login;