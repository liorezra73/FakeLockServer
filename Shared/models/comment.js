const Joi = require("@hapi/joi");
const validation = require("../validation");

const comment = Joi.object({
  content: validation.stringValidation(3, 200),
  tags: Joi.array().items(Joi.string()),
  usersTags: Joi.array().items(Joi.number())
});

module.exports = comment;
