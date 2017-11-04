/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const createTask = require("./create-task");
const deleteTask = require("./delete-task");
const getTaskById = require("./get-task-by-id");
const updateTask = require("./update-task");
const syncTasksAfterTimestamp = require("./sync-tasks-after-timestamp");

module.exports = {
  createTask: createTask,
  deleteTask: deleteTask,
  getTaskById: getTaskById,
  updateTask: updateTask,
  syncTasksAfterTimestamp: syncTasksAfterTimestamp
};
