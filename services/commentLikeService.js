const commentLikeRepository = require("../Data/repositories/commentsLikeRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");

const doLike = async (userId, commentId) => {
  try {
    const didLike = await commentLikeRepository.userLikedComment(
      userId,
      commentId
    );
    if (didLike) {
      throw generateError(
        "LikeExists",
        `user ${userId} already liked post ${commentId}`
      );
    }
    await commentLikeRepository.addLikeToComment(userId, commentId);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "LikeExists":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const unLike = async (userId, commentId) => {
  try {
    const didLike = await commentLikeRepository.userLikedComment(
      userId,
      commentId
    );
    if (!didLike) {
      throw generateError(
        "LikeNotExists",
        `user ${userId} not liked post ${commentId}`
      );
    }
    await commentLikeRepository.unLikeToComment(userId, commentId);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "LikeNotExists":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = { doLike, unLike };
