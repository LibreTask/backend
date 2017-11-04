/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const HttpStatus = require("http-status-codes");
const ErrorCodes = require("../../errors/error-codes");
const Task = require("../../models/Task");
const User = require("../../models/User");
const constants = require("../../common/constants");
const logger = require("../../adapters/log-adapter");

function validateAndCreateTask(user, req, res) {
  const name = req.body.name;
  const dueDateTimeUtc = req.body.dueDateTimeUtc || null;
  const notes = req.body.notes || "";

  let validationPassed = true;
  validationPassed &= Task.isValidName(name);
  validationPassed &= Task.isValidDate(dueDateTimeUtc);
  validationPassed &= Task.isValidNotes(notes);

  if (!validationPassed) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: ErrorCodes.VALIDATION_FAILURE
    });
  }

  /*
     It is possible to create a task that has already been completed.

     This scenario occurs when the client is unable to reach the server,
     and, consequently, the task has been created (and updated) LOCALLY.
     In other words, the CREATE + UPDATE is being bundled together here.
  */
  let isCompleted = req.body.isCompleted ? true : false;
  let completionDateTimeUtc = isCompleted
    ? req.body.completionDateTimeUtc
    : undefined;

  Task.create({
    name: name,
    ownerId: user.id,
    dueDateTimeUtc: dueDateTimeUtc,
    notes: notes,
    isCompleted: isCompleted,
    completionDateTimeUtc: completionDateTimeUtc
  })
    .then(task => {
      return res.status(HttpStatus.OK).json({
        success: true,
        task: task.publicAttributes()
      });
    })
    .catch(err => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
      });
    });
}

/**
* POST /task/create
* Create new task.
*/
async function createTask(req, res, next) {
  try {
    const tasksCreatedByUser = await Task.count({
      where: ["owner_id = ?", req.user.id]
    });

    if (tasksCreatedByUser >= constants.DEFAULT_MAX_TASKS) {
      return res.status(HttpStatus.FORBIDDEN).json({
        errorCode: ErrorCodes.EXCEEDED_ENTITY_LIMIT
      });
    }

    validateAndCreateTask(req.user, req, res);
  } catch (err) {
    logger.error("Create task error: " + err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
    });
  }
}

module.exports = createTask;
