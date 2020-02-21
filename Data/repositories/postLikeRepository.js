const poolPromise = require("../db");
const sql = require("mssql/msnodesqlv8");

const userLikedPost = async (userId, postId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("postId", sql.BigInt, postId)
    .execute("UserLikedPost");

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

const unLikeToPost = async (userId, postId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("userId", sql.BigInt, userId)
    .input("postId", sql.BigInt, postId)
    .execute("DeletePostLike");
};

module.exports = {
  userLikedPost,
  addLikeToPost,
  unLikeToPost
};
