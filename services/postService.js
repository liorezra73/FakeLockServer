const postRepository = require("../Data/repositories/postRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const photoService = require("./photoService");
const userRepository = require("../Data/repositories/userRepository");
const logger = require("../logger/logger");

const createPost = async (newPost, userId, photo) => {
  try {
    const user = await userRepository.getUserById(userId);
    newPost.user = {
      userId: userId,
      username: user.Username
    };
    newPost.publishDate = new Date();
    // newPost.tags = JSON.stringify(newPost.tags);
    const usersTags = await userRepository.getUsersByIds(JSON.stringify(newPost.usersTags));
    newPost.usersTags = []
    usersTags.forEach(user=>{
      newPost.usersTags.push({user_id:user.Id,username:user.Username})
    })
    
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
        console.log(err)
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const getPostById = async (id) => {
  try {
    const result = await postRepository.getPostById(id);
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
