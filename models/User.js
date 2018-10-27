/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const Sequelize = require("sequelize");
const Constants = require("../common/constants");
const bcrypt = require("bcrypt-nodejs");
const model = require("./base");
const uuidv4 = require("uuid/v4");
const validator = require("validator");

var User = model.define(
  "user",
  {
    id: {
      type: Sequelize.TEXT,
      primaryKey: true,
      field: "id"
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      field: "email",
      validate: {
        isEmail: {
          msg: "A valid email address is required"
        }
      }
    },
    showCompletedTasks: {
      type: Sequelize.BOOLEAN,
      field: "show_completed_tasks",
      default: true
    },
    confirmEmailToken: {
      type: Sequelize.TEXT,
      field: "confirm_email_token"
    },
    emailIsConfirmed: {
      type: Sequelize.BOOLEAN,
      field: "email_is_confirmed",
      default: false
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: "password"
    },
    passwordResetToken: {
      type: Sequelize.TEXT,
      field: "password_reset_token"
    },
    passwordResetExpirationDateTimeUtc: {
      type: Sequelize.DATE,
      field: "password_reset_expiration_date_time_utc",
      get: function() {
        // values are stored in UTC; make that explicit before returning
        let passwordResetExpirationDateTimeUtc = this.getDataValue(
          "passwordResetExpirationDateTimeUtc"
        );
        return passwordResetExpirationDateTimeUtc
          ? new Date(passwordResetExpirationDateTimeUtc + "Z").getTime()
          : null;
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
    }
  },
  {
    classMethods: {
      /*
      These validation methods are used in addition to the checks by the
      database. The former exist because they are more expresisve and allow
      more control over client notification of validation failures.
     */
      isValidEmail: function(email) {
        return email && validator.isEmail(email);
      },
      isValidPassword: function(password) {
        // TODO - hardcode all ranges

        return password && validator.isLength(password, { min: 6, max: 100 });
      },
      hashPassword: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      _generateId: function() {
        return "user-" + uuidv4();
      },
      associate: function(models) {
        User.hasMany(models.Task, {
          foreignKey: "owner_id",
          onDelete: "cascade"
        });
      }
    },
    instanceMethods: {
      profile: function() {
        /*
         Profile should ONLY contain public information
       */
        return {
          email: this.email,
          showCompletedTasks: this.showCompletedTasks,
          id: this.id,
          createdAtDateTimeUtc: this.createdAtDateTimeUtc,
          updatedAtDateTimeUtc: this.updatedAtDateTimeUtc
        };
      },
      comparePassword: function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
          callback(err, isMatch);
        });
      },
      isMyPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      _validatePassword: function() {
        if (!validator.isLength(this.password, { min: 3, max: 30 })) {
          throw new Sequelize.ValidationError(
            "Password must be between three and thirty characters"
          );
        }
      }
    },
    hooks: {
      beforeCreate: function(user, option) {
        user._validatePassword();

        user.id = this._generateId();
        user.password = this.hashPassword(user.password);
        user.createdAtDateTimeUtc = Sequelize.fn("NOW");
        user.updatedAtDateTimeUtc = Sequelize.fn("NOW");
      },
      beforeUpdate: function(user, option) {
        if (user.changed("password")) {
          user._validatePassword(); // validate updated password
          user.password = this.hashPassword(user.password);
        }

        // TODO - be sure to "cascade" the "isDeleted" flag

        user.updatedAtDateTimeUtc = Sequelize.fn("NOW");
      },
      beforeBulkCreate: function(users, options) {
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
    tableName: "users"
  }
);

module.exports = User;
