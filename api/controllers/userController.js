// const express = require("express");
// const router = express.Router();
// const container = require("../dependency_injection/containerConfig");
// const userService = container.getModule("userService"); //require("../services/userService");
// const config = container.getModule("config"); //require("config");
// const authMiddleware = container.getModule("authMiddleware"); //require("../middleware/authMiddleware");
// const userModel = require("../Shared/models/user");
// const validator = require("express-joi-validation").createValidator({});
// const startsWith = require("../Shared/models/startsWith");

const userController = (userService, config) => {
  return {
    getUsersByStartsWith: async (req, res, next) => {
      try {
        const result = await userService.GetUsersByStartsWith(
          req.query.username
        );
        res.status(200).send(result);
      } catch (err) {
        switch (err.name) {
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    },
    register: async (req, res, next) => {
      try {
        const result = await userService.createUser(req.body);
        res.header(config.get("headerKey"), result).status(201).send(result);
      } catch (err) {
        switch (err.name) {
          case "UsernameExist":
            err.status = 409;
            break;
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    },
  };
};

module.exports = userController;

// router.get(
//   "/",
//   [authMiddleware, validator.query(startsWith)],
//   async (req, res, next) => {
//     try {
//       const result = await userService.GetUsersByStartsWith(req.query.username);
//       res.status(200).send(result);
//     } catch (err) {
//       switch (err.name) {
//         default:
//           err.status = 500;
//           break;
//       }
//       next(err);
//     }
//   }
// );

// router.post("/", validator.body(userModel), async (req, res, next) => {
//   try {
//     const result = await userService.createUser(req.body);
//     res.header(config.get("headerKey"), result).status(201).send(result);
//   } catch (err) {
//     switch (err.name) {
//       case "UsernameExist":
//         err.status = 409;
//         break;
//       default:
//         err.status = 500;
//         break;
//     }
//     next(err);
//   }
// });

// module.exports = router;
