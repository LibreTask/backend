/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const queryString = require("query-string");
const Release = require("../../models/Release");
const logger = require("../../adapters/log-adapter");

/**
* GET /meta/get-latest-version/:query
* Get latest app version for a specific platform
*/
async function getLatestVersion(req, res, next) {
  try {
    const getVersionReq = queryString.parse(req.params.query);

    const release = await Release.findOne({
      where: {
        platform: getVersionReq.platform
      }
    });

    if (release) {
      return res.status(HttpStatus.OK).json({
        success: true,
        release: release.publicAttributes()
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        errorCode: ErrorCodes.NOTHING_FOUND
      });
    }
  } catch (err) {
    logger.error("Get version error: " + error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = getLatestVersion;
