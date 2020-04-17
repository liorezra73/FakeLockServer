const commentRepository = require("../Data/repositories/commentRepository");
const dbErrorHandling = require("../errors/dbErrorHandling");
const generateError = require("../errors/generateError");
const elasticSearchErrorHandling = require("../errors/elasticSearchErrorHandling");
const postRepository = require("../Data/repositories/postRepository");
const userRepository = require("../Data/repositories/userRepository");
const logger = require("../logger/logger");

const getCommentsByPostId = async (postId, userId, commentsQuery) => {
  try {
    const exists = await postRepository.postExists(postId);
    if (exists) {
      const result = await commentRepository.getCommentsByPostId(
        postId,
        userId,
        commentsQuery
      );
      if (result.length > 0) {
        return result;
      } else {
        return [];
      }
    } else {
      throw generateError("PostNotFound", "post not found");
    }
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

const createComment = async (comment, userId, postId) => {
  try {
    const existPost = await postRepository.postExists(postId);
    if (!existPost) {
      throw generateError("PostNotFound", `post with id:${postId} not found`);
    }
    const user = await userRepository.getUserById(userId);
    comment.user = {
      id: userId,
      username: user.Username,
    };
    comment.postId = postId;
    comment.publishDate = new Date();

    const usersTags = await userRepository.getUsersByIds(
      JSON.stringify(comment.usersTags)
    );
    comment.usersTags = [];
    usersTags.forEach((user) => {
      comment.usersTags.push({ user_id: user.Id, username: user.Username });
    });

    return await commentRepository.createComment(comment);
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
const deleteComment = async (postId, commentId) => {
  try {
    await postRepository.getPostById(postId);
    const existComment = await commentRepository.getCommentById(commentId);
    await commentRepository.deleteComment(existComment.Id);
  } catch (err) {
    const elasticError = elasticSearchErrorHandling(err);
    if (elasticError) throw elasticError;
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
  deleteComment,
};
