var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to our Runaways' backend!", " Go to /users or /rooms");
});

module.exports = router;
