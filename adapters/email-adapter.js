/*
* @link https://www.algernon.io/
* @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
*/

const nodemailer = require("nodemailer");
const ses = require("nodemailer-ses-transport");
const transporter = nodemailer.createTransport(
  ses({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
);

/*
  Place a wrapper on email sending, so that it can
  easily be replaced if necessary.
*/
exports.sendMail = mailOptions => {
  if (process.env.NODE_ENV === "test") {
    return new Promise((resolve, reject) => {
      return resolve("No emails are sent during test");
    });
  } else {
    return transporter.sendMail(mailOptions);
  }
};
