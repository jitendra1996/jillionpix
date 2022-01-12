require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const route = require("./routers/route");
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
// const morgan = require("morgan");
// const fs = require("fs");
const crypto = require("crypto");

const app = express();
const pixelData = require("./middleware/fetchPixData");
const port = process.env.PORT || 3000;

const store = new MongoDBStore({
  uri: process.env.DB_CONNECTION_URL,
  collection: "sessions",
});

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "logs", "access.log"),
//   { flags: "a" }
// );

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(helmet());
app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  "/saveImagesToDB",
  express.static(path.join(__dirname, "..", "saveImagesToDB"))
);
app.use("/images", express.static(path.join(__dirname, "..", "images")));
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use((req, res, next) => {
  try{
    res.locals.csrfToken = req.csrfToken();
    next();
  }catch(err){
    res.send("csrf error hello");
  }
});
app.use(pixelData);

app.use(route);

app.get("*", (req, res) => {
  res.status(404).render("error", {
    errmsg: "Server error!!!",
    pageTitle: "Error",
    sold: req.session.pixData.sold,
    left: req.session.pixData.left,
    path: "/noform",
    newPath:"/about"
  });
});

mongoose
  .connect(process.env.DB_CONNECTION_URL)
  .then((result) => {
    app.listen(port, () => {
      console.log(`server is listing to ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

