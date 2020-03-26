const postRepository = require("../../Data/repositories/postRepository");
const generateError = require("../../errors/generateError");
const photoService = require("../../services/photoService");
const postService = require("../../services/postService");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("postService", function() {
  let getPostById = sinon.stub();
  let errorMsg;
  const userId = faker.random.number();
  const postId = faker.random.number();

  context("createPost", function() {
    let uploadPhoto = sinon.stub();
    let createPost = sinon.stub();
    const post = {};
    const file = faker.random.image();
    //#region

    beforeEach(function() {
      uploadPhoto = sinon.stub(photoService, "uploadPhoto");
      createPost = sinon.stub(postRepository, "createPost");
    });

    afterEach(function() {
      uploadPhoto.restore();
      createPost.restore();
    });
    //#endregion

    it("should failed to upload photo", async function() {
      errorMsg = "failed to upload photo";
      uploadPhoto.rejects(generateError("uploadPhotoFailed", errorMsg));

      await postService
        .createPost(post, userId, file)
        .should.rejectedWith(errorMsg);

      uploadPhoto.should.calledOnce;
      createPost.should.not.called;
    });

    it("should throw a db error when trying to create post", async function() {
      errorMsg = "Something went wrong";
      uploadPhoto.resolves("");
      createPost.rejects();
      await postService
        .createPost(post, userId, file)
        .should.rejectedWith(errorMsg);
      uploadPhoto.should.calledOnce;
      createPost.should.calledOnce;
    });

    it("should create post successfully", async function() {
      uploadPhoto.resolves("");
      createPost.resolves({});
      await postService
        .createPost(post, userId, file)
        .should.eventually.be.an("object");
      uploadPhoto.should.calledOnce;
      createPost.should.calledOnce;
    });
  });

  context("getPostById", function() {
    //#region

    beforeEach(function() {
      getPostById = sinon.stub(postRepository, "getPostById");
    });

    afterEach(function() {
      getPostById.restore();
    });
    //#endregion

    it("should throw post not found", async function() {
      errorMsg = `Post with the id "${postId}" was not found`;
      getPostById.rejects(generateError("PostNotFound", errorMsg));

      await postService
        .getPostById(postId, userId)
        .should.rejectedWith(errorMsg);

      getPostById.should.calledOnce;
    });

    it("should throw db error", async function() {
      errorMsg = "Something went wrong";
      getPostById.rejects();
      await postService
        .getPostById(postId, userId)
        .should.rejectedWith(errorMsg);

      getPostById.should.calledOnce;
    });
    it("should return post by id", async function() {
      getPostById.resolves({});
      await postService
        .getPostById(postId, userId)
        .should.eventually.be.an("object");
    });
  });

  context("getPosts", function() {
    let getPosts = sinon.stub();
    //#region

    beforeEach(function() {
      getPosts = sinon.stub(postRepository, "getPosts");
    });

    afterEach(function() {
      getPosts.restore();
    });
    //#endregion

    it("should throw a db error", async function() {
      errorMsg = "Something went wrong";
      getPosts.rejects();
      await postService.getPosts({}).should.rejectedWith(errorMsg);
      getPosts.should.calledOnce;
    });

    it("should return posts array", async function() {
      getPosts.resolves([]);
      await postService.getPosts({}).should.eventually.be.an("array");
      getPosts.should.calledOnce;
    });
  });

  context("deletePost", function() {
    let deletePost = sinon.stub();
    //#region

    beforeEach(function() {
      deletePost = sinon.stub(postRepository, "deletePost");
      getPostById = sinon.stub(postRepository, "getPostById");
    });

    afterEach(function() {
      deletePost.restore();
      getPostById.restore();
    });
    //#endregion

    it("should throw a post not found error", async function() {
      errorMsg = `Post with the id ${postId} was not found`;
      getPostById.rejects(generateError("PostNotFound", errorMsg));
      await postService
        .deletePost(postId)
        .should.eventually.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
    });

    it("should throw db error", async function() {
      errorMsg = "Something went wrong";
      getPostById.resolves({});
      deletePost.rejects();
      await postService.deletePost(postId).should.rejectedWith(errorMsg);
      getPostById.should.calledOnce;
      deletePost.should.calledOnce;
    });
    it("should delete post", async function() {
      getPostById.resolves({});
      deletePost.resolves();
      await postService.deletePost(postId).should.not.be.rejected;;
      getPostById.should.calledOnce;
      deletePost.should.calledOnce;
    });
  });
});
