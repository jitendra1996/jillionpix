module.exports = (req, res, next) => {
  if (!req.session.userData) {
    return res.status(404).render("error", {
      pageTitle: "Error",
      errmsg: "Page Not Found!!!",
      sold : req.session.pixData.sold,
      left : req.session.pixData.left,
      path: "/noform",
      newPath:"/about"
    });
  }
  next();
};
