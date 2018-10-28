/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const queryString = require("query-string");
const Task = require("../../models/Task");
const logger = require("../../adapters/log-adapter");

/**
* GET /task/get-task-by-id/:query
* Get task by the task id.
*/
async function getTaskById(req, res, next) {
  try {
    const getTaskReq = queryString.parse(req.params.query);

    const task = await Task.findOne({
      where: {
        id: getTaskReq.taskId,
        ownerId: req.user.id
      }
    });

    if (task) {
      return res.status(HttpStatus.OK).json({
        success: true,
        task: task.publicAttributes()
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        errorCode: ErrorCodes.NOTHING_FOUND
      });
    }
  } catch (err) {
    logger.error("Get task error: " + error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = getTaskById;
