const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const postLikeService = require("../services/postLikeService");
const socketService = require("../services/socketService");
router.use(authMiddleware);

router.post("/", async (req, res, next) => {
  try {
    const { io } = req;
    const likes = await postLikeService.doLike(req.user.id, req.params.postId);
    socketService.onSocket(io,likes,"postLike","postLikes")
    res.status(201).send({ ok: true });
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

router.delete("/", async (req, res, next) => {
  try {
    const { io } = req;
    const likes = await postLikeService.unLike(req.user.id, req.params.postId);
    socketService.onSocket(io,likes,"postUnLike","postLikes")
    res.status(200).send({ ok: true });
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

module.exports = router;
