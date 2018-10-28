/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const logger = require("../../adapters/log-adapter");

/**
 * POST /user/confirm/email/
 * Confirm registration/email-update page.
 */
async function confirmEmail(req, res, next) {
  try {
    const user = await User.findOne({
      where: { confirmEmailToken: req.body.token }
    });

    if (!user) {
      return res.status(HttpStatus.FORBIDDEN).json({
        errorCode: ErrorCodes.INVALID_EMAIL_CONFIRMATION_TOKEN
      });
    } else if (user.emailIsConfirmed) {
      return res.status(HttpStatus.FORBIDDEN).json({
        errorCode: ErrorCodes.EMAIL_CONFIRMATION_TOKEN_ALREADY_USED
      });
    } else {
      user.emailIsConfirmed = true;
      user.confirmEmailToken = null;
      user
        .save()
        .then(rowsTouched => {
          return res.status(HttpStatus.OK).json({
            success: true
          });
        })
        .catch(err => {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
          });
        });
    }
  } catch (err) {
    logger.error("Confirm email error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = confirmEmail;
