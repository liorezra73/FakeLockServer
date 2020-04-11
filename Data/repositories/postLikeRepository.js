const poolPromise = require("../db");
const sql = require("mssql");
const elsaticClient = require("../elasticSearch");

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
  await elsaticClient.update({
    index: "fakelock",
    id: postId,
    body: {
      script: {
        lang: "painless",
        params: {
          userId: userId,
        },
        source:
          "if (!ctx._source.likes.contains(params.userId)){ctx._source.likes.add(params.userId);}else{ctx.op = 'none'}",
      },
    },
  });
};

const unLikeToPost = async (userId, postId) => {
  await elsaticClient.update({
    index: "fakelock",
    id: postId,
    body: {
      script: {
        lang: "painless",
        params: {
          userId: userId,
        },
        source:
          "if (ctx._source.likes.contains(params.userId)){ctx._source.likes.remove(ctx._source.likes.indexOf(params.userId));}else{ctx.op = 'none'}",
      },
    },
  });
};

module.exports = {
  userLikedPost,
  addLikeToPost,
  unLikeToPost,
};
