const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// SINGUP Render
// router.get("/signup", userController.renderSingUp);

// SINGUP
// router.post("/signup", wrapAsync(userController.singUp));

router
  .route("/signup")
  .get(userController.renderSingUp)
  .post(wrapAsync(userController.singUp));

//LOGIN Render
// router.get(userController.renderLogin);

//LOGIN
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.Login
// );

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );
//Logout
router.get("/logout", userController.Logout);

module.exports = router;
