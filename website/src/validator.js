/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import Validator from "validator";

const AppValidator = {
  isValidEmail: function(email) {
    return Validator.isEmail(email);
  },
  isValidPassword: function(password) {
    return Validator.isLength(password, { min: 6, max: 100 });
  }
};

module.exports = AppValidator;
