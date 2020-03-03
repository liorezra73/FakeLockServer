const postRepository = require("../../Data/repositories/postRepository");
const postLikeRepository = require("../../Data/repositories/postLikeRepository");

const chai = require("chai");
const sinon = require("sinon");
var faker = require("faker");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();
