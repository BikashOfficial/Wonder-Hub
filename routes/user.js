const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.signupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.loginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),userController.login
);

//logout
router.get("/logout", userController.logout);

module.exports = router;