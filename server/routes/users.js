var express = require("express");
var router = express.Router();

const path = require("path");

/* GET users listing. */
router.get("*", function (req, res) {
  return res.redirect("/");
});

module.exports = router;
