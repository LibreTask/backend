/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

//const accountUpgrade = require("./account-upgrade");
//const accountDowngrade = require("./account-downgrade");
const accountDeleted = require("./account-deleted");
const accountVerified = require("./account-verified");
const passwordUpdated = require("./password-updated");
const resetPassword = require("./reset-password");
//const paymentDetailsUpdated = require("./payment-details-updated");
const confirmEmail = require("./confirm-email");

module.exports = {
  //accountUpgrade: accountUpgrade,
  //accountDowngrade: accountDowngrade,
  accountDeleted: accountDeleted,
  accountVerified: accountVerified,
  passwordUpdated: passwordUpdated,
  //paymentDetailsUpdated: paymentDetailsUpdated,
  resetPassword: resetPassword,
  confirmEmail: confirmEmail
};
