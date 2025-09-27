const express = require("express");
const router = express.Router();
const User = require("../modules/user.js");
const wrapAsync = require("../utils/error.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const controllerAuth = require("../controller/users.js")

//Render && Post route
router.route("/signup")
    .get(controllerAuth.renderSignUp)
    .post(wrapAsync(controllerAuth.signUpRoute));

//Login Route && //Post Route
router.route("/login")
    .get(controllerAuth.renderLogin)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, }), controllerAuth.loginRoute);

//Logout Route 
router.get("/logout", controllerAuth.logoutRoute);

module.exports = router;