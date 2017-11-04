/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const constants = require("../../common/constants");
const emailTemplates = require("../../email-templates");
const EmailAdapter = require("../../adapters/email-adapter");
const logger = require("../../adapters/log-adapter");

function validateAndUpdatePassword(user, req, res) {
  let validationPassed = true;
  validationPassed &= User.isValidPassword(req.body.password);

  if (!validationPassed) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: ErrorCodes.VALIDATION_FAILURE
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = null;
  user.passwordResetExpirationDateTimeUtc = null;
  user
    .save()
    .then(response => {
      const mailOptions = emailTemplates.passwordUpdated({
        toAddress: user.email,
        fromAddress: constants.NO_REPLY_EMAIL
      });
      EmailAdapter.sendMail(mailOptions).catch(err => {
        if (err) {
          logger.error("Update password email error: " + err);
        }
      });

      return res.status(HttpStatus.OK).json({
        profile: user.profile()
      });
    })
    .catch(err => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
      });
    });
}

/**
 * POST /user/reset-password/
 * Process the reset password request.
 */
async function updatePassword(req, res, next) {
  try {
    const user = await User.findOne({
      where: {
        passwordResetToken: req.body.token,
        passwordResetExpirationDateTimeUtc: {
          gt: Date.now()
        }
      }
    });

    if (!user) {
      return res.status(HttpStatus.FORBIDDEN).json({
        errorCode: ErrorCodes.INVALID_PASSWORD_RESET_TOKEN
      });
    }

    // user submitted invalid email
    if (user.email !== req.body.email) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errorCode: ErrorCodes.USER_DOES_NOT_EXIST
      });
    }

    validateAndUpdatePassword(user, req, res);
  } catch (err) {
    logger.error("Update password error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = updatePassword;
