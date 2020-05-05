const express = require("express");
const router = express.Router({ mergeParams: true });
const container = require("../../dependency_injection/containerConfig");
const authMiddleware = container.getModule("authMiddleware"); // require("../middleware/authMiddleware");
const commentController = container.getModule("commentController");
const commentModel = require("../../Shared/models/comment");
const validator = require("express-joi-validation").createValidator({});
const commentsQuery = require("../../Shared/models/commentsQuery");
router.use(authMiddleware);

router.get(
  "/",
  validator.query(commentsQuery),
  commentController.getCommentsByPostId
);
router.post("/", validator.body(commentModel), commentController.createComment);

module.exports = router