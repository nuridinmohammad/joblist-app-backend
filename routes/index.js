import express from "express";
const router = express()

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Jobs RESTfull API Services" });
});

export default router