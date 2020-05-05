const express = require("express");
const router = express.Router({ mergeParams: true });
const container = require("../../dependency_injection/containerConfig");
const postLikeController = container.getModule("postLikeController");
const authMiddleware = container.getModule("authMiddleware"); //require("../middleware/authMiddleware");
router.use(authMiddleware);

router.post("/", postLikeController.like);
router.delete("/", postLikeController.unLike);

module.exports = router;
