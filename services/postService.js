const postRepository = require("../Data/repositories/postRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const elasticSearchErrorHandling = require("../errors/elasticSearchErrorHandling");
const generateError = require("../errors/generateError");
const photoService = require("./photoService");
const userRepository = require("../Data/repositories/userRepository");
const logger = require("../logger/logger");

const createPost = async (newPost, userId, photo) => {
  try {
    newPost.photo = await photoService.uploadPhoto(photo);
    const user = await userRepository.getUserById(userId);
    newPost.user = {
      userId: userId,
      username: user.Username,
    };
    newPost.publishDate = new Date();
    const usersTags = await userRepository.getUsersByIds(
      JSON.stringify(newPost.usersTags)
    );
    newPost.usersTags = [];
    usersTags.forEach((user) => {
      newPost.usersTags.push({ user_id: user.Id, username: user.Username });
    });

    const result = await postRepository.createPost(newPost);
    return result;
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "uploadPhotoFailed":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const getPostById = async (id, userId) => {
  try {
    const result = await postRepository.getPostById(id, userId);
    return result;
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
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

const deletePost = async (id) => {
  try {
    const existPost = await getPostById(id);
    await postRepository.deletePost(existPost.Id);
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
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

const getPosts = async (filter) => {
  try {
    if (filter.tags) {
      filter.tags = filter.tags.join(" ");
    }
    const result = await postRepository.getPosts(filter);
    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = {
  createPost,
  getPostById,
  deletePost,
  getPosts,
};
