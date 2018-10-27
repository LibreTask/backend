/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const crypto = require("crypto");
const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const constants = require("../../common/constants");
const emailTemplates = require("../../email-templates");
const EmailAdapter = require("../../adapters/email-adapter");
const logger = require("../../adapters/log-adapter");

function createNewUser(req, res) {
  crypto.randomBytes(16, (err, buff) => {
    let token = buff.toString("hex");

    User.create({
      email: req.body.email,
      password: req.body.password,
      confirmEmailToken: token
    }).then(user => {
      const mailOptions = emailTemplates.confirmEmail({
        toAddress: user.email,
        fromAddress: constants.NO_REPLY_EMAIL,
        confToken: token,
        includeWelcomeMessage: true // send welcome message for new users
      });

      EmailAdapter.sendMail(mailOptions).catch(err => {
        logger.error("Signup email error: " + err);
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        profile: user.profile()
      });
    });
  });
}

/**
 * POST /user/signup
 * Create a new local account.
 */
async function signup(req, res, next) {
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

  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (user) {
      return res.status(HttpStatus.CONFLICT).json({
        errorCode: ErrorCodes.EMAIL_IS_ALREADY_USED
      });
    }

    // no existing user; continue with registration
    createNewUser(req, res);
  } catch (err) {
    logger.error("Signup error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = signup;
