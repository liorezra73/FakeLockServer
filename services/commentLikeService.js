const likeRepository = require("../Data/repositories/likeRepository");
const elasticSearchErrorHandling = require("../errors/elasticSearchErrorHandling");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");
const commentRepository = require("../Data/repositories/commentRepository");

const doLike = async (userId, commentId) => {
  try {
    const exists = await commentRepository.commentExists(commentId);
    if (!exists) {
      throw generateError(
        "CommentNotFound",
        `comment with id ${commentId} does not exist`
      );
    }

    await likeRepository.addLike(userId, commentId);
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
    switch (err.name) {
      case "CommentNotFound":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const unLike = async (userId, commentId) => {
  try {
    const exists = await commentRepository.commentExists(commentId);
    if (!exists) {
      throw generateError(
        "CommentNotFound",
        `comment with id ${commentId} does not exist`
      );
    }
    await likeRepository.unLike(userId, commentId);
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
    switch (err.name) {
      case "CommentNotFound":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = { doLike, unLike };
