/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const queryString = require("query-string");
const Task = require("../../models/Task");
const validator = require("validator");
const logger = require("../../adapters/log-adapter");
const _ = require("lodash");

/**
* GET /task/sync-tasks-after-timestamp/:timestamp
*
* Returns updated client state after input timestamp

INPUT
{
  timestamp
}

RETURN
  {
    // only return what has been updated
      // if no diff, do not return anything
    tasks: []
  }
*/
function syncTasksAfterTimestamp(req, res, next) {
  const utcTimestamp = queryString.parse(req.params.query).timestamp;

  if (!utcTimestamp || !validator.isISO8601(utcTimestamp)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: ErrorCodes.VALIDATION_FAILURE
    });
  }

  Task.findAll({
    where: {
      updatedAtDateTimeUtc: {
        gte: utcTimestamp
      },
      ownerId: req.user.id
    }
  })
    .then(dbTasks => {
      let tasks = [];
      for (let task of dbTasks) {
        tasks.push(task.publicAttributes());
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        tasks: tasks
      });
    })
    .catch(err => {
      logger.error("Sync tasks error: " + err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
      });
    });
}

module.exports = syncTasksAfterTimestamp;
