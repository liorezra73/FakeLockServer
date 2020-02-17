const poolPromise = require("../db");
const sql = require("mssql/msnodesqlv8");
const generateError = require("../../errors/generateError");

const getPostById = async id => {
  const pool = await poolPromise;
  const res = await pool
    .request()
    .input("id", sql.Int, id)
    .execute("GetPostById");
  if (res.recordset.length > 0) {
    const post = {
      ...res.recordsets[0][0],
      user: res.recordsets[1][0],
      tags: res.recordsets[2],
      usersTags: res.recordsets[3],
      likes: res.recordsets[4][0]
    };
    post.Location = {
      latitude: post.Location.points[0].x,
      longtitude: post.Location.points[0].y
    };
    return post;
  } else {
    throw generateError(
      "PostNotFound",
      `Post with the id "${id}" was not found`
    );
  }
};

const createPost = async newPost => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("text", sql.VarChar, newPost.text)
    .input("photo", sql.VarChar, newPost.photo)
    .input("userId", sql.VarChar, newPost.userId)
    .input("publishDate", sql.Date, newPost.publishDate)
    .input("latitude", sql.Float, newPost.location.latitude)
    .input("longtitude", sql.Float, newPost.location.longtitude)
    .input("tagsJson", sql.NVarChar, newPost.tags)
    .input("usersTagsJson", sql.NVarChar, newPost.usersTags)
    .execute("CreatePost");
  return result.recordset[0];
};

const getAllPosts = async () => {
  const pool = await poolPromise;
  const result = await pool.request().execute("GetAllPosts");
  return result.recordsets[0];
};

const deletePost = async id => {
  const pool = await poolPromise;
  const postId = await pool
    .request()
    .input("id", sql.BigInt, id)
    .execute("DeletePost");
  return postId;
};

module.exports = {
  getPostById,
  createPost,
  getAllPosts,
  deletePost
};
