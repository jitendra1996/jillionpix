const User = require("../models/data");
const crypto = require("crypto");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const resizeImage = require("../middleware/imgResize");
const path = require("path");
const rate = require("../models/currencyRate");
const removeFile = require("../middleware/removeFile");
const dataToFile = require("../middleware/dataToFile");

//get lockdownhomepage
exports.getPage = (req, res) => {
  res.status(200).render("index", {
    pageTitle: "jillionpix.com",
    path: "/form",
    newPath:"/about",
    sold: req.session.pixData.sold,
    left: req.session.pixData.left,
    terms:
      "jillionpix.com © 2022 jitendra kumar. All rights reserved. I am not responsible for the content of external sites. Images featured on jillionpix.com are © of their respective owners.",
  });
};

//get details page
exports.formPage = (req, res) => {
  res.status(200).render("forms", {
    pageTitle: "fill your details",
    hasError: false,
    path: "/noform",
    newPath:"/about",
    sold: req.session.pixData.sold,
    left: req.session.pixData.left,
    errormsg: "",
    oldData: {
      username: "",
      email: "",
      currency: "",
      _1: "",
      _2: "",
      pixels: "",
    },
    validationError: [],
  });
};

//send data to client
exports.getData = (req, res) => {
  User.find()
    .then((result) => {
      const newArr = [];
      result.forEach((el) => {
        const newObj = {};
        newObj["username"] = el.username;
        newObj["image"] = el.image;
        newObj["links"] = el.links;
        newObj["pixels"] = el.pixels;
        newObj["xcoordinate"] = el.xcoordinate;
        newObj["ycoordinate"] = el.ycoordinate;
        newObj["status"] = el.status;
        newObj["width"] = el.width;
        newObj["height"] = el.height;
        newArr.push(newObj);
      });
      res.status(200).json(newArr);
    })
    .catch((err) => {
      res.status(404).render("error", {
        pageTitle: "Error",
        errmsg: "Page Not Found!!!",
        sold: req.session.pixData.sold,
        left: req.session.pixData.left,
        path: "/noform",
        newPath:"/about"  
      });
    });
};

//checkout page handler
exports.getCheckoutPage = async (req, res) => {
  try {
    req.session.token = crypto.randomBytes(32).toString("hex");
    const area = req.session.userData.pixels;
    let currencyRate = 2 * rate[req.session.userData.currency];
    const session = await stripe.checkout.sessions.create({
      submit_type : "donate",
      customer_email: req.session.userData.email,
      line_items: [
        {
          name: req.session.userData.username,
          description: req.session.extraData.description,
          amount: currencyRate * 100,
          currency: req.session.userData.currency,
          quantity: area,
        },
      ],
      payment_method_types: ["card"],
      // automatic_payment_methods : {enabled : true},
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/checkout/success/${req.session.token
        }`,
      cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel/${req.session.token
        }`,
    });

    res.redirect(303, session.url);
  } catch {
    let sold = req.session.pixData.sold;
    let left = req.session.pixData.left;
    res.status(400).render("error", {
      pageTitle: "Error",
      path: "/noform",
      newPath:"/about",
      sold: sold,
      left: left,
      errmsg: "Network connection error",
    });
  }
};

//payment success handler page
exports.getPaymentSuccessPage = (req, res) => {
  const successId = req.params.successId;
  if (req.session.token === successId) {
    const imgData = req.session.userData.image.split("\\");
    let sold = req.session.pixData.sold;
    let left = req.session.pixData.left;
    resizeImage(
      path.join(__dirname, "..", "..", `${imgData[0]}`, `${imgData[1]}`),
      `${req.session.userData.username}-${imgData[1]}`
    )
      .then((result) => {
        req.session.userData.image = `saveImagesToDB\\${req.session.userData.username}-${imgData[1]}`;
        const user = new User({ ...req.session.userData });
        return user.save();
      })
      .then((result) => {
        dataToFile(req.session.userData);
        req.session.destroy((err) => {
          removeFile();
          res.render("success", {
            pageTitle: "success",
            path: "/noform",
            newPath:"/about",
            sold: sold,
            left: left,
            successMsg:
              "Thanks for buying a piece of pixels on jillionpix.com . We will update your status within 24hrs.",
          });
        });
      })
      .catch((err) => {
        res.status(400).render("error", {
          pageTitle: "Error",
          path: "/noform",
          newPath:"/about",
          sold: sold,
          left: left,
          errmsg: "Page Not Found!!!",
        });
      });
  } else {
    res.status(400).render("error", {
      pageTitle: "Error",
      path: "/noform",
      newPath:"/about",
      sold: sold,
      left: left,
      errmsg: "Page Not Found!!!",
    });
  }
};

//payment cancel  handler page
exports.getCancelPage = (req, res) => {
  const cancelId = req.params.cancelId;
  if (req.session.token === cancelId) {
    res.status(400).render("error", {
      pageTitle: "Error",
      path: "/noform",
      newPath:"/about",
      sold: req.session.pixData.sold,
      left: req.session.pixData.left,
      errmsg: "server error!!!",
    });
  } else {
    res.status(400).render("error", {
      pageTitle: "Error",
      path: "/noform",
      newPath:"/about",
      sold: req.session.pixData.sold,
      left: req.session.pixData.left,
      errmsg: "server error!!!",
    });
  }
};



