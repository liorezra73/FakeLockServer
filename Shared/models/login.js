const Joi = require("@hapi/joi");
const validation = require("../validation")


const login = Joi.object({
  username: validation.stringValidation(3, 50).alphanum(),
  password: validation.stringValidation(3, 1024),
})

module.exports = login;