const poolPromise = require("../db");
const sql = require("mssql/msnodesqlv8");
const generateError = require("../../errors/generateError");

const userLikedPost = async (userId, postId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("postId", sql.BigInt, postId)
    .execute("UserLikedPost");

  return result.recordset.length > 0;
};

const userLikedComment = async (userId, commentId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("commentId", sql.BigInt, commentId)
    .execute("UserLikedComment");

  return result.recordset.length > 0;
};

const addLikeToPost = async (userId, postId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("postId", sql.BigInt, postId)
    .execute("AddLikeToPost");
};

const addLikeToComment = async (userId, commentId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("commentId", sql.BigInt, commentId)
    .execute("AddLikeToComment");
};

const unLikeToPost = async (userId, postId) => {
    const pool = await poolPromise;
    await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .input("postId", sql.BigInt, postId)
      .execute("DeletePostLike");
  };

  const unLikeToComment = async (userId, commentId) => {
    const pool = await poolPromise;
    await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .input("commentId", sql.BigInt, commentId)
      .execute("DeleteCommentLike");
  };

module.exports = {
  userLikedComment,
  userLikedPost,
  addLikeToPost,
  addLikeToComment,
  unLikeToPost,
  unLikeToComment
};
