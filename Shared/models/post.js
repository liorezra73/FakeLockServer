const Joi = require("@hapi/joi");
const validation = require("../validation");

const post = Joi.object({
  text: validation.stringValidation(3, 200),
  location: Joi.object().keys({
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required(),
    longtitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
  }).required(),
  tags: Joi.array().items(Joi.string()),
  usersTags: Joi.array().items(Joi.number())
});

module.exports = post;
