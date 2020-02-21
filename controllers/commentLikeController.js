const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const commentLikeService = require("../services/commentLikeService");
const validator = require("express-joi-validation").createValidator({});
const idModels = require("../Shared/models/idModels");
router.use(authMiddleware);
router.use(validator.params(idModels.comment));

router.post("/", async (req, res, next) => {
  try {
    await commentLikeService.doLike(req.user.id, req.params.commentId);
    res.status(201).send({ ok: true });
  } catch (err) {
    switch (err.name) {
      case "LikeExists":
        err.status = 400;
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
    await commentLikeService.unLike(req.user.id, req.params.commentId);
    res.status(201).send({ ok: true });
  } catch (err) {
    switch (err.name) {
      case "LikeNotExists":
        err.status = 400;
        break;
      default:
        err.status = 500;
        break;
    }
    next(err);
  }
});

module.exports = router;
