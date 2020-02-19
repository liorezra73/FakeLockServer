const Joi = require("@hapi/joi");

const filter = Joi.object({
  publishers: Joi.array().items(Joi.number()),

  latitude: Joi.number()
    .min(-90)
    .max(90),
  longtitude: Joi.number()
    .min(-180)
    .max(180),
  distance: Joi.number()
    .min(0)
    .max(19000000),

  tags: Joi.array().items(Joi.string()),

  usersTags: Joi.array().items(Joi.number()),

  startDate: Joi.date()
    .max("now")
    .when("endDate", {
      is: Joi.exist(),
      then: Joi.date().less(Joi.ref("endDate"))
    }),
  endDate: Joi.date().max("now"),
  orderBy: Joi.string().valid("likes","date").required()
}).and("distance", "latitude", "longtitude");

module.exports = filter;
