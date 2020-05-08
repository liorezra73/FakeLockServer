const container = require("../../dependency_injection/containerConfig");
const userService = container.getModule("userService");
const passwordService = container.getModule("passwordService");
const userRepository = container.getModule("userRepository");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("userService", function () {
  let newUser = {
    username: faker.random.word(),
    password: faker.internet.password(10, true),
  };

  context("create user", function () {
    // initial the object with a sinon types, so they can behave with sinon's functions.
    let isUsernameExist = sinon.stub();
    let encryption = sinon.stub();
    let createUser = sinon.stub();
    //#region

    beforeEach(function () {
      isUsernameExist = sinon.stub(userRepository, "isUsernameExist");
      encryption = sinon.stub(passwordService, "encryption");
      createUser = sinon.stub(userRepository, "createUser");
    });

    afterEach(function () {
      isUsernameExist.restore();
      encryption.restore();
      createUser.restore();
    });
    //#endregion

    it("should throw reject if username exists", async function () {
      isUsernameExist.resolves(true);

      await userService
        .createUser(newUser)
        .should.be.rejectedWith(
          `Username ${newUser.username} already exists in database!`
        );

      isUsernameExist.should.have.been.calledOnce;
      encryption.should.not.called;
      createUser.should.not.called;
    });

    it("should create new user if username is not exists", async function () {
      isUsernameExist.resolves(false);
      encryption.resolves(faker.random.alphaNumeric(40));
      createUser.resolves(newUser);

      await userService.createUser(newUser).should.not.rejected;

      isUsernameExist.should.have.been.calledOnce;
      encryption.should.have.been.calledOnce;
      createUser.should.have.been.calledOnce;
    });

    it("should get an database error", async function () {
      isUsernameExist.resolves(false);
      encryption.resolves(faker.random.alphaNumeric(40));
      createUser.rejects();

      await userService
        .createUser(newUser)
        .should.rejectedWith("Something went wrong");

      isUsernameExist.should.have.been.calledOnce;
      encryption.should.have.been.calledOnce;
      createUser.should.have.been.calledOnce;
    });
  });

  context("get users by starts with", function () {
    let getUsersByStartsWith = sinon.stub();
    beforeEach(function () {
      getUsersByStartsWith = sinon.stub(userRepository, "GetUsersByStartsWith");
    });

    afterEach(function () {
      getUsersByStartsWith.restore();
    });

    it("should get users by ahead string", async function () {
      let startWith = faker.lorem.word();
      getUsersByStartsWith.resolves([{}]);

      await userService.GetUsersByStartsWith(startWith);

      getUsersByStartsWith.should.have.been.calledOnce;
    });

    it("should get an database error", async function () {
      let startWith = faker.lorem.word();
      getUsersByStartsWith.rejects();

      await userService
        .GetUsersByStartsWith(startWith)
        .should.rejectedWith("Something went wrong");

      getUsersByStartsWith.should.have.been.calledOnce;
    });
  });
});
