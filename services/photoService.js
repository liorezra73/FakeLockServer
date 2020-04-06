const sharp = require("sharp");
const config = require("config");
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const fsPromises = fs.promises;
const photoPath = config.get("photoPath");
const generateError = require("../errors/generateError");
const logger = require("../logger/logger");

const uploadPhoto = async photo => {
  try {
    const res = await sharp(photo.buffer).webp();
    const id = uuidv4();
    await res
      .resize(1000, 750, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(`${photoPath}/${id}.webp`);

    await res
      .resize(200, 150, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(`${photoPath}/${id}.small.webp`);
    return id;
  } catch (err) {
    logger.error(err);
    throw generateError("uploadPhotoFailed", "failed to upload photo");
  }
};

const extractPhoto = async name => {
  try {
    const url = `${photoPath}\\${name}.webp`;
    await fsPromises.access(url);
    const readStream = fs.createReadStream(url);
    readStream.on("error", function(err) {
      readStream.close();
    });
    return readStream;
  } catch (err) {
    logger.error(err);
    throw generateError("extractPhotoFailed", "failed to extract photo");
  }
};

module.exports = { uploadPhoto, extractPhoto };
