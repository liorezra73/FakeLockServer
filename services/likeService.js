const likeRepository = require("../Data/repositories/likeRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");

const switchLikeToPost = async (userId, postId) => {
  try {
    const didLike = await likeRepository.userLikedPost(userId, postId);
    didLike
      ? await likeRepository.unLikeToPost(userId, postId)
      : await likeRepository.addLikeToPost(userId, postId);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    else {
      logger.error(err);
      throw generateError("ServerError", "Something went wrong");
    }
  }
};

const switchLikeToComment = async (userId, commentId) => {
  try {
    const didLike = await likeRepository.userLikedComment(userId, commentId);
    didLike
      ? await likeRepository.unLikeToComment(userId, commentId)
      : await likeRepository.addLikeToComment(userId, commentId);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    else {
      logger.error(err);
      throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = {
  switchLikeToPost,
  switchLikeToComment
};
