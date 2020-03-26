const postRepository = require("../../Data/repositories/postRepository");
const postLikeRepository = require("../../Data/repositories/postLikeRepository");
const generateError = require("../../errors/generateError");
const postLikeService = require("../../services/postLikeService");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("postLikeService", function() {
  let getPostById = sinon.stub();
  let userLikedPost = sinon.stub();
  let errorMsg;
  const userId = faker.random.number();
  const postId = faker.random.number();

  context("unLike", function() {
    let unLikeToPost = sinon.stub();

    //#region

    beforeEach(function() {
      getPostById = sinon.stub(postRepository, "getPostById");
      userLikedPost = sinon.stub(postLikeRepository, "userLikedPost");
      unLikeToPost = sinon.stub(postLikeRepository, "unLikeToPost");
    });

    afterEach(function() {
      getPostById.restore();
      userLikedPost.restore();
      unLikeToPost.restore();
    });
    //#endregion

    it("should throw post not found error", async function() {
      errorMsg = `Post with the id "${postId}" was not found`;
      getPostById.rejects(generateError("PostNotFound", errorMsg));
      await postLikeService
        .unLike(userId, postId)
        .should.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      userLikedPost.should.not.called;
      unLikeToPost.should.not.called;
    });

    it("should throw user not liked error", async function() {
      errorMsg = `user ${userId} not liked post ${postId}`;
      getPostById.resolves({});
      userLikedPost.resolves(false);

      await postLikeService
        .unLike(userId, postId)
        .should.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      userLikedPost.should.calledOnce;
      unLikeToPost.should.not.called;
    });

    it("should do unlike on post", async function() {
      getPostById.resolves({});
      userLikedPost.resolves(true);
      unLikeToPost.resolves();

      await postLikeService.unLike(userId, postId).should.not.be.rejected;
      getPostById.should.calledOnce;
      userLikedPost.should.calledOnce;
      unLikeToPost.should.calledOnce;
    });

    it("should throw db error", async function() {
      errorMsg = "Something went wrong";
      getPostById.resolves({});
      userLikedPost.resolves(true);
      unLikeToPost.rejects();

      await postLikeService
        .unLike(userId, postId)
        .should.be.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      userLikedPost.should.calledOnce;
      unLikeToPost.should.calledOnce;
    });
  });

  context("doLike", function() {
    let addLikeToPost = sinon.stub();

    //#region

    beforeEach(function() {
      getPostById = sinon.stub(postRepository, "getPostById");
      userLikedPost = sinon.stub(postLikeRepository, "userLikedPost");
      addLikeToPost = sinon.stub(postLikeRepository, "addLikeToPost");
    });

    afterEach(function() {
      getPostById.restore();
      userLikedPost.restore();
      addLikeToPost.restore();
    });
    //#endregion

    it("should throw post not found error", async function() {
      errorMsg = `Post with the id "${postId}" was not found`;
      getPostById.rejects(generateError("PostNotFound", errorMsg));
      await postLikeService
        .doLike(userId, postId)
        .should.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      userLikedPost.should.not.called;
      addLikeToPost.should.not.called;
    });

    it("should throw user already liked error", async function() {
      errorMsg = `user ${userId} already liked post ${postId}`;
      getPostById.resolves({});
      userLikedPost.resolves(true);

      await postLikeService
        .doLike(userId, postId)
        .should.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      userLikedPost.should.calledOnce;
      addLikeToPost.should.not.called;
    });

    it("should do like on post", async function() {
      getPostById.resolves({});
      userLikedPost.resolves(false);
      addLikeToPost.resolves();

      await postLikeService.doLike(userId, postId).should.not.be.rejected;
      getPostById.should.calledOnce;
      userLikedPost.should.calledOnce;
      addLikeToPost.should.calledOnce;
    });
    it("should throw db error", async function() {
      errorMsg = "Something went wrong";
      getPostById.resolves({});
      userLikedPost.resolves(false);
      addLikeToPost.rejects();

      await postLikeService
        .doLike(userId, postId)
        .should.be.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      userLikedPost.should.calledOnce;
      addLikeToPost.should.calledOnce;
    });
  });
});
