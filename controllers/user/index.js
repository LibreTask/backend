/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const confirmEmail = require("./confirm-email");
const deleteProfile = require("./delete-profile");
const getProfileById = require("./get-profile-by-id");
const login = require("./login");
const requestPasswordReset = require("./request-password-reset");
const signup = require("./signup");
const updatePassword = require("./update-password");
const updateProfile = require("./update-profile");

module.exports = {
  confirmEmail: confirmEmail,
  deleteProfile: deleteProfile,
  getProfileById: getProfileById,
  login: login,
  requestPasswordReset: requestPasswordReset,
  signup: signup,
  updatePassword: updatePassword,
  updateProfile: updateProfile
};
