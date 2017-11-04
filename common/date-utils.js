/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const DateUtils = {
  yesterday: function() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  },
  tomorrow: function() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  },
  now: function() {
    return new Date();
  }
};

module.exports = DateUtils;
