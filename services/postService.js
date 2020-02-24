const postRepository = require("../Data/repositories/postRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const photoService = require("./photoService");
const logger = require("../logger/logger");
const createPost = async (newPost, userId, photo) => {
  try {
    newPost.userId = userId;
    newPost.publishDate = new Date();
    newPost.tags = JSON.stringify(newPost.tags);
    newPost.usersTags = JSON.stringify(newPost.usersTags);
    newPost.photo = await photoService.uploadPhoto(photo);
    const result = await postRepository.createPost(newPost);
    return result;
  } catch (err) {
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

const deletePost = async id => {
  try {
    const existPost = await getPostById(id);
    await postRepository.deletePost(existPost.Id);
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

//fixing?
const getPosts = async filter => {
  try {
    filter.publishers = JSON.stringify(filter.publishers);
    filter.tags = JSON.stringify(filter.tags);
    filter.usersTags = JSON.stringify(filter.usersTags);
    const result = await postRepository.getPosts(filter);
    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (err) {
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
  getPosts
};
