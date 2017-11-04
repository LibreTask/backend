/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const Sequelize = require("sequelize");
const model = require("./base");
const uuidv4 = require("uuid/v4");
const validator = require("validator");

var Task = model.define(
  "task",
  {
    id: {
      type: Sequelize.TEXT,
      primaryKey: true,
      field: "id"
    },
    ownerId: {
      type: Sequelize.TEXT,
      references: {
        model: "users",
        key: "id"
      },
      field: "owner_id"
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: "name",
      validate: {
        len: {
          msg: "Task name must be between one and two-hundred fifty characters",
          args: [1, 250]
        }
      },
      get: function() {
        // TODO - consider decrypting name (assuming already encrypted)

        return this.getDataValue("name");
      }
    },
    dueDateTimeUtc: {
      type: Sequelize.DATE,
      defaultValue: null,
      field: "due_date_time_utc",
      get: function() {
        // values are stored in UTC; make that explicit before returning
        let dueDateTimeUtc = this.getDataValue("dueDateTimeUtc");
        return dueDateTimeUtc ? new Date(dueDateTimeUtc + "Z").getTime() : null;
      }
    },
    isCompleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: "is_completed"
    },
    completionDateTimeUtc: {
      type: Sequelize.DATE,
      defaultValue: null,
      field: "completion_date_time_utc",
      get: function() {
        // values are stored in UTC; make that explicit before returning
        let completionDateTimeUtc = this.getDataValue("completionDateTimeUtc");
        return completionDateTimeUtc
          ? new Date(completionDateTimeUtc + "Z").getTime()
          : null;
      }
    },
    notes: {
      type: Sequelize.TEXT,
      field: "notes",
      validate: {
        len: {
          msg: "Task notes must be between less than one thousand characters",
          args: [0, 1000]
        }
      },
      get: function() {
        // TODO - consider decrypting notes (assuming already encrypted)

        return this.getDataValue("notes");
      }
    },
    createdAtDateTimeUtc: {
      type: Sequelize.DATE,
      field: "created_at_date_time_utc",
      get: function() {
        // values are stored in UTC; make that explicit before returning
        let createdAtDateTimeUtc = this.getDataValue("createdAtDateTimeUtc");
        return createdAtDateTimeUtc
          ? new Date(createdAtDateTimeUtc + "Z").getTime()
          : null;
      }
    },
    updatedAtDateTimeUtc: {
      type: Sequelize.DATE,
      field: "updated_at_date_time_utc",
      get: function() {
        // values are stored in UTC; make that explicit before returning
        let updatedAtDateTimeUtc = this.getDataValue("updatedAtDateTimeUtc");
        return updatedAtDateTimeUtc
          ? new Date(updatedAtDateTimeUtc + "Z").getTime()
          : null;
      }
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: "is_deleted"
    }
  },
  {
    classMethods: {
      _generateId: function() {
        return "task-" + uuidv4();
      },
      associate: function(models) {
        Task.belongsTo(models.User, {
          foreignKey: "owner_id",
          targetKey: "id"
        });
      },
      publicAttributesFromRawQuery: function(task) {
        // TODO - validate or use sequelize functionality
        // SEE: https://github.com/sequelize/sequelize/issues/1830

        return {
          id: task.id,
          ownerId: task.owner_id,
          name: task.name,
          dueDateTimeUtc: task.due_date_time_utc,
          isCompleted: task.is_completed,
          isDeleted: task.is_deleted,
          notes: task.notes,
          completionDateTimeUtc: task.completion_date_time_utc,
          createdAtDateTimeUtc: task.created_at_date_time_utc,
          updatedAtDateTimeUtc: task.updated_at_date_time_utc
        };
      },
      /*
      These validation methods are used in addition to the checks by the
      database. The former exist because they are more expresisve and allow
      more control over client notification of validation failures.
     */
      isValidName: function(name) {
        // TODO - hardcode all ranges

        return name && validator.isLength(name, { min: 1, max: 250 });
      },
      isValidDate: function(dateTimeUtc) {
        // all dates are an optional field; thus we accept null/undefined.
        // However, if present, the date must conform to ISO 8601 format.
        return (
          !dateTimeUtc ||
          dateTimeUtc instanceof Date ||
          (dateTimeUtc && new Date(dateTimeUtc).getTime() > 0)
        );
      },
      isValidNotes: function(notes) {
        // TODO - hardcode all ranges

        // optional attribute
        return (
          !notes || (notes && validator.isLength(notes, { min: 0, max: 5000 }))
        );
      }
    },
    instanceMethods: {
      publicAttributes: function() {
        return {
          id: this.id,
          ownerId: this.ownerId,
          name: this.name,
          dueDateTimeUtc: this.dueDateTimeUtc,
          isCompleted: this.isCompleted,
          isDeleted: this.isDeleted,
          notes: this.notes,
          completionDateTimeUtc: this.completionDateTimeUtc,
          createdAtDateTimeUtc: this.createdAtDateTimeUtc,
          updatedAtDateTimeUtc: this.updatedAtDateTimeUtc
        };
      }
    },
    hooks: {
      beforeCreate: function(task, option) {
        // TODO - consider encrypting name / notes

        task.id = this._generateId();
        task.createdAtDateTimeUtc = Sequelize.fn("NOW");
        task.updatedAtDateTimeUtc = Sequelize.fn("NOW");
      },
      beforeUpdate: function(task, option) {
        // TODO - consider encrypting name / notes

        task.updatedAtDateTimeUtc = Sequelize.fn("NOW");

        // TODO - be sure to "cascade" the "isDeleted" flag
      },
      beforeBulkCreate: function(tasks, options) {
        options.individualHooks = true;
      },
      beforeBulkDestroy: function(options) {
        options.individualHooks = true;
      },
      beforeBulkUpdate: function(options) {
        options.individualHooks = true;
      }
    },
    timestamps: false,
    freezeTableName: true,
    tableName: "tasks"
  }
);

module.exports = Task;
