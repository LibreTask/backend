/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const winston = require("winston");

function timestamp() {
  return new Date(Date.now()).toISOString();
}

function formatter(options) {
  // Return string will be passed to logger.
  return (
    options.timestamp() +
    " [" +
    options.level.toUpperCase() +
    "] " +
    (options.message ? options.message : "") +
    (options.meta && Object.keys(options.meta).length
      ? "\n\t" + JSON.stringify(options.meta)
      : "")
  );
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      name: "info-file",
      level: "info",
      filename: "/var/log/app/info.log",
      timestamp: timestamp,
      formatter: formatter,
      json: false
    }),
    new winston.transports.Console({
      name: "info-console",
      level: "info",
      timestamp: timestamp,
      formatter: formatter
    })
  ]
});
