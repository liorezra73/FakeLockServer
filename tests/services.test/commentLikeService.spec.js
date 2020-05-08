const container = require("../../dependency_injection/containerConfig");
const commentRepository = container.getModule("commentRepository");
const likeRepository = container.getModule("likeRepository");
const commentLikeService = container.getModule("commentLikeService");
const generateError = require("../../errors/generateError");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("commentLikeService", function () {
  let commentExists = sinon.stub();
  let errorMsg;
  const userId = faker.random.number();
  const commentId = faker.random.number();

  context("unLike", function () {
    let unLike = sinon.stub();
    //#region
    beforeEach(function () {
      commentExists = sinon.stub(commentRepository, "commentExists");
      unLike = sinon.stub(likeRepository, "unLike");
    });
    afterEach(function () {
      commentExists.restore();
      unLike.restore();
    });
    //#endregion

    it("should throw comment not found error", async function () {
      errorMsg = `comment with id ${commentId} does not exist`;
      commentExists.resolves(false);
      await commentLikeService
        .unLike(userId, commentId)
        .should.rejectedWith(errorMsg);
      commentExists.should.calledOnce;
      unLike.should.not.called;
    });
    it("should throw elastic error from commentExists", async function () {
      errorMsg = `Something went wrong`;
      commentExists.rejects(generateError("ElasticSearchError", errorMsg));
      await commentLikeService
        .unLike(userId, commentId)
        .should.rejectedWith(errorMsg);
      commentExists.should.calledOnce;
      unLike.should.not.called;
    });
    it("should throw elastic error from unLike", async function () {
      errorMsg = `Something went wrong`;
      commentExists.resolves(true);
      unLike.rejects(generateError("ElasticSearchError", errorMsg));
      await commentLikeService
        .unLike(userId, commentId)
        .should.rejectedWith(errorMsg);
      commentExists.should.calledOnce;
      unLike.should.calledOnce;
    });
    it("should unlike successfully", async function () {
      commentExists.resolves(true);
      unLike.resolves();
      await commentLikeService
        .unLike(userId, commentId)
        .should.eventually.be.an("undefined");
      commentExists.should.calledOnce;
      unLike.should.calledOnce;
    });
  });

  context("doLike", function () {
    let addLike = sinon.stub();
    //#region
    beforeEach(function () {
      commentExists = sinon.stub(commentRepository, "commentExists");
      addLike = sinon.stub(likeRepository, "addLike");
    });
    afterEach(function () {
      commentExists.restore();
      addLike.restore();
    });
    //#endregion

    it("should throw comment not found error", async function () {
      errorMsg = `comment with id ${commentId} does not exist`;
      commentExists.resolves(false);
      await commentLikeService
        .doLike(userId, commentId)
        .should.rejectedWith(errorMsg);
      commentExists.should.calledOnce;
      addLike.should.not.called;
    });
    it("should throw elastic error from commentExists", async function () {
      errorMsg = `Something went wrong`;
      commentExists.rejects(generateError("ElasticSearchError", errorMsg));
      await commentLikeService
        .doLike(userId, commentId)
        .should.rejectedWith(errorMsg);
      commentExists.should.calledOnce;
      addLike.should.not.called;
    });
    it("should throw elastic error from addLike", async function () {
      errorMsg = `Something went wrong`;
      commentExists.resolves(true);
      addLike.rejects(generateError("ElasticSearchError", errorMsg));
      await commentLikeService
        .doLike(userId, commentId)
        .should.rejectedWith(errorMsg);
      commentExists.should.calledOnce;
      addLike.should.calledOnce;
    });
    it("should like successfully", async function () {
      commentExists.resolves(true);
      addLike.resolves();
      await commentLikeService
        .doLike(userId, commentId)
        .should.eventually.be.an("undefined");
      commentExists.should.calledOnce;
      addLike.should.calledOnce;
    });
  });
});
