const commentRepository = require("../Data/repositories/commentRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const postRepository = require("../Data/repositories/postRepository");
const logger = require("../logger/logger");

const getCommentsByPostId = async (postId, userId) => {
  try {
    const res = await postRepository.getPostById(postId);
    const result = await commentRepository.getCommentsByPostId(res.Id, userId);
    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
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

const createComment = async (comment, userId, postId) => {
  try {
    const existPost = await postRepository.getPostById(postId);
    comment.postId = existPost.Id;
    comment.userId = userId;
    comment.publishDate = new Date();
    comment.tags = JSON.stringify(comment.tags);
    comment.usersTags = JSON.stringify(comment.usersTags);
    return await commentRepository.createComment(comment);
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
const deleteComment = async (postId, commentId) => {
  try {
    await postRepository.getPostById(postId);
    const existComment = await commentRepository.getCommentById(commentId);
    await commentRepository.deleteComment(existComment.Id);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "PostNotFound":
        throw { ...err };
      case "CommentNotFound":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};
module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment
};
