const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const controllerPost = require("../controllers/postData");
const isAuth = require("../middleware/auth");
const { check, body } = require("express-validator");
const imgAuth = require("../middleware/imgAuth");
const checkPrime = require("../middleware/checkprime");
// const imgResize = require("../middleware/imgResize");

//show index.ejs page
router.get("/", controller.getPage);

//show about page to screen
router.get("/about",(req,res)=>{
  res.status(200).render('about',{
    pageTitle: "About",
    path: "/form",
    newPath:'/noAbout',
    sold: req.session.pixData.sold,
    left: req.session.pixData.left,
  });
})

//details page get router
router.get("/details", controller.formPage);
//post router to send data to db
router.post(
  "/details",
  body("name").not().isEmpty().trim().escape().withMessage("username required"),
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter valid email."),
  body("pixels").custom((value) => {
    if (value <= 0) {
      throw new Error("pixels should be greater than 0 and integer value.");
    }else if(checkPrime(value)){
      throw new Error('pixels should not be prime number.');
    }
    return true;
  }),
  imgAuth,
  controllerPost.postData
);

router.post("/checkout", isAuth, controller.getCheckoutPage);

router.get(
  "/checkout/success/:successId",
  isAuth,
  controller.getPaymentSuccessPage
);

router.get("/checkout/cancel/:cancelId", isAuth, controller.getCancelPage);

router.get("/d", controller.getData);

module.exports = router;
