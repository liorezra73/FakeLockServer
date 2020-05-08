const container = require("../../dependency_injection/containerConfig");
const postRepository = container.getModule("postRepository");
const likeRepository = container.getModule("likeRepository");
const postLikeService = container.getModule("postLikeService");
const generateError = require("../../errors/generateError");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("postLikeService", function () {
  let postExists = sinon.stub();
  let errorMsg;
  const userId = faker.random.number();
  const postId = faker.random.number();

  context("unLike", function () {
    let unLike = sinon.stub();
    //#region
    beforeEach(function () {
      postExists = sinon.stub(postRepository, "postExists");
      unLike = sinon.stub(likeRepository, "unLike");
    });
    afterEach(function () {
      postExists.restore();
      unLike.restore();
    });
    //#endregion

    it("should throw post not found error", async function () {
      errorMsg = `post with id ${postId} not found`;
      postExists.resolves(false);
      await postLikeService
        .unLike(userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      unLike.should.not.called;
    });
    it("should throw elastic error from postExists", async function () {
      errorMsg = `Something went wrong`;
      postExists.rejects(generateError("ElasticSearchError", errorMsg));
      await postLikeService
        .unLike(userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      unLike.should.not.called;
    });
    it("should throw elastic error from unLike", async function () {
      errorMsg = `Something went wrong`;
      postExists.resolves(true);
      unLike.rejects(generateError("ElasticSearchError", errorMsg));
      await postLikeService
        .unLike(userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      unLike.should.calledOnce;
    });
    it("should unlike successfully", async function () {
      postExists.resolves(true);
      unLike.resolves({});
      await postLikeService
        .unLike(userId, postId)
        .should.eventually.be.an("object");
      postExists.should.calledOnce;
      unLike.should.calledOnce;
    });
  });

  context("doLike", function () {
    let addLike = sinon.stub();
    //#region
    beforeEach(function () {
      postExists = sinon.stub(postRepository, "postExists");
      addLike = sinon.stub(likeRepository, "addLike");
    });
    afterEach(function () {
      postExists.restore();
      addLike.restore();
    });
    //#endregion

    it("should throw post not found error", async function () {
      errorMsg = `post with id ${postId} not found`;
      postExists.resolves(false);
      await postLikeService
        .doLike(userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      addLike.should.not.called;
    });
    it("should throw elastic error from postExists", async function () {
      errorMsg = `Something went wrong`;
      postExists.rejects(generateError("ElasticSearchError", errorMsg));
      await postLikeService
        .doLike(userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      addLike.should.not.called;
    });
    it("should throw elastic error from addLike", async function () {
      errorMsg = `Something went wrong`;
      postExists.resolves(true);
      addLike.rejects(generateError("ElasticSearchError", errorMsg));
      await postLikeService
        .doLike(userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      addLike.should.calledOnce;
    });
    it("should like successfully", async function () {
      postExists.resolves(true);
      addLike.resolves({});
      await postLikeService
        .doLike(userId, postId)
        .should.eventually.be.an("object");
      postExists.should.calledOnce;
      addLike.should.calledOnce;
    });
  });
});
