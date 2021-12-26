const { validationResult } = require('express-validator');
//const removeFile = require('./removeFile');

module.exports = (req, res, next) => {
  const imgError = [{ msg: "invalid file type" }];
  if (req.file === undefined) {
    req.file = {
      mimetype: 'image/mp4'
    };
  }
  if (
    req.file.mimetype === "image/jpeg" ||
    req.file.mimetype === "image/png" ||
    req.file.mimetype === "image/jpg" ||
    req.file.mimetype === "image/gif"
  ) {
    return next();
  }
  return res.status(422).render("forms", {
    pageTitle: "details",
    hasError: true,
    path: "/noform",
    sold: req.session.pixData.sold,
    left: req.session.pixData.left,
    errormsg: imgError,
    oldData: {
      username: req.body.name,
      email: req.body.email,
      currency: req.body.currency,
      _1: req.body._1,
      _2: req.body._2,
      pixels: req.body.pixels,
    },
    validationError: [{
      param: 'image'
    }],
  });
};
