const express = require("express");
const router = express.Router();
const authenticationService = require("../services/authenticationService");
const config = require("config");
const loginModel = require("../Shared/models/login");
const validator = require("express-joi-validation").createValidator({});
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", validator.body(loginModel), async (req, res, next) => {
  try {
    const result = await authenticationService.loginFunc(req.body);
    res
      .header(config.get("headerKey"), result)
      .status(200)
      .json(result);
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
});

router.get("/",authMiddleware, async (req, res, next) => {
  res.status(200).send(true);
});

module.exports = router;
