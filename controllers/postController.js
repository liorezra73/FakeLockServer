const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const postService = require("../services/postService");
const postModel = require("../Shared/models/post");
const idModels = require("../Shared/models/idModels");
const photoMiddleware = require("../middleware/photoMiddleware");
const validator = require("express-joi-validation").createValidator({});
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});
router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const result = await postService.getAllPosts();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
  next(err);
});

router.get(
  "/:postId",
  [validator.params(idModels.post)],
  async (req, res, next) => {
    try {
      const result = await postService.getPostById(req.params.postId);
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
  }
);

router.delete(
  "/:postId",
  [validator.params(idModels.post)],
  async (req, res, next) => {
    try {
      const result = await postService.deletePost(req.params.postId);
      res.status(200).send(result);
    } catch (err) {
      switch (err.name) {
        case "PostNotFount":
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
      const result = await postService.createPost(req.body, 1, req.file);
      res.status(200).send(result);
    } catch (err) {
      err.status = 500;
      next(err);
    }
  }
);

module.exports = router;
