const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const postService = require("../services/postService");
const postModel = require("../Shared/models/post");
const filterModel = require("../Shared/models/filter");
const idModels = require("../Shared/models/idModels");
const photoMiddleware = require("../middleware/photoMiddleware");
const validator = require("express-joi-validation").createValidator({});
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});
router.use(authMiddleware);

router.get("/", validator.query(filterModel), async (req, res, next) => {
  try {
    const result = await postService.getPosts(req.query);

    res.status(200).json(result);
  } catch (err) {
    switch (err.name) {
      default:
        err.status = 500;
        break;
    }
    next(err);
  }
});

router.get("/:postId", async (req, res, next) => {
  try {
    const result = await postService.getPostById(req.params.postId,req.user.id);
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

router.delete(
  "/:postId",
  [validator.params(idModels.post)],
  async (req, res, next) => {
    try {
      await postService.deletePost(req.params.postId);
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
  }
);

router.post(
  "/",
  [upload.single("photo"), photoMiddleware, validator.body(postModel)],
  async (req, res, next) => {
    try {
      const result = await postService.createPost(
        req.body,
        req.user.id,
        req.file
      );
      res.status(200).json(result);
    } catch (err) {
      console.log(err);

      err.status = 500;
      next(err);
    }
  }
);

module.exports = router;
