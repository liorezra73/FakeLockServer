const generateError = require("../errors/generateError");
const sharp = require("sharp");

const photoMiddleware = (req, res, next) => {
  try {
    const isImage = req.file && req.file.mimetype.startsWith("image");
    if (!isImage) throw generateError("NotImage", "the file is not an image");
    const maxSize = Math.pow(1024, 2) * 10;
    if (req.file.size > maxSize)
      throw generateError("ImageSizeNotValid", "the image size is too large");
    req.body = JSON.parse(req.body.post);
    next();
  } catch (err) {
    switch (err.name) {
      case "NotImage":
        err.status = 400;
        break;
      case "ImageSizeNotValid":
        err.status = 406;
        break;
      default:
        err.status = 500;
        break;
    }
    next(err);
  }
};
module.exports = photoMiddleware;
