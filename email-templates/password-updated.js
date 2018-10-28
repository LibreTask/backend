/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const constants = require("../common/constants");
const ResponsiveTemplateWithoutButton = require("./inline-templates/responsive-template-without-button");

function htmlBody() {
  const message = `Your <b style='color:green'>${constants.PROJECT_NAME}</b> account
  password has been reset.

  <br><br>
  If you did not make this request, please email us at
  <a href='mailto:${constants.SUPPORT_EMAIL}
  ?Subject=Did%20not%20request%20password%20reset'
   target='_top'>${constants.SUPPORT_EMAIL}</a>.`;

  return ResponsiveTemplateWithoutButton({
    message: message,
    title: "Password Updated"
  });
}

function textBody() {
  return (
    "Your " +
    constants.PROJECT_NAME +
    " account password has been" +
    " reset." +
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
  return "Password Reset Confirmation";
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
