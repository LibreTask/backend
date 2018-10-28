/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const constants = require("../common/constants");
const ResponsiveTemplateWithoutButton = require("./inline-templates/responsive-template-without-button");

function htmlBody() {
  return ResponsiveTemplateWithoutButton({
    message: "Your LibreTask account has been successfully deleted.",
    title: "LibreTask Account Deletion"
  });
}

function textBody() {
  return (
    "Your " +
    constants.PROJECT_NAME +
    " account has been" +
    " successfully deleted." +
    "\n\nIf you did not make this request, please email us at " +
    constants.SUPPORT_EMAIL +
    "." +
    "\n\nSincerely," +
    "\n" +
    constants.PROJECT_NAME +
    " team"
  );
}

function subject() {
  return constants.PROJECT_NAME + " Account Deletion";
}

module.exports = options => {
  return {
    to: options.toAddress,
    from: options.fromAddress,
    subject: subject(),
    text: textBody(),
    html: htmlBody()
  };
};
