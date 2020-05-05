const express = require("express");
const router = express.Router();
const container = require("../../dependency_injection/containerConfig");
const userController = container.getModule("userController");
const authMiddleware = container.getModule("authMiddleware"); //require("../middleware/authMiddleware");
const userModel = require("../../Shared/models/user");
const validator = require("express-joi-validation").createValidator({});
const startsWith = require("../../Shared/models/startsWith");

router.get(
  "/",
  [authMiddleware, validator.query(startsWith)],
  userController.getUsersByStartsWith
);

router.post("/", validator.body(userModel), userController.register);

module.exports = router;
