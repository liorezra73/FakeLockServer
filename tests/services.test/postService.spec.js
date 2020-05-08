const container = require("../../dependency_injection/containerConfig");
const postRepository = container.getModule("postRepository");
const generateError = require("../../errors/generateError");
const photoService = container.getModule("photoService");
const postService = container.getModule("postService");
const userRepository = container.getModule("userRepository");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("postService", function () {
  let getPostById = sinon.stub();
  let errorMsg;
  const userId = faker.random.number();
  const postId = faker.random.number();

  context("createPost", function () {
    let uploadPhoto = sinon.stub();
    let getUserById = sinon.stub();
    let getUsersByIds = sinon.stub();
    let deletePhoto = sinon.stub();
    let createPost = sinon.stub();
    const post = {};
    const file = faker.random.image();
    //#region

    beforeEach(function () {
      uploadPhoto = sinon.stub(photoService, "uploadPhoto");
      getUserById = sinon.stub(userRepository, "getUserById");
      getUsersByIds = sinon.stub(userRepository, "getUsersByIds");
      deletePhoto = sinon.stub(photoService, "deletePhoto");
      createPost = sinon.stub(postRepository, "createPost");
    });

    afterEach(function () {
      uploadPhoto.restore();
      createPost.restore();
      deletePhoto.restore();
      getUserById.restore();
      getUsersByIds.restore();
    });
    //#endregion

    it("should failed to upload photo", async function () {
      errorMsg = "failed to upload photo";
      uploadPhoto.rejects(generateError("uploadPhotoFailed", errorMsg));

      await postService
        .createPost(post, userId, file)
        .should.rejectedWith(errorMsg);

      uploadPhoto.should.calledOnce;
      deletePhoto.should.not.called;
      getUserById.should.not.called;
      getUsersByIds.should.not.called;
      createPost.should.not.called;
    });

    it("should throw a db error when trying to get user by id", async function () {
      errorMsg = "Something went wrong";
      uploadPhoto.resolves("");
      getUserById.rejects(generateError("DbError", errorMsg));
      await postService
        .createPost(post, userId, file)
        .should.rejectedWith(errorMsg);
      uploadPhoto.should.calledOnce;
      deletePhoto.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.not.called;
      createPost.should.not.called;
    });

    it("should throw a db error when trying to get users by ids", async function () {
      errorMsg = "Something went wrong";
      uploadPhoto.resolves("");
      getUserById.resolves({});
      getUsersByIds.rejects(generateError("DbError", errorMsg));
      await postService
        .createPost(post, userId, file)
        .should.rejectedWith(errorMsg);
      uploadPhoto.should.calledOnce;
      deletePhoto.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.calledOnce;
      createPost.should.not.called;
    });

    it("should throw a elastic error when trying create post", async function () {
      errorMsg = "Something went wrong";
      uploadPhoto.resolves("");
      getUserById.resolves({});
      getUsersByIds.resolves([]);
      createPost.rejects(generateError("ElasticSearchError", errorMsg));
      await postService
        .createPost(post, userId, file)
        .should.rejectedWith(errorMsg);
      uploadPhoto.should.calledOnce;
      deletePhoto.should.calledOnce;
      getUserById.should.calledOnce;
      getUsersByIds.should.calledOnce;
      createPost.should.calledOnce;
    });

    it("should create post successfully", async function () {
      uploadPhoto.resolves("");
      getUserById.resolves({});
      getUsersByIds.resolves([]);
      createPost.resolves({});
      await postService
        .createPost(post, userId, file)
        .should.eventually.be.an("object");
      uploadPhoto.should.calledOnce;
      deletePhoto.should.not.called;
      getUserById.should.calledOnce;
      getUsersByIds.should.calledOnce;
      createPost.should.calledOnce;
    });
  });

  context("getPostById", function () {
    //#region

    beforeEach(function () {
      getPostById = sinon.stub(postRepository, "getPostById");
    });

    afterEach(function () {
      getPostById.restore();
    });
    //#endregion

    it("should throw post not found", async function () {
      errorMsg = `Post with the id "${postId}" was not found`;
      getPostById.rejects(generateError("PostNotFound", errorMsg));

      await postService
        .getPostById(postId, userId)
        .should.rejectedWith(errorMsg);

      getPostById.should.calledOnce;
    });

    it("should throw elastic error", async function () {
      errorMsg = "Something went wrong";
      getPostById.rejects(generateError("ElasticSearchError", errorMsg));
      await postService
        .getPostById(postId, userId)
        .should.rejectedWith(errorMsg);

      getPostById.should.calledOnce;
    });
    it("should return post by id", async function () {
      getPostById.resolves({});
      await postService
        .getPostById(postId, userId)
        .should.eventually.be.an("object");
    });
  });

  context("getPosts", function () {
    let getPosts = sinon.stub();
    //#region

    beforeEach(function () {
      getPosts = sinon.stub(postRepository, "getPosts");
    });

    afterEach(function () {
      getPosts.restore();
    });
    //#endregion

    it("should throw a elastic error", async function () {
      errorMsg = "Something went wrong";
      getPosts.rejects(generateError("ElasticSearchError", errorMsg));
      await postService.getPosts({}).should.rejectedWith(errorMsg);
      getPosts.should.calledOnce;
    });

    it("should return posts array", async function () {
      getPosts.resolves([]);
      await postService.getPosts({}).should.eventually.be.an("array");
      getPosts.should.calledOnce;
    });
  });
  context("its should test delete post func", function () {
    it("should delete post");
  });
});
