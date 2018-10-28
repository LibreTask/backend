/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const constants = require("../../common/constants");
const emailTemplates = require("../../email-templates");
const EmailAdapter = require("../../adapters/email-adapter");
const logger = require("../../adapters/log-adapter");

/**
 * DELETE /user/delete
 * Delete user profile.
 # All associated entities are deleted by a database-level cascade.
 */
function deleteProfile(req, res, next) {
  // TODO - when payment processing implemented, update here on profile delete

  req.user
    .destroy()
    .then(rowsTouched => {
      const mailOptions = emailTemplates.accountDeleted({
        toAddress: req.user.email,
        fromAddress: constants.NO_REPLY_EMAIL
      });

      EmailAdapter.sendMail(mailOptions).catch(err => {
        if (err) {
          logger.error("Error sending DeleteProfile email: " + err);

          // TODO - how to handle?
        }
      });

      return res.status(HttpStatus.OK).json({
        success: true
      });
    })
    .catch(err => {
      logger.error("Delete profile error: " + err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
      });
    });
}

module.exports = deleteProfile;
