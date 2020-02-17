const Joi = require("@hapi/joi");

const stringValidation = (min, max) => {
    return Joi.string()
      .min(min)
      .max(max)
      .required();
  };

module.exports = {stringValidation};