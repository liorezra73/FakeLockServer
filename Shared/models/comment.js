const Joi = require("@hapi/joi");

const comment = Joi.object({
  content: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  usersTags: Joi.array().items(Joi.number())
}).or("content", "tags", "usersTags");

module.exports = comment;
