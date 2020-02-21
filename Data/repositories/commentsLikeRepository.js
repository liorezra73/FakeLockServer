const poolPromise = require("../db");
const sql = require("mssql/msnodesqlv8");

const userLikedComment = async (userId, commentId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("commentId", sql.BigInt, commentId)
    .execute("UserLikedComment");

  return result.recordset.length > 0;
};

const addLikeToComment = async (userId, commentId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("commentId", sql.BigInt, commentId)
    .execute("AddLikeToComment");
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
  addLikeToComment,
  unLikeToComment
};
