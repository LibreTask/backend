/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const crypto = require("crypto");
const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const constants = require("../../common/constants");
const emailTemplates = require("../../email-templates");
const DateUtils = require("../../common/date-utils");
const EmailAdapter = require("../../adapters/email-adapter");
const logger = require("../../adapters/log-adapter");

function success() {
  return res.status(HttpStatus.OK).json({
    success: true
  });
}

function sendPasswordResetEmail(user, req, res) {
  crypto.randomBytes(16, (err, buf) => {
    const token = buf.toString("hex");

    user.passwordResetToken = token;
    user.passwordResetExpirationDateTimeUtc = Date.now() + 3600000; // 1 hour
    user
      .save()
      .then(response => {
        const mailOptions = emailTemplates.resetPassword({
          toAddress: user.email,
          fromAddress: constants.NO_REPLY_EMAIL,
          resetToken: token
        });
        EmailAdapter.sendMail(mailOptions).catch(err => {
          if (err) {
            logger.error("Request password email error: " + err);
          }
        });

        return success();
      })
      .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
        });
      });
  });
}

/**
 * POST /user/request-password-reset
 * Create a random token, then the send user an email with a reset link.
 */
async function requestPasswordReset(req, res, next) {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      /*
      We do not want malicious actors to be able to enumerate all email
      addresses in order to determine which are valid and which invalid.

      Thus, if the user does not exist, we simply return the same value as
      when the user does exist.

      If the password reset request was legitimate, the user will receive
      an email notifying them of the next steps.
      */
      return success();
    }

    if (user.passwordResetToken) {
      let resetExpiration = new Date(user.passwordResetExpirationDateTimeUtc);

      if (resetExpiration >= DateUtils.now()) {
        /*
          If a token has already been issued, and has not expired,
          do not issue another.

          Otherwise, a malicious actor could script password
          reset requests and spam legitimate users.
        */
        return res.status(HttpStatus.OK).json({
          success: true
        });
      }
    }

    sendPasswordResetEmail(user, req, res);
  } catch (err) {
    logger.error("Request password reset error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = requestPasswordReset;
