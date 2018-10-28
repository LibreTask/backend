/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const constants = require("../common/constants");
const ResponsiveTemplateWithoutButton = require("./inline-templates/responsive-template-without-button");

function htmlBody(userName) {
  return ResponsiveTemplateWithoutButton({
    message: "Your LibreTask registration is complete.",
    title: "Registration Complete"
  });
}

function textBody() {
  return (
    "Your " +
    constants.PROJECT_NAME +
    " registration is complete." +
    "\n\nOne last thing. We're a small team and try hard to make " +
    constants.PROJECT_NAME +
    " great. When you're ready, please email " +
    "us to share your thoughts: " +
    constants.GENERAL_EMAIL +
    "." +
    "We listen and will respond, promise!" +
    "\n\nSincerely, " +
    "\n" +
    constants.PROJECT_NAME +
    " team"
  );
}

function subject() {
  return "Account Creation Confirmation";
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
