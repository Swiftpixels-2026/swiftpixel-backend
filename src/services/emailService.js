const { Resend } = require("resend");
const { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO } = require("../config/env");

const resend = new Resend(RESEND_API_KEY);

/**
 * Send a notification email to yourself when a form is submitted.
 * @param {string} subject  - Email subject
 * @param {string} html     - Email HTML body
 */
async function sendAdminNotification(subject, html) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject,
    html,
  });
}

/**
 * Send a confirmation email to the person who submitted the form.
 * @param {string} toEmail  - Recipient email address
 * @param {string} subject  - Email subject
 * @param {string} html     - Email HTML body
 */
async function sendConfirmation(toEmail, subject, html) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to: toEmail,
    subject,
    html,
  });
}

module.exports = { sendAdminNotification, sendConfirmation };
