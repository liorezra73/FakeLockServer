const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const photoService = require("../services/photoService");

router.get("/:photoId", async (req, res, next) => {
  try {
    const result = await photoService.extractPhoto(req.params.photoId);
    result.pipe(res);
  } catch (err) {
    
    err.status = 404;
    next(err);
  }
});

module.exports = router;
