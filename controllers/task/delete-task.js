/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const Task = require("../../models/Task");
const logger = require("../../adapters/log-adapter");

/**
* DELETE /task/delete
* Delete single task based upon id
*/
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOne({
      where: {
        id: req.body.taskId,
        ownerId: req.user.id
      }
    });

    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        errorCode: ErrorCodes.NOTHING_FOUND
      });
    }

    // We do not immediately delete the Task.
    // The deletion must first be synced to all of the User's devices.
    task.isDeleted = true;
    task
      .save()
      .then(rowsTouched => {
        return res.status(HttpStatus.OK).json({
          task: task.publicAttributes(),
          success: true
        });
      })
      .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
        });
      });
  } catch (err) {
    logger.error("Delete task error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = deleteTask;
