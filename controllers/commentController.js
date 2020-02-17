const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const commentService = require("../services/commentService");
const commentModel = require("../Shared/models/comment");
const validator = require("express-joi-validation").createValidator({});
const idModels = require("../Shared/models/idModels");
router.use(authMiddleware);
router.use(validator.params(idModels.post));

router.get("/", async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByPostId(req.params.postId);
    res.status(200).send(result);
  } catch (err) {
    switch (err.name) {
      case "PostNotFound":
        err.status = 404;
        break;
      default:
        err.status = 500;
        break;
    }
    next(err);
  }
});

router.post("/", validator.body(commentModel), async (req, res, next) => {
  try {
    await commentService.createComment(
      req.body,
      req.user.id,
      req.params.postId
    );
    res.status(201).send("succsess");
  } catch (err) {
    switch (err.name) {
      case "PostNotFound":
        err.status = 404;
        break;
      default:
        err.status = 500;
        break;
    }
    next(err);
  }
});

router.delete(
  "/:commentId",
  validator.params(idModels.comment),
  async (req, res, next) => {
    try {
      await commentService.deleteComment(
        req.params.postId,
        req.params.commentId
      );
      res.status(200).send("ok");
    } catch (err) {
      switch (err.name) {
        case "PostNotFound":
          err.status = 404;
          break;
        case "CommentNotFound":
          err.status = 404;
          break;
        default:
          err.status = 500;
          break;
      }
      next(err);
    }
  }
);
module.exports = router;
