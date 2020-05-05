const express = require("express");
const router = express.Router();
const container = require("../../dependency_injection/containerConfig");
const photoController = container.getModule("photoController");

router.get("/:photoId", photoController.getPhotoById);

module.exports = router;
