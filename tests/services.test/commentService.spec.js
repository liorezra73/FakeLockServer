const container = require("../../dependency_injection/containerConfig");
const commentService = container.getModule("commentService");
const postRepository = container.getModule("postRepository");
const commentRepository = container.getModule("commentRepository");
const userRepository = container.getModule("userRepository");
const generateError = require("../../errors/generateError");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("commentService", function () {
  let postExists = sinon.stub();

  let postId = faker.random.number();
  let userId = faker.random.number();
  let errorMsg = ``;

  context("get comments by post Id", function () {
    //#region
    let getCommentsByPostId = sinon.stub();
    const commentsQuery = {};
    beforeEach(function () {
      postExists = sinon.stub(postRepository, "postExists");
      getCommentsByPostId = sinon.stub(
        commentRepository,
        "getCommentsByPostId"
      );
    });

    afterEach(function () {
      postExists.restore();
      getCommentsByPostId.restore();
    });
    //#endregion
    it("shuold reject with post not found", async function () {
      errorMsg = "post not found";
      postExists.returns(false);

      await commentService
        .getCommentsByPostId(postId, userId, commentsQuery)
        .should.rejectedWith(errorMsg);

      postExists.should.calledOnce;
      getCommentsByPostId.should.not.called;
    });
    it("should reject get comments with elastic error", async function () {
      errorMsg = "Something went wrong";
      postExists.resolves(true);
      getCommentsByPostId.rejects();

      await commentService
        .getCommentsByPostId(postId, userId, commentsQuery)
        .should.rejectedWith(errorMsg);

      postExists.should.calledOnce;
      getCommentsByPostId.should.calledOnce;
    });
    it("should reject postExists with elastic error", async function () {
      errorMsg = "Something went wrong";
      postExists.rejects();

      await commentService
        .getCommentsByPostId(postId, userId, commentsQuery)
        .should.rejectedWith(errorMsg);

      postExists.should.calledOnce;
      getCommentsByPostId.should.not.called;
    });
    it("should get comments by post id", async function () {
      postExists.resolves(true);
      getCommentsByPostId.resolves([]);

      await commentService
        .getCommentsByPostId(postId, userId, commentsQuery)
        .should.eventually.be.an("array");

      postExists.should.calledOnce;
      getCommentsByPostId.should.calledOnce;
    });
  });
  context("create comment", function () {
    //#region
    let getUserById = sinon.stub();
    let getUsersByIds = sinon.stub();
    let createComment = sinon.stub();
    const comment = {};
    beforeEach(function () {
      postExists = sinon.stub(postRepository, "postExists");
      getUserById = sinon.stub(userRepository, "getUserById");
      getUsersByIds = sinon.stub(userRepository, "getUsersByIds");
      createComment = sinon.stub(commentRepository, "createComment");
    });

    afterEach(function () {
      postExists.restore();
      getUserById.restore();
      getUsersByIds.restore();
      createComment.restore();
    });
    //#endregion

    it("should reject with post not exist", async function () {
      errorMsg = `post with id:${postId} not found`;
      postExists.returns(false);
      await commentService
        .createComment(comment, userId, postId)
        .should.rejectedWith(errorMsg);
      postExists.should.calledOnce;
      getUserById.should.not.called;
      getUsersByIds.should.not.called;
      createComment.should.not.called;
    });

    it("should reject with db error on execute getUserById", async function () {
      errorMsg = "Something went wrong";
      postExists.returns(true);
      getUserById.rejects(generateError("DbError", errorMsg));
      await commentService
        .createComment(comment, userId, postId)
        .should.rejectedWith(errorMsg);

      postExists.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.not.called;
      createComment.should.not.called;
    });

    it("should reject with db error on execute getUsersByIds", async function () {
      errorMsg = "Something went wrong";
      postExists.returns(true);
      getUserById.returns({});
      getUsersByIds.rejects(generateError("DbError", errorMsg));
      await commentService
        .createComment(comment, userId, postId)
        .should.rejectedWith(errorMsg);

      postExists.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.calledOnce;
      createComment.should.not.called;
    });

    it("should reject with elastic error", async function () {
      errorMsg = "Something went wrong";
      postExists.returns(true);
      getUserById.returns({});
      getUsersByIds.returns([]);
      createComment.rejects(generateError("ElasticSearchError", errorMsg));
      await commentService
        .createComment(comment, userId, postId)
        .should.rejectedWith(errorMsg);

      postExists.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.calledOnce;
      createComment.should.calledOnce;
    });

    it("should create comment successfully", async function () {
      postExists.returns(true);
      getUserById.returns({});
      getUsersByIds.returns([]);
      createComment.returns({});
      await commentService
        .createComment(comment, userId, postId)
        .should.eventually.be.an("object");

      postExists.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.calledOnce;
      createComment.should.calledOnce;
    });
  });
  context("its should test delete comment func", function () {
    it("should delete comment");
  });
});
