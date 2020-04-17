const elsaticClient = require("../elasticSearch");

const addLike = async (userId, documentId) => {
  const res = await elsaticClient.update({
    index: "fakelock",
    _source_includes: ["likes"],
    id: documentId,
    refresh: true,
    body: {
      script: {
        lang: "painless",
        params: {
          userId: userId,
        },
        source:
          "if (!ctx._source.likes.contains(Integer.parseInt(params.userId)))" +
          "{ctx._source.likes.add(Integer.parseInt(params.userId));}" +
          "else{ctx.op = 'none'}",
      },
    },
  });
  // console.log(x.body.get._source.likes.length);
  return res.body.get._source.likes.length;
};

const unLike = async (userId, documentId) => {
  const res = await elsaticClient.update({
    index: "fakelock",
    _source_includes: ["likes"],
    id: documentId,
    refresh: true,
    body: {
      script: {
        lang: "painless",
        params: {
          userId: userId,
        },
        source:
          "if (ctx._source.likes.contains(Integer.parseInt(params.userId)))" +
          "{ctx._source.likes.remove(ctx._source.likes.indexOf(Integer.parseInt(params.userId)));}" +
          "else{ctx.op = 'none'}",
      },
    },
  });
  return res.body.get._source.likes.length;
};

module.exports = {
  addLike,
  unLike,
};
