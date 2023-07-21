require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require("../db.js");

const searchUserQuery = "SELECT google_id,first_name,last_name,email,profile_picture FROM users WHERE google_id = ?";
const insertNewUserQuery = "INSERT INTO users (google_id,first_name,last_name,email,profile_picture) VALUES (?,?,?,?,?)";

passport.serializeUser((user, done) => {
    done(null, user.google_id);
});

passport.deserializeUser((id, done) => {
    connection.execute(searchUserQuery, [id], (error, result) => {
        if (error) {
            console.log(error);
            return done(error);
        }
        done(null, result[0]);
    });
});

const strategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
};

passport.use(new GoogleStrategy(strategyOptions, (req, accessToken, refreshToken, profile, done) => {
    connection.execute(searchUserQuery, [profile.id], (err, result) => {
        if (err) {
            return done(err);
        } else if (result.length > 0) {
            return done(null, result[0]);
        } else {
            const values = [profile.id, profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.photos[0].value];
            connection.execute(insertNewUserQuery, values, (err, insertResult) => {
                if (err) {
                    return done(err);
                }
                const insertedUser = {
                    google_id: profile.id,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    profile_picture: profile.photos[0].value
                };
                return done(null, insertedUser);
            });
        }
    });
}));