const likeRepository = require("../Data/repositories/likeRepository");
const postRepository = require("../Data/repositories/postRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");

const doLike = async (userId, postId) => {
  try {
    console.log("service like");
    const postExists = await postRepository.postExists(postId);
    if (!postExists) {
      throw generateError("PostNotFound", `post with id ${postId} not found`);
    }
    await likeRepository.addLike(userId, postId);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "PostNotFound":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const unLike = async (userId, postId) => {
  try {
    console.log("service unlike");
    const postExists = await postRepository.postExists(postId);
    if (!postExists) {
      throw generateError("PostNotFound", `post with id ${postId} not found`);
    }
    await likeRepository.unLike(userId, postId);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "PostNotFound":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = {
  doLike,
  unLike,
};
