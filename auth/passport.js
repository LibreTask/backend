/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const _ = require("lodash");
const passport = require("passport");
const request = require("request");
const LocalStrategy = require("passport-local").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;
const User = require("../models/User");
const logger = require("../adapters/log-adapter");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({
    where: { id: id }
  })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({
      where: { email: email.toLowerCase() }
    })
      .then(user => {
        if (!user) {
          return done(null, false, {
            msg: `No account associated with that email address`
          });
        }

        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: "Invalid email or password." });
        });
      })
      .catch(err => {
        logger.error("Error with local auth: " + err);
        return done(err);
      });
  })
);

/**
 * Utilized for API authentication.
 * Note that id and password are stored in the HTTP header.
 */
passport.use(
  new BasicStrategy({ passReqToCallback: true }, function(
    req,
    userId,
    password,
    done
  ) {
    User.findOne({
      where: { id: userId }
    })
      .then(user => {
        if (!user) return done(null, false);

        user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(null, user);
          return done(null, false);
        });
      })
      .catch(err => {
        logger.error("Error with basic auth: " + err);
        return done(err);
      });
  })
);

exports.passport = passport;
