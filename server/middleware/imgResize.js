const sharp = require("sharp");
const path = require("path");

module.exports = (img, filename) => {
  return sharp(img)
    .resize({ width: 150, height: 97 })
    .toFile(path.join(__dirname,"..","..","saveImagesToDB", filename));
};







