const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const likeService = require("../services/likeService");
const validator = require("express-joi-validation").createValidator({});
const idModels = require("../Shared/models/idModels");
router.use(authMiddleware);
router.use(validator.params(idModels.post));

router.post("/", async (req, res, next) => {
  try {
    await likeService.switchLikeToPost(req.user.id,req.params.postId)
    res.status(200).send({ ok: true});
  } catch (err) {
    err.status = 500
    next(err);
  }
});

module.exports = router;
