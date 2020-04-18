// const poolPromise = require("../db");
// const sql = require("mssql");
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
      type: {
        name: "post",
      },
    },
  });
  return query.body._id;
};

const postExists = async (id) => {
  const query = await elsaticClient.get({
    index: "fakelock",
    id: id,
    _source: false,
  });
  return query.body.found;
};

const getPostById = async (id, userId) => {
  const query = await elsaticClient.search({
    index: "fakelock",
    body: {
      _source: [
        "location",
        "photo",
        "text",
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
        },
        user_liked: {
          script: {
            source: `params?._source?.likes.contains(${userId})`,
          },
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
  const post = {
    text: res._source.text,
    publishDate: res._source.publish_date,
    photo: res._source.photo,
    user: res._source.user,
    tags:
      typeof res._source.tags === "string"
        ? [res._source.tags]
        : res._source.tags,
    usersTags: res._source.users_tags,
    likes: res.fields.likes[0],
    commentsCount: res.inner_hits.comment.hits.total.value,
    id: res._id,
    isLikedByUser: res.fields.user_liked[0],
  };
  post.Location = {
    latitude: res._source.location.lat,
    longtitude: res._source.location.lon,
  };
  return post;
};

const getPosts = async (filter) => {
  const q = {
    from: 0,
    size: filter.size,
    script_fields: {
      likes: {
        script: {
          source: "params?._source?.likes?.length",
        },
      },
    },
    _source: ["location", "photo", "publish_date"],
    query: {
      bool: {
        must_not: [
          {
            exists: {
              field: "_routing",
            },
          },
        ],
        filter: [
          {
            range: {
              publish_date: {
                gte: filter.startDate ? filter.startDate : null,
                lte: filter.endDate ? filter.endDate : null,
              },
            },
          },
        ],
      },
    },
  };

  if (filter.searchAfterScore && filter.searchAfterId) {
    q.search_after = [filter.searchAfterScore, filter.searchAfterId];
  }

  switch (filter.orderBy) {
    case "likes":
      q.sort = [
        {
          _script: {
            script: "params._source?.likes?.length ?: 0",
            order: "desc",
            type: "number",
          },
        },
        {
          _id: { order: "asc" },
        },
      ];
      break;
    default:
      q.sort = [
        {
          publish_date: {
            order: "desc",
          },
        },
        {
          _id: { order: "asc" },
        },
      ];
      break;
  }

  if (filter.publishers) {
    q.query.bool.filter.push({
      nested: {
        path: "user",
        query: {
          terms: {
            "user.user_id": filter.publishers,
          },
        },
      },
    });
  }

  if (filter.usersTags) {
    q.query.bool.filter.push({
      bool: {
        filter: [
          {
            has_child: {
              type: "comment",
              query: {
                bool: {
                  filter: [
                    {
                      nested: {
                        path: "users_tags",
                        query: {
                          bool: {
                            filter: [
                              {
                                terms: {
                                  "users_tags.user_id": filter.usersTags,
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    });
  }

  if (filter.tags) {
    q.query.bool.should = [
      {
        has_child: {
          type: "comment",
          query: {
            match: {
              tags: filter.tags,
            },
          },
        },
      },
      {
        match: {
          tags: filter.tags,
        },
      },
    ];
    q.query.bool.minimum_should_match = 1;
  }
  if (filter.latitude && filter.longtitude && filter.distance) {
    q.query.bool.filter.push({
      geo_distance: {
        distance: `${filter.distance}km`,
        location: {
          lat: filter.latitude,
          lon: filter.longtitude,
        },
      },
    });
  }

  const query = await elsaticClient.search({
    index: "fakelock",
    body: q,
  });
  console.log(query.body);

  const posts = [];
  if (query.body.hits.hits.length > 0) {
    query.body.hits.hits.forEach((p) =>
      posts.push({
        postId: p._id,
        photo: p._source.photo,
        location: {
          latitude: p._source.location.lat,
          longtitude: p._source.location.lon,
        },
        publishDate: p._source.publish_date,
        likes: p.fields.likes[0],
      })
    );
  }
  const lastHit = query.body.hits.hits[query.body.hits.hits.length - 1];
  if (lastHit && lastHit.sort) {
    const sort = lastHit.sort;
    posts[posts.length - 1].searchAfter = {
      score: sort[0],
      id: sort[1],
    };
  }

  return posts;
};

const deletePost = async (id) => {};

module.exports = {
  getPostById,
  createPost,
  getPosts,
  deletePost,
  postExists,
};
