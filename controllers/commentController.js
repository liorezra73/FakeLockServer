const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const commentService = require("../services/commentService");
const commentModel = require("../Shared/models/comment");
const validator = require("express-joi-validation").createValidator({});
const commentsQuery = require("../Shared/models/commentsQuery");
const idModels = require("../Shared/models/idModels");
const socketService = require("../services/socketService");
router.use(authMiddleware);

router.get("/",validator.query(commentsQuery), async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByPostId(
      req.params.postId,
      req.user.id,
      req.query
    );
    res.status(200).send(result);
  } catch (err) {
    switch (err.name) {
      case "PostNotFound":
        err.status = 400;
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
    const {io}=req;
    const result = await commentService.createComment(
      req.body,
      req.user.id,
      req.params.postId
    );
    socketService.onSocket(io,result.count,"comment","comments")
    res.status(201).send(result.comment);
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
      res.status(200).send({ ok: true });
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
