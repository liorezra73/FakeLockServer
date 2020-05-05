const generateError = require("../errors/generateError");
// const config = require("config");
// const tokenService = require("../services/tokenService");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header(config.get("headerKey"));
//     if (!token) {
//       throw generateError("NoToken", "no token provided");
//     }
//     const decoded = tokenService.decodeToken(token);
//     if (!decoded) {
//       throw generateError("TokenNotValid", "token is not valid");
//     }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.log(err);
//     switch (err.name) {
//       case "TokenExpiredError":
//         err.status = 401;
//         break;
//       case "NoToken":
//         err.status = 401;
//         break;
//       case "TokenNotValid":
//         err.status = 401;
//         break;
//       case "JsonWebTokenError":
//         err.status = 401;
//         break;
//       default:
//         err.status = 500;
//         break;
//     }
//     next(err);
//   }
// };

const authMiddleware = (config, tokenService) => {
  return async (req, res, next) => {
    try {
      const token = req.header(config.get("headerKey"));
      if (!token) {
        throw generateError("NoToken", "no token provided");
      }
      const decoded = tokenService.decodeToken(token);
      if (!decoded) {
        throw generateError("TokenNotValid", "token is not valid");
      }
      req.user = decoded;
      next();
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          err.status = 401;
          break;
        case "NoToken":
          err.status = 401;
          break;
        case "TokenNotValid":
          err.status = 401;
          break;
        case "JsonWebTokenError":
          err.status = 401;
          break;
        default:
          err.status = 500;
          break;
      }
      next(err);
    }
  };
};
module.exports = authMiddleware;
