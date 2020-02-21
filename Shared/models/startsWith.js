const Joi = require("@hapi/joi");

const startsWith = Joi.object({
  username: Joi.string()
    .min(2)
    .max(50)
});
module.exports = startsWith;
