// const express = require("express");
// const router = express.Router();
// const container = require("../dependency_injection/containerConfig");
// const photoService = container.getModule("photoService"); //require("../services/photoService");

const photoController = (photoService) => {
  return {
    getPhotoById: async (req, res, next) => {
      try {
        const result = await photoService.extractPhoto(req.params.photoId);
        result.pipe(res);
      } catch (err) {
        err.status = 404;
        next(err);
      }
    },
  };
};
module.exports = photoController;
// router.get("/:photoId", async (req, res, next) => {
//   try {
//     const result = await photoService.extractPhoto(req.params.photoId);
//     result.pipe(res);
//   } catch (err) {
//     err.status = 404;
//     next(err);
//   }
// });

// module.exports = router;
