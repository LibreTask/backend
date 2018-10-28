/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const constants = require("../common/constants");
const ResponsiveTemplateWithButton = require("./inline-templates/responsive-template-with-button");

function htmlBody(confToken, includeWelcomeMessage, includeWarningMessage) {
  var confUrl = constants.SITE_URL + "/confirm-email/" + confToken;

  var welcomeMessage = "";
  var warningMessage = "";

  if (includeWelcomeMessage) {
    welcomeMessage = "Welcome to LibreTask!";
  }

  if (includeWarningMessage) {
    warningMessage = `
    <br><br>
    If you did not make this request, please email us at
    <a href='mailto:${constants.SUPPORT_EMAIL}
    ?Subject=Did%20not%20request%20password%20reset'
     target='_top'>${constants.SUPPORT_EMAIL}</a>.
    `;
  }

  return ResponsiveTemplateWithButton({
    message: `
      ${welcomeMessage}
      Please click the button to confirm your email address.
      ${warningMessage}
     `,
    buttonLink: confUrl,
    buttonText: "Confirm Email Address",
    title: "Welcome"
  });
}

function textBody(confToken, includeWelcomeMessage, includeWarningMessage) {
  var confUrl = constants.SITE_URL + "/confirm-email/" + confToken;

  var welcomeMessage = "";
  var warningMessage = "";

  if (includeWelcomeMessage) {
    welcomeMessage = "Welcome to" + constants.PROJECT_NAME + "! ";
  }

  if (includeWarningMessage) {
    warningMessage =
      "\n\nIf you did not make this request, please email us at " +
      constants.GENERAL_EMAIL +
      ".";
  }

  return (
    welcomeMessage +
    "Please click on the link to complete the registration process: " +
    confUrl +
    warningMessage +
    "\n\nSincerely, " +
    "\n" +
    constants.PROJECT_NAME +
    " team" +
    "\n\nHaving trouble? Feel free to contact " +
    " " +
    constants.GENERAL_EMAIL +
    "."
  );
}

function subject() {
  return constants.PROJECT_NAME + " Account Confirmation";
}

module.exports = options => {
  return {
    to: options.toAddress,
    from: options.fromAddress,
    subject: subject(),
    text: textBody(
      options.confToken,
      options.includeWelcomeMessage,
      options.includeWarningMessage
    ),
    html: htmlBody(
      options.confToken,
      options.includeWelcomeMessage,
      options.includeWarningMessage
    )
  };
};
