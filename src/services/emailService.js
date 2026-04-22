const { Resend } = require('resend');
const {
  RESEND_API_KEY,
  EMAIL_FROM,
  EMAIL_TO,
  GROWTIVA_RESEND_API_KEY,
  GROWTIVA_EMAIL_FROM,
  GROWTIVA_EMAIL_TO,
} = require('../config/env');

// Two separate Resend clients — one per brand
const swiftpixelsResend = new Resend(RESEND_API_KEY);
const groootivaResend   = new Resend(GROWTIVA_RESEND_API_KEY || RESEND_API_KEY);

/**
 * Send a notification email to an admin inbox.
 * @param {string} subject
 * @param {string} html
 * @param {string} [to]        - Override recipient (Growtiva passes GROWTIVA_EMAIL_TO)
 * @param {'swiftpixels'|'growtiva'} [brand] - Which Resend client + FROM to use
 */
async function sendAdminNotification(subject, html, to, brand = 'swiftpixels') {
  const client = brand === 'growtiva' ? groootivaResend : swiftpixelsResend;
  const from   = brand === 'growtiva' ? GROWTIVA_EMAIL_FROM : EMAIL_FROM;
  const toAddr = to || (brand === 'growtiva' ? GROWTIVA_EMAIL_TO : EMAIL_TO);

  return client.emails.send({ from, to: toAddr, subject, html });
}

/**
 * Send a confirmation email to the form submitter.
 * @param {string} toEmail
 * @param {string} subject
 * @param {string} html
 * @param {'swiftpixels'|'growtiva'} [brand]
 */
async function sendConfirmation(toEmail, subject, html, brand = 'swiftpixels') {
  const client = brand === 'growtiva' ? groootivaResend : swiftpixelsResend;
  const from   = brand === 'growtiva' ? GROWTIVA_EMAIL_FROM : EMAIL_FROM;

  return client.emails.send({ from, to: toEmail, subject, html });
}

module.exports = { sendAdminNotification, sendConfirmation };
