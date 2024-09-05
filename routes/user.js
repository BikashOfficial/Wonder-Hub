const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", wrapAsync(
    async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            // console.log(password);
            req.flash("success", "user registered Successfully!");
            res.redirect("/listings");
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to WanderHub");
        res.redirect("/listings");
    }
);

module.exports = router;