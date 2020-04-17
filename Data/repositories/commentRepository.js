const poolPromise = require("../db");
const sql = require("mssql");
const generateError = require("../../errors/generateError");
const elsaticClient = require("../elasticSearch");

const getCommentsByPostId = async (postId, userId, commentsQuery) => {
  const q = {
    from: 0,
    size: commentsQuery.size,
    script_fields: {
      likes: {
        script: {
          source: "params?._source?.likes?.length",
        },
      },
      user_liked: {
        script: {
          source: `params?._source?.likes.contains(${userId})`,
        },
      },
    },
    _source: ["text", "publish_date", "tags", "users_tags", "user"],
    query: {
      parent_id: {
        type: "comment",
        id: postId,
      },
    },
    sort: [
      {
        publish_date: {
          order: "desc",
        },
      },
      {
        _id: { order: "asc" },
      },
    ],
  };

  if (commentsQuery.searchAfterScore && commentsQuery.searchAfterId) {
    q.search_after = [
      commentsQuery.searchAfterScore,
      commentsQuery.searchAfterId,
    ];
  }

  const query = await elsaticClient.search({
    index: "fakelock",
    body: q,
  });

  const comments = [];
  query.body.hits.hits.forEach((c) => {
    comments.push({
      commentId: c._id,
      content: c._source.text,
      publishDate: c._source.publish_date,
      tags:
        typeof c._source.tags === "string" ? [c._source.tags] : c._source.tags,
      usersTags: c._source.users_tags,
      user: {
        id: c._source.user.user_id,
        username: c._source.user.username,
      },
      userLiked: c.fields.user_liked[0],
      likes: c.fields.likes[0],
    });
  });

  const lastHit = query.body.hits.hits[query.body.hits.hits.length - 1];
  if (lastHit && lastHit.sort) {
    const sort = lastHit.sort;
    comments[comments.length - 1].searchAfter = {
      score: sort[0],
      id: sort[1],
    };
  }

  return comments;

  // {
  //   node_1           |     _index: 'fakelock',
  //   node_1           |     _type: '_doc',
  //   node_1           |     _id: 'VCvgYHEB4pv9G_PD0VXZ',
  //   node_1           |     _score: 0.022989519,
  //   node_1           |     _routing: 'UCvPYHEB4pv9G_PD01X4',
  //   node_1           |     _source: {
  //   node_1           |       users_tags: [Array],
  //   node_1           |       text: 'aaaaa',
  //   node_1           |       user: [Object],
  //   node_1           |       publish_date: '2020-04-09T21:37:58.741Z',
  //   node_1           |       tags: [Array]
  //   node_1           |     },
  //   node_1           |     fields: { user_liked: [Array], likes: [Array] }
  //   node_1           |   }

  // comments.forEach((comment) => {
  //   comment.tags = JSON.parse(comment.tags);
  //   comment.usersTags = JSON.parse(comment.usersTags);
  //   comment.userLiked
  //     ? (comment.userLiked = true)
  //     : (comment.userLiked = false);
  // });
  // return comments;
  //   const pool = await poolPromise;
  //   const result = await pool
  //     .request()
  //     .input("id", sql.BigInt, postId)
  //     .input("userId", sql.BigInt, userId)
  //     .execute("GetCommentsByPostId");
  //   const comments = result.recordset;
  //   comments.forEach((comment) => {
  //     comment.tags = JSON.parse(comment.tags);
  //     comment.usersTags = JSON.parse(comment.usersTags);
  //     comment.userLiked
  //       ? (comment.userLiked = true)
  //       : (comment.userLiked = false);
  //   });
  //   return comments;
};

const createComment = async (comment) => {
  const query = await elsaticClient.index({
    routing: comment.postId,
    index: "fakelock",
    body: {
      text: comment.content,
      user: {
        user_id: comment.user.id,
        username: comment.user.username,
      },
      tags: comment.tags,
      publish_date: comment.publishDate,
      likes: [],
      users_tags: comment.usersTags,
      type: {
        name: "comment",
        parent: comment.postId,
      },
    },
  });

  comment.commentId = query.body._id;
  comment.likes = 0;
  comment.userLiked = false;
  comment.user.userId = parseInt(comment.user.userId);

  const commentsCount = await elsaticClient.count({
    routing: comment.postId,
    index: "fakelock",
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                _routing: comment.postId,
              },
            },
          ],
        },
      },
    },
  });
  return { comment: comment, count: commentsCount.body.count + 1 };
};

const getCommentById = async (id) => {
  const query = await elsaticClient.search({
    index: "fakelock",
    body: {
      script_fields: {
        likes: {
          script: {
            source: "params?._source?.likes?.length",
          },
        },
      },
      _source: ["text", "publish_date", "tags", "users_tags", "user"],
      query: {
        bool: {
          must: [
            {
              term: {
                _id: id,
              },
            },
          ],
        },
      },
    },
  });

  console.log(query.body);

  const hits = query.body.hits.hits[0];
  if (hits && hits.length > 0) {
    const comment = { ...hits._source };
    return comment;
  } else {
    return null;
  }

  console.log(query.body.hits.hits[0]._source);
  console.log(query.body.hits.hits[0].fields);
};

const deleteComment = async (id) => {
  const pool = await poolPromise;
  await pool.request().input("id", sql.BigInt, id).execute("DeleteComment");
};

const commentExists = async (id) => {
  const query = await elsaticClient.get({
    index: "fakelock",
    id: id,
    _source: false,
  });
  return query.body.found;
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment,
  getCommentById,
  commentExists,
};
