const express = require("express");
const router = express.Router({ mergeParams: true });
const container = require("../../dependency_injection/containerConfig");
const authMiddleware = container.getModule("authMiddleware"); // require("../middleware/authMiddleware");
const commentLikeController = container.getModule("commentLikeController");
router.use(authMiddleware);

router.post("/", commentLikeController.like);
router.delete("/", commentLikeController.unLike);
module.exports = router;
