const User = require("../models/data");
module.exports = (req,res,next) => {
  User.find()
    .then((result) => {
      const sold = result.reduce((prev, curr) => {
        return prev + curr.pixels;
      }, 0);
      let left = 15000000 - sold;
      req.session.pixData = {
        sold,
        left,
      };
      next();
    })
    .catch((err) => console.log(err));
};
