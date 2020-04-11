const Joi = require("@hapi/joi");

const commentsQuery = Joi.object({
  size: Joi.number().integer().min(1).required(),
  searchAfterScore: Joi.number(),
  searchAfterId: Joi.string(),
}).and("searchAfterScore", "searchAfterId");

module.exports = commentsQuery;
