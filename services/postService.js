const postRepository = require("../Data/repositories/postRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const photoService = require("./photoService");

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
    console.error(err);
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "uploadPhotoFailed":
        throw { ...err };
      default:
        throw generateError("ServerError", "Something went wrong");
    }
  }
};
const getPostById = async id => {
  try {
    const result = await postRepository.getPostById(id);
    //get if the user liked post
    return result;
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "PostNotFound":
        throw { ...err };
      default:
        //loger
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const deletePost = async id => {
  try {
    const existPost = await getPostById(id);
    await postRepository.deletePost(existPost.post.Id);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "PostNotFound":
        throw { ...err };
      default:
        //loger
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

//fixing?
const getAllPosts = async () => {
  try {
    const result = await postRepository.getAllPosts();
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createPost,
  getPostById,
  deletePost,
  getAllPosts
};
