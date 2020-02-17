const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const commentService = require("../services/commentService");
const commentModel = require("../Shared/models/comment");
const validator = require("express-joi-validation").createValidator({});
const idModels = require("../Shared/models/idModels");
router.use(authMiddleware);
router.use(validator.params(idModels.post));

router.post("/", async (req, res, next) => {
  try {
    console.log(req.params.postId, req.user.id);
    res.status(200).send("koib");
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    console.log(req.params, req.user.id);
    res.status(200).send("kobi");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
