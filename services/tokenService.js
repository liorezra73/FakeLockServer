// const jwt = require("jsonwebtoken");
// const config = require("config");

// const generateToken = (id) => {
//   return jwt.sign({ id }, config.get("jwtPrivateKey"), {
//     expiresIn: 60 * 1000, // expires in 15 minutes
//   });
// };

// const decodeToken = (token) => {
//   return jwt.verify(token, config.get("jwtPrivateKey"));
// };

const tokenService = (jwt, config) => {
  return {
    generateToken: (id) => {
      return jwt.sign({ id }, config.get("jwtPrivateKey"), {
        expiresIn: 60 * 1000, // expires in 15 minutes
      });
    },

    decodeToken: (token) => {
      return jwt.verify(token, config.get("jwtPrivateKey"));
    },
  };
};
module.exports = tokenService;
// module.exports = { generateToken, decodeToken };
