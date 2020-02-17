const jwt = require("jsonwebtoken");

const config = require("config");
const generateToken = id => {
  return jwt.sign({ id }, config.get("jwtPrivateKey"));
};
module.exports = generateToken;
