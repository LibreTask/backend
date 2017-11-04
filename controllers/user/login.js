/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const constants = require("../../common/constants");
const passport = require("passport");
const HttpStatus = require("http-status-codes");
const queryString = require("query-string");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const logger = require("../../adapters/log-adapter");

/**
 * POST /user/login
 * Sign in using email and password.
 */
function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  let validationPassed = true;
  validationPassed &= User.isValidEmail(email);
  validationPassed &= User.isValidPassword(password);

  if (!validationPassed) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: ErrorCodes.VALIDATION_FAILURE
    });
  }

  // use req.body.password and req.body.email to login
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      logger.error("Login error: " + err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
      });
    } else if (user) {
      return res.status(HttpStatus.OK).json({
        profile: user.profile()
      });
    } else {
      // no error occurred, but the user was not found
      return res.status(HttpStatus.FORBIDDEN).json({
        errorCode: ErrorCodes.INVALID_LOGIN
      });
    }
  })(req, res, next);
}

module.exports = login;
