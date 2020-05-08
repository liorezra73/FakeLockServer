const container = require("../../dependency_injection/containerConfig");
const userRepository = container.getModule("userRepository");
const passwordService = container.getModule("passwordService");
const tokenService = container.getModule("tokenService");
const generateError = require("../../errors/generateError");
const authenticationService = container.getModule("authenticationService");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe("authenticationService", function () {
  context("login", function () {
    let getUserByUsername = sinon.stub();
    let comparison = sinon.stub();
    let generateToken = sinon.stub();
    const newLogin = {
      username: faker.random.word(),
      password: faker.random.word(),
    };
    let errorMsg = "";

    beforeEach(function () {
      getUserByUsername = sinon.stub(userRepository, "getUserByUsername");
      comparison = sinon.stub(passwordService, "comparison");
      generateToken = sinon.stub(tokenService, "generateToken");
    });
    afterEach(function () {
      getUserByUsername.restore();
      comparison.restore();
      generateToken.restore();
    });

    it("should throw user not found error", async function () {
      errorMsg = `User with username "${newLogin.username}" not found!`;
      getUserByUsername.resolves({});
      await authenticationService
        .loginFunc(newLogin)
        .should.rejectedWith(errorMsg);
      getUserByUsername.should.calledOnce;
      comparison.should.not.called;
      generateToken.should.not.called;
    });
    it("should throw db error", async function () {
      errorMsg = `something went wrong`;
      getUserByUsername.rejects(generateError("DbError", errorMsg));
      await authenticationService
        .loginFunc(newLogin)
        .should.rejectedWith(errorMsg);
      getUserByUsername.should.calledOnce;
      comparison.should.not.called;
      generateToken.should.not.called;
    });
    it("should throw password invalid error", async function () {
      errorMsg = `The password "${newLogin.password}" for "${newLogin.username}" is incorrect`;
      getUserByUsername.resolves({ Password: newLogin.password + "1" });
      comparison.resolves(false);
      await authenticationService
        .loginFunc(newLogin)
        .should.rejectedWith(errorMsg);
      getUserByUsername.should.calledOnce;
      comparison.should.calledOnce;
      generateToken.should.not.called;
    });
    it("should login successfully and return token", async function () {
      getUserByUsername.resolves({ Password: newLogin.password });
      comparison.resolves(true);
      generateToken.resolves("");
      await authenticationService
        .loginFunc(newLogin)
        .should.eventually.be.an("string");
      getUserByUsername.should.calledOnce;
      comparison.should.calledOnce;
      generateToken.should.calledOnce;
    });
  });
});
