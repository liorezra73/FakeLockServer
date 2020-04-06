const poolPromise = require("../db");
const sql = require("mssql");
const generateError = require("../../errors/generateError");
const elsaticClient = require("../elasticSearch");

const createPost = async (newPost) => {
  const query = await elsaticClient.index({
    index: "fakelock",
    body: {
      text: newPost.text,
      photo: newPost.photo,
      user: {
        user_id: newPost.user.userId,
        username: newPost.user.username,
      },
      tags: newPost.tags,
      publish_date: newPost.publishDate,
      location: {
        lat: newPost.location.latitude,
        lon: newPost.location.longtitude,
      },
      likes: [],
      users_tags: newPost.usersTags,
    },
  });
  return query.body._id;
};

const getPostById = async (id) => {
  const query = await elsaticClient.search({
    index: "fakelock",
    body: {
      _source: [
        "text",
        "location",
        "photo",
        "publish_date",
        "tags",
        "users_tags",
        "user",
      ],
      script_fields: {
        likes: {
          script: {
            source: "params?._source?.likes?.length",
          },
          script: {
            source: "params?._source?.likes?.length",
          }
        },
      },
      query: {
        bool: {
          must: [
            {
              term: {
                _id: id,
              },
            },
          ],
          should: [
            {
              has_child: {
                type: "comment",
                inner_hits: {
                  _source: false,
                  size: 0,
                },
                query: {
                  match_all: {},
                },
              },
            },
          ],
        },
      },
    },
  });
  const res = query.body.hits.hits[0];
  console.log(res.fields)
  const post = {
    photo:res._source.photo,
    user: res._source.user,
    tags: res._source.tags,
    usersTags: res._source.users_tags,
    likes: res.fields.likes[0],
    commentsCount: res.inner_hits.comment.hits.total.value,
    id: res._id,
    isLikedByUser: false
  };
  post.Location = {
    latitude: res._source.location.lat,
    longtitude: res._source.location.lon
  };
  return post;
};


// {
//   node_1           |     _index: 'fakelock',
//   node_1           |     _type: '_doc',
//   node_1           |     _id: 'AlZJUHEB_wzYOa0ErjE6',
//   node_1           |     _score: 1,
//   node_1           |     _source: {
//   node_1           |       photo: 'be39d539-b2f2-4f94-a6eb-d2164625ef51',
//   node_1           |       users_tags: [Array],
//   node_1           |       location: [Object],
//   node_1           |       text: 'bob',
//   node_1           |       user: [Object],
//   node_1           |       publish_date: '2020-04-06T16:18:58.121Z',
//   node_1           |       tags: [Array]
//   node_1           |     },
//   node_1           |     fields: { likes: [Array] },
//   node_1           |     inner_hits: { comment: [Object] }
//   node_1           |   }


const getPosts = async (filter) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input(
      "publishers",
      sql.NVarChar,
      filter.publishers ? filter.publishers : null
    )
    .input(
      "startDate",
      sql.DateTime,
      filter.startDate ? filter.startDate : null
    )
    .input("endDate", sql.DateTime, filter.endDate ? filter.endDate : null)
    .input("positionLat", sql.Float, filter.latitude ? filter.latitude : null)
    .input(
      "positionLong",
      sql.Float,
      filter.longtitude ? filter.longtitude : null
    )
    .input("distance", sql.Float, filter.distance ? filter.distance : null)
    .input("tagsJson", sql.NVarChar, filter.tags ? filter.tags : null)
    .input("userTags", sql.NVarChar, filter.usersTags ? filter.usersTags : null)
    .input("orderBy", sql.VarChar, filter.orderBy)
    .execute("FilterPosts");
  result.recordsets[0].forEach((post) => {
    post.location = {
      latitude: post.location.points[0].x,
      longtitude: post.location.points[0].y,
    };
  });

  return result.recordsets[0];
};

const deletePost = async (id) => {
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
  getPosts,
  deletePost,
};
