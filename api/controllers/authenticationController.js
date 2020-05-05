// const express = require("express");
// const router = express.Router();
// const container = require("../../dependency_injection/containerConfig");
// const authenticationService = container.getModule("authenticationService"); //require("../services/authenticationService");
// const config = container.getModule("config"); // require("config");
// const loginModel = require("../../Shared/models/login");
// const validator = require("express-joi-validation").createValidator({});
// const authMiddleware = require("../../middleware/authMiddleware");

const authenticationController = (authenticationService, config) => {
  return {
    login: async (req, res, next) => {
      try {
        const result = await authenticationService.loginFunc(req.body);
        res.header(config.get("headerKey"), result).status(200).json(result);
      } catch (err) {
        switch (err.name) {
          case "UserNotFound":
            err.status = 404;
            break;
          case "PasswordInvalid":
            err.status = 400;
            break;
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    },
    isLogin: async (req, res, next) => {
      res.status(200).send({ ok: true });
    },
  };
};

// router.post("/", validator.body(loginModel), async (req, res, next) => {
//   try {
//     const result = await authenticationService.loginFunc(req.body);
//     res.header(config.get("headerKey"), result).status(200).json(result);
//   } catch (err) {
//     switch (err.name) {
//       case "UserNotFound":
//         err.status = 404;
//         break;
//       case "PasswordInvalid":
//         err.status = 400;
//         break;
//       default:
//         err.status = 500;
//         break;
//     }
//     next(err);
//   }
// });

// router.get("/", authMiddleware, async (req, res, next) => {
//   res.status(200).send({ ok: true });
// });

// module.exports = router;
module.exports = authenticationController;
