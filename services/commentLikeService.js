const likeRepository = require("../Data/repositories/likeRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
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
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
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
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
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
