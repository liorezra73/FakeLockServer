const elsaticClient = require("../elasticSearch");

const addLike = async (userId, documentId) => {
  await elsaticClient.update({
    index: "fakelock",
    id: documentId,
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
};

const unLike = async (userId, documentId) => {
  await elsaticClient.update({
    index: "fakelock",
    id: documentId,
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
};

module.exports = {
  addLike,
  unLike,
};
