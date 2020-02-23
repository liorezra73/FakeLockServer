const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const postLikeService = require("../services/postLikeService");
const validator = require("express-joi-validation").createValidator({});
const idModels = require("../Shared/models/idModels");
router.use(authMiddleware);
router.use(validator.params(idModels.post));

router.post("/", async (req, res, next) => {
  try {
    await postLikeService.doLike(req.user.id, req.params.postId);
    res.status(201).send({ ok: true });
  } catch (err) {
    switch (err.name) {
      case "LikeExists":
        err.status = 400;
        break;
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
    await postLikeService.unLike(req.user.id, req.params.postId);
    res.status(200).send({ ok: true });
  } catch (err) {
    switch (err.name) {
      case "LikeNotExists":
        err.status = 400;
        break;
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
