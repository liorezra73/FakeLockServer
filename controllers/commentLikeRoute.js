const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const likeService = require("../services/likeService");
const validator = require("express-joi-validation").createValidator({});
const idModels = require("../Shared/models/idModels");
router.use(authMiddleware);
router.use(validator.params(idModels.comment));

router.post("/", async (req, res, next) => {
  try {
    console.log(req.user.id)
    await likeService.switchLikeToComment(req.user.id, req.params.commentId);
    res.status(200).send({ ok: true });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
