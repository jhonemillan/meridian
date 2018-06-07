const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let private = require('../config/googleauth');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: private.googleAuth.clientID,
            clientSecret: private.googleAuth.clientSecret,
            callbackURL: private.googleAuth.callbackURL
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};