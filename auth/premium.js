/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../errors/error-codes");
const User = require("../models/User");

async function premiumAuthentication(req, res, next) {
  const user = await User.findOne({
    where: { id: req.user.id }
  });

  if (!user) {
    // unable to locate the user; this should never happen
    // because authentication should have already occurred
    return res.status(HttpStatus.NOT_FOUND).json({
      errorCode: ErrorCodes.NOTHING_FOUND
    });
  }

  if (!user.hasActivePremiumSubscription()) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      errorCode: ErrorCodes.PREMIUM_SUBSCRIPTION_REQUIRED
    });
  }

  next(); // authentication passed
}

module.exports = premiumAuthentication;
