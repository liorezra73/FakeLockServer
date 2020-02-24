const poolPromise = require("../db");
const sql = require("mssql/msnodesqlv8");
const generateError = require("../../errors/generateError");

const getCommentsByPostId = async (postId, userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", sql.BigInt, postId)
    .input("userId", sql.BigInt, userId)
    .execute("GetCommentsByPostId");
  const comments = result.recordset;
  comments.forEach(comment => {
    comment.tags = JSON.parse(comment.tags);
    comment.usersTags = JSON.parse(comment.usersTags);
    comment.userLiked
      ? (comment.userLiked = true)
      : (comment.userLiked = false);
  });
  return comments;
};

const createComment = async comment => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("content", sql.VarChar, comment.content)
    .input("userId", sql.BigInt, comment.userId)
    .input("publishDate", sql.Date, comment.publishDate)
    .input("postId", sql.BigInt, comment.postId)
    .input("tagsJson", sql.NVarChar, comment.tags)
    .input("usersTagsJson", sql.NVarChar, comment.usersTags)
    .execute("CreateNewComment");

  if (result.recordsets.length > 0) {
    const comment = { ...result.recordsets[0][0] };
    comment.tags = [...result.recordsets[1]];
    comment.usersTags = [...result.recordsets[2]];
    return comment;
  }
};

const deleteComment = async id => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("id", sql.BigInt, id)
    .execute("DeleteComment");
};

const getCommentById = async (id,userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .input("likedUserId", sql.BigInt, userId)
    .execute("GetCommentById");

  if (result.recordset.length > 0) {
    return result.recordset[0];
  } else {
    throw generateError(
      "CommentNotFound",
      `Post with the id "${id}" was not found`
    );
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment,
  getCommentById
};
