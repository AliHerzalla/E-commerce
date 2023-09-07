const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();
const { handelLoginSuccess, handelLogout } = require("../controllers/authControllers.js");

// auth/login/success
router.get("/login/success", handelLoginSuccess);

// auth/logout
router.get('/logout', handelLogout);

// auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    session: true,
    successRedirect: process.env.LOGIN_SUCCESS_REDIRECT,
    failureRedirect: process.env.LOGIN_FAILURE_REDIRECT
}));

module.exports = router;