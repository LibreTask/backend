/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const crypto = require("crypto");
const constants = require("../../common/constants");
const HttpStatus = require("http-status-codes");
const queryString = require("query-string");
const ErrorCodes = require("../../errors/error-codes");
const emailTemplates = require("../../email-templates");
const EmailAdapter = require("../../adapters/email-adapter");
const User = require("../../models/User");
//const paymentsAdapter = require("../../adapters/payments-adapter");
const logger = require("../../adapters/log-adapter");

/**
 * POST /user/update
 * Update profile information.
 */
async function updateProfile(req, res, next) {
  const user = req.user;
  const updatedEmail = req.body.profile.email;
  const showCompletedTasks = req.body.profile.showCompletedTasks || false;

  // if email or showCompletedTasks has not changed, do nothing.
  // these are the only update-able field.
  if (
    user.email === updatedEmail &&
    user.showCompletedTasks === showCompletedTasks
  ) {
    // TODO - re-evaluate the status code
    return res.status(HttpStatus.OK).json({
      profile: user.profile(),
      success: true
    });
  }

  let validationPassed = true;
  validationPassed &= User.isValidEmail(updatedEmail);

  if (!validationPassed) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: ErrorCodes.VALIDATION_FAILURE
    });
  }

  if (updatedEmail !== user.email) {
    // The user has provided a new email.
    // We must test that it is not already used.
    const userExistsWithSameEmail = await User.findOne({
      where: { email: updatedEmail }
    });

    if (userExistsWithSameEmail) {
      return res.status(HttpStatus.CONFLICT).json({
        errorCode: ErrorCodes.EMAIL_IS_ALREADY_USED
      });
    }

    // update stripe profile with new email
    if (user.customerId) {
      // TODO - what to do when Stripe fails?
      // TODO - should we wait on stripe?
      //  paymentsAdapter.updateCustomerEmail(user.customerId, user.email);
    }

    let token = (await crypto.randomBytes(16)).toString("hex");
    user.confirmEmailToken = token;
    user.emailIsConfirmed = false; // reset for new email

    const mailOptions = emailTemplates.confirmEmail({
      toAddress: user.email,
      fromAddress: constants.NO_REPLY_EMAIL,
      confToken: token,
      includeWarningMessage: true // inform user of update
    });

    EmailAdapter.sendMail(mailOptions).catch(err => {
      logger.error("Update profile email error: " + err);
    });
  }

  user.email = updatedEmail;
  user.showCompletedTasks = showCompletedTasks;
  user
    .save()
    .then(response => {
      return res.status(HttpStatus.OK).json({
        profile: user.profile(),
        success: true
      });
    })
    .catch(err => {
      logger.error("Update profile error: " + err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
      });
    });
}

module.exports = updateProfile;
