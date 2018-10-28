/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const Sequelize = require("sequelize");
const model = require("./base");

var Release = model.define(
  "release",
  {
    platform: {
      type: Sequelize.ENUM,
      values: [
        "desktop-mac",
        "desktop-windows",
        "desktop-linux",
        "mobile-android",
        "mobile-ios"
      ],
      primaryKey: true,
      field: "platform"
    },
    currentVersion: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: "current_version"
    },
    downloadLink: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: "download_link"
    },
    releaseDateTimeUtc: {
      type: Sequelize.DATE,
      defaultValue: null,
      field: "release_date_time_utc",
      get: function() {
        // values are stored in UTC; make that explicit before returning
        let releaseDateTimeUtc = this.getDataValue("releaseDateTimeUtc");
        return releaseDateTimeUtc
          ? new Date(releaseDateTimeUtc + "Z").getTime()
          : null;
      }
    }
  },
  {
    instanceMethods: {
      publicAttributes: function() {
        return {
          platform: this.platform,
          currentVersion: this.currentVersion,
          downloadLink: this.downloadLink,
          releaseDateTimeUtc: this.releaseDateTimeUtc
        };
      }
    },
    timestamps: false,
    freezeTableName: true,
    tableName: "releases"
  }
);

module.exports = Release;
