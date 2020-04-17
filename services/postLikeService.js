const likeRepository = require("../Data/repositories/likeRepository");
const postRepository = require("../Data/repositories/postRepository");
const elasticSearchErrorHandling = require("../errors/elasticSearchErrorHandling");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");
const socketService = require("./socketService");

const doLike = async (userId, postId) => {
  try {
    const postExists = await postRepository.postExists(postId);
    if (!postExists) {
      throw generateError("PostNotFound", `post with id ${postId} not found`);
    }
    return await likeRepository.addLike(userId, postId);
    
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
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
    const postExists = await postRepository.postExists(postId);
    if (!postExists) {
      throw generateError("PostNotFound", `post with id ${postId} not found`);
    }
    return await likeRepository.unLike(userId, postId);
   
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
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
