/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const confirmEmail = require("./confirm-email");
const deleteProfile = require("./delete-profile");
//const downgradeProfile = require("./downgrade-profile");
const getProfileById = require("./get-profile-by-id");
const login = require("./login");
const requestPasswordReset = require("./request-password-reset");
const signup = require("./signup");
const updatePassword = require("./update-password");
const updateProfile = require("./update-profile");
//const upgradeProfile = require("./upgrade-profile");
//const updatePaymentInfo = require("./update-payment-info");

module.exports = {
  confirmEmail: confirmEmail,
  deleteProfile: deleteProfile,
  //  downgradeProfile: downgradeProfile,
  getProfileById: getProfileById,
  login: login,
  requestPasswordReset: requestPasswordReset,
  signup: signup,
  updatePassword: updatePassword,
  updateProfile: updateProfile
  //  upgradeProfile: upgradeProfile,
  //  updatePaymentInfo: updatePaymentInfo
};
