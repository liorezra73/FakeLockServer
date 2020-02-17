const Joi = require("@hapi/joi");

const idValidator = () =>
  Joi.number()
    .integer()
    .min(1)
    .required();

const post = Joi.object({
  postId: idValidator()
});

const comment = Joi.object({
  postId: idValidator(),
  commentId: idValidator()
});

module.exports = {
  post,
  comment,
  // postLike,
  // commentLike
};
