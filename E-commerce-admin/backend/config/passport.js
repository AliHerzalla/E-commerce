require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require("../models/users.js");

// NOTE: Change the emails that can access to dashboard
adminEmails = ["alihazemherzalla@gmail.com"];

passport.serializeUser((user, done) => {
    if (adminEmails.includes(user.email)) {
        done(null, user.google_id);
    } else {
        done("Not Authenticated", null);
    }
});

passport.deserializeUser(async (id, done) => {
    const UserDoc = await UserModel.findOne({ google_id: id });
    if (UserDoc) {
        done(null, UserDoc);
    }
});

const strategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
};

passport.use(new GoogleStrategy(strategyOptions, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const userFoundedInfo = await UserModel.findOne({ google_id: profile.id });

        if (userFoundedInfo) {
            return done(null, userFoundedInfo);
        } else {
            const UserDoc = await UserModel.create({
                google_id: profile.id,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                profile_picture: profile.photos[0].value
            });
            return done(null, UserDoc);
        }
    } catch (error) {
        console.log(error);
    }
}));