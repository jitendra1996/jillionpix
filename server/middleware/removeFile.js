const fs = require("fs");
const path = require("path");

module.exports = () => {
  fs.readdir(path.join(__dirname, "..", "..", "images"), (error, files) => {
    if (error) throw error;

    for (const file of files) {
      fs.unlink(path.join(__dirname, "..", "..", "images", file), (err) => {
        if (err) throw err;
      });
    }
  });
};
