/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

// # Base Model
// This is the model from which all other models extend.

const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: "postgres",

    logging: false,

    pool: {
      max: 5,
      min: 2,
      idle: 10000
    }
  }
);

module.exports = sequelize;
