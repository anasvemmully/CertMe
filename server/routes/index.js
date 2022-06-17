var express = require("express");
var router = express.Router();
var {
  registerAccountPOST,
  loginAccountPOST,
  logoutAccountPOST,
  // AccessTokenPOST,
  verifyGET,
  viewStatus,
  upload,
} = require("../controllers/apiController");
const { middleware } = require("../middleware/middle");

// const { middle, tokenMiddleware } = require("../middleware/middle");

/* GET home page. */

router.route("/register").post(registerAccountPOST);
router.route("/login").post(loginAccountPOST);

router.route("/verify").post(verifyGET);
router.route("/logout").post(logoutAccountPOST);
router.use(middleware);

// router.route("/token").post(tokenMiddleware, AccessTokenPOST);
// router.use(middle);

//token middleware should be done here

router.route("/upload").post(upload);
router.route("/status").post(viewStatus);
router.route("/*").get((req, res) => {
  return res.status(406).json({
    message: "Invalid Request",
  });
});

module.exports = router;
