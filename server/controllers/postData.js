const { validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const currencyData = require("../models/countryAndCurrencyData");
const rate = require("../models/currencyRate");
//collect form data handler

exports.postData = (req, res) => {
  const username = sanitizeHtml(req.body.name, {
    allowedTags: [],
    allowedAttributes: [],
  });
  const email = sanitizeHtml(req.body.email, {
    allowedTags: [],
    allowedAttributes: [],
  });
  const currency = req.body.currency;
  const image = req.file;
  const _1 = sanitizeHtml(req.body._1, {
    allowedTags: [],
    allowedAttributes: [],
  });
  const _2 = sanitizeHtml(req.body._2, {
    allowedTags: [],
    allowedAttributes: [],
  });
  const pixels = sanitizeHtml(req.body.pixels, {
    allowedTags: [],
    allowedAttributes: [],
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).render("forms", {
        pageTitle: "fill your details",
        hasError: true,
        path: "/noform",
        sold: req.session.pixData.sold,
        left: req.session.pixData.left,
        errormsg: errors.array(),
        oldData: {
          username,
          email,
          currency,
          _1,
          _2,
          pixels,
        },
        validationError: errors.array(),
      });
  }
  const price = 2*rate[currency] * pixels;
  const links = [_1, _2];
  const data = {
    username,
    email,
    currency,
    image: image.path,
    links,
    pixels,
    status: "false",
    xcoordinate: null,
    ycoordinate: null,
    width: null,
    height: null,
    price,
  };

  const currSymbole = currencyData.filter((el) => el.isoCode === currency);

  req.session.userData = {...data , description : 'Thanks for owning a piece of lockdownhomepage'};
  res.render("checkout", {
    path: "/noform",
    pageTitle: "your details",
    user: data,
    symbol: currSymbole[0].symbol.toLowerCase(),
    sold: req.session.pixData.sold,
    left: req.session.pixData.left,
  });
};







