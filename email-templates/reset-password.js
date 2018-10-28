/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const constants = require("../common/constants");
const ResponsiveTemplateWithButton = require("./inline-templates/responsive-template-with-button");

function htmlBody(resetToken) {
  var resetUrl = constants.SITE_URL + "/confirm-password/" + resetToken;

  const message = `We received a password reset request for your LibreTask account. You have 24 hours to click the button and reset your
  password.<br><br>If you did not make this request, please notify us at
  <a href='mailto:${constants.SUPPORT_EMAIL}
  ?Subject=Did%20not%20request%20password%20reset'
  target='_top'>${constants.SUPPORT_EMAIL}</a>. However, if you did
  make this request but no longer wish to change
  your password, just ignore this email.
  `;

  return ResponsiveTemplateWithButton({
    message: message,
    buttonLink: resetUrl,
    buttonText: "Reset Password",
    title: "Reset Password"
  });
}

function textBody(resetToken) {
  var resetUrl = constants.SITE_URL + "/confirm-password/" + resetToken;

  return (
    "We received a password reset request for your LibreTask account." +
    "\n\nYou have 24 hours to click on the link and reset your password: " +
    resetUrl +
    +"\n\nIf you did not make this request, please email us at" +
    " " +
    constants.SUPPORT_EMAIL +
    "." +
    "However, if you did make this request but no longer wish to change" +
    " your password, just ignore this email" +
    "\n\nSincerely," +
    "\n" +
    constants.SUPPORT_EMAIL +
    " team"
  );
}

function subject() {
  return constants.PROJECT_NAME + " Password Reset";
}

module.exports = options => {
  return {
    to: options.toAddress,
    from: options.fromAddress,
    subject: subject(),
    text: textBody(options.resetToken),
    html: htmlBody(options.resetToken)
  };
};
