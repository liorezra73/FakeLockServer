const postLikeRepository = require("../Data/repositories/postLikeRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");

const doLike = async (userId, postId) => {
  try {
    const didLike = await postLikeRepository.userLikedPost(userId, postId);
    if (didLike) {
      throw generateError(
        "LikeExists",
        `user ${userId} already liked post ${postId}`
      );
    }
    await postLikeRepository.addLikeToPost(userId, postId);
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

const unLike = async (userId, postId) => {
  try {
    const didLike = await postLikeRepository.userLikedPost(userId, postId);
    if (!didLike) {
      throw generateError(
        "LikeNotExists",
        `user ${userId} not liked post ${postId}`
      );
    }
    await postLikeRepository.unLikeToPost(userId, postId);
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

module.exports = {
  doLike,
  unLike
};
