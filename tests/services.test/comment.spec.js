const commentService = require("../../services/commentService");
const postRepository = require("../../Data/repositories/postRepository");
const commentRepository = require("../../Data/repositories/commentRepository");
const generateError = require("../../errors/generateError");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("commentService", function() {
  let getPostById = sinon.stub();
  let getCommentsByPostId = sinon.stub();
  let createComment = sinon.stub();
  let postId = faker.random.number();
  let userId = faker.random.number();
  const errorMsg = `Post with the id "${postId}" was not found`;
  const dbErrorMsg = 'there was an error in the database!';
  context("get comments by post Id", function() {
    //#region

    beforeEach(function() {
      getPostById = sinon.stub(postRepository, "getPostById");
      getCommentsByPostId = sinon.stub(
        commentRepository,
        "getCommentsByPostId"
      );
    });

    afterEach(function() {
      getPostById.restore();
      getCommentsByPostId.restore();
    });
    //#endregion
    it("shuold reject with post not found", async function() {
      getPostById.rejects(generateError("PostNotFound", errorMsg));

      await commentService
        .getCommentsByPostId(postId, userId)
        .should.rejectedWith(errorMsg);

      getPostById.should.calledOnce;
      getCommentsByPostId.should.not.called;
    });
    it("should get comments by post id", async function() {
      getPostById.resolves({});
      getCommentsByPostId.resolves([]);

      await commentService.getCommentsByPostId(postId, userId).should.eventually.be.an('array')

      getPostById.should.calledOnce;
      getCommentsByPostId.should.calledOnce;
    });
    it("should reject with database error", async function() {
      getPostById.resolves({});
      getCommentsByPostId.rejects();

      await commentService.getCommentsByPostId(postId, userId).should.rejected;

      getPostById.should.calledOnce;
      getCommentsByPostId.should.calledOnce;
    });
  });
  context('create comment', function(){
        //#region
    beforeEach(function() {
      getPostById = sinon.stub(postRepository, "getPostById");
      createComment = sinon.stub(commentRepository, "createComment");
    });

    afterEach(function() {
      getPostById.restore();
      createComment.restore();
    });
    //#endregion
    it('should reject with post not found', async function(){
      
    })
  })
});
