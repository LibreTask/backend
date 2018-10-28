/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const Task = require("../../models/Task");
const ErrorCodes = require("../../errors/error-codes");
const constants = require("../../common/constants");
const logger = require("../../adapters/log-adapter");

function validateAndUpdate(task, req, res) {
  /*
    If field not present as input, do not use existing version.
    We expect the entire task to be submitted upon each update;
    if a field is not submitted, we assume it is to be null.
  */
  task.name = req.body.task.name;
  task.notes = req.body.task.notes;
  task.dueDateTimeUtc = req.body.task.dueDateTimeUtc || null;

  // TODO - how to best set boolean
  task.isCompleted = req.body.task.isCompleted;

  if (task.isCompleted) {
    task.completionDateTimeUtc = req.body.task.completionDateTimeUtc;
  } else {
    // if task not completed, ensure completion date is unset
    task.completionDateTimeUtc = null;
  }

  let validationPassed = true;
  validationPassed &= Task.isValidName(task.name);
  validationPassed &= Task.isValidDate(task.dueDateTimeUtc);
  validationPassed &= Task.isValidDate(task.completionDateTimeUtc);
  validationPassed &= Task.isValidNotes(task.notes);

  if (!validationPassed) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: ErrorCodes.VALIDATION_FAILURE
    });
  }

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
}

/**
* POST /task/update
* Update a single task's attributes.
*/
async function updateTask(req, res, next) {
  try {
    const task = await Task.findOne({
      where: {
        id: req.body.task.id,
        ownerId: req.user.id
      }
    });

    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        errorCode: ErrorCodes.NOTHING_FOUND
      });
    }

    validateAndUpdate(task, req, res);
  } catch (err) {
    logger.error("Update task error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = updateTask;
