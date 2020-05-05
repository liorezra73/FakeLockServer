const express = require("express");
const router = express.Router();
const container = require("../../dependency_injection/containerConfig");
const postController = container.getModule("postController");
const authMiddleware = container.getModule("authMiddleware"); //require("../middleware/authMiddleware");
const postModel = require("../../Shared/models/post");
const filterModel = require("../../Shared/models/filter");
const photoMiddleware = require("../../middleware/photoMiddleware");
const validator = require("express-joi-validation").createValidator({});
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

router.use(authMiddleware);

router.get("/", validator.query(filterModel), postController.getPosts);

router.get("/:postId", postController.getPostById);

router.post(
  "/",
  [upload.single("photo"), photoMiddleware, validator.body(postModel)],
  postController.createPost
);

module.exports = router;
