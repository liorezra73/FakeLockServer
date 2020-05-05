const express = require("express");
const router = express.Router();
const loginModel = require("../../Shared/models/login");
const validator = require("express-joi-validation").createValidator({});
const container = require("../../dependency_injection/containerConfig");
const authenticationController = container.getModule(
  "authenticationController"
);
// const authMiddleware = container.getModule("authMiddleware"); //require("../../middleware/authMiddleware");

router.post("/", validator.body(loginModel), authenticationController.login);

router.get("/", authenticationController.isLogin);

module.exports = router;
