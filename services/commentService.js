const commentRepository = require("../Data/repositories/commentRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const postRepository = require("../Data/repositories/postRepository");

const getCommentsByPostId = async postId => {
  try {
    const res = await postRepository.getPostById(postId);
    const result = await commentRepository.getCommentsByPostId(res.post.Id);
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

const createComment = async (comment, userId, postId) => {
  try {
    const existPost = await postRepository.getPostById(postId);
    comment.postId = existPost.post.Id;
    comment.userId = userId;
    comment.publishDate = new Date();
    comment.tags = JSON.stringify(comment.tags);
    comment.usersTags = JSON.stringify(comment.usersTags);
    await commentRepository.createComment(comment);
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
const deleteComment = async (postId, commentId) => {
  try {
    const existPost = await postRepository.getPostById(postId);
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
        //loger
        throw generateError("ServerError", "Something went wrong");
    }
  }
};
module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment
};
