/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const queryString = require("query-string");
const ErrorCodes = require("../../errors/error-codes");
const User = require("../../models/User");
const constants = require("../../common/constants");

/**
 * GET /user/get-profile-by-id
 * Profile page.
 */
function getProfileById(req, res, next) {
  return res.status(HttpStatus.OK).json({
    profile: req.user.profile()
  });
}

module.exports = getProfileById;
