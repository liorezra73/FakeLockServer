const sharp = require("sharp");
const config = require("config");
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const photoPath = config.get("photoPath");

const uploadPhoto = async photo => {
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
};

const extractPhoto = async name => {
  const readStream = fs.createReadStream(`${photoPath}\\${name}.webp`);
  return readStream;
};

module.exports = { uploadPhoto, extractPhoto };
