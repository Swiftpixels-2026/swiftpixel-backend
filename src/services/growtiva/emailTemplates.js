// ─── Shared wrapper ───────────────────────────────────────────────────────────
const wrap = (content) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
    <div style="background: #0a2540; padding: 24px 32px; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">
        📈 Growtiva
      </h1>
    </div>
    <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
      ${content}
    </div>
    <p style="text-align:center; font-size: 12px; color: #999; margin-top: 16px;">
      growtiva.com
    </p>
  </div>
`;

const row = (label, value) =>
  value !== undefined && value !== null && value !== ''
    ? `<p style="margin: 8px 0;"><strong>${label}:</strong> ${value}</p>`
    : '';

const block = (label, value) =>
  value
    ? `<p style="margin: 12px 0;"><strong>${label}:</strong></p>
       <p style="background:#fff; padding:12px; border-left:4px solid #0a2540; border-radius:4px; margin:0 0 12px 0; white-space:pre-wrap;">${value}</p>`
    : '';

// ─── Advert Request ───────────────────────────────────────────────────────────
const advertRequestAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0a2540;">📣 New Advert Request</h2>
  ${row('Full Name', data.fullName)}
  ${row('Email', data.email)}
  ${row('Business Name', data.businessName)}
  ${row('Ad Type', data.adType)}
  ${row('Budget', data.budget)}
  ${row('Wants Hard Copy', data.wantHardCopy ? 'Yes' : 'No')}
  ${block('Additional Details', data.additionalDetails)}
`);

const advertRequestConfirmation = (data) => wrap(`
  <h2 style="margin-top:0;">Hi ${data.fullName} 👋</h2>
  <p>We've received your advert request for <strong>${data.businessName}</strong>.</p>
  <p>Our team will review your submission and get back to you within <strong>1–2 business days</strong> with a proposal.</p>
  <hr style="border:none; border-top:1px solid #e5e5e5; margin: 24px 0;" />
  <p style="font-size:14px; color:#666;">
    In the meantime, visit us at <a href="https://growtiva.com" style="color:#0a2540;">growtiva.com</a>.
  </p>
`);

// ─── Contact Message ──────────────────────────────────────────────────────────
const contactAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0a2540;">✉️ New Contact Message</h2>
  ${row('Name', data.name)}
  ${row('Email', data.email)}
  ${row('Subject', data.subject)}
  ${block('Message', data.message)}
`);

const contactConfirmation = (data) => wrap(`
  <h2 style="margin-top:0;">Hi ${data.name} 👋</h2>
  <p>We got your message and will get back to you within <strong>24 hours</strong>.</p>
  <p style="font-size:14px; color:#666;">— The Growtiva Team</p>
`);

// ─── Profile Submission ───────────────────────────────────────────────────────
const profileAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0a2540;">👤 New Profile Submission</h2>
  ${row('Full Name', data.fullName)}
  ${row('Email', data.email)}
  ${row('Phone', data.phone)}
`);

const profileConfirmation = (data) => wrap(`
  <h2 style="margin-top:0;">Hi ${data.fullName} 👋</h2>
  <p>Your profile has been received. We'll be in touch shortly.</p>
  <p style="font-size:14px; color:#666;">— The Growtiva Team</p>
`);

// ─── Subscriber ───────────────────────────────────────────────────────────────
const subscriberAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0a2540;">🔔 New Growtiva Subscriber</h2>
  ${row('Email', data.email)}
  ${row('Name', data.name)}
`);

const subscriberConfirmation = () => wrap(`
  <h2 style="margin-top:0;">Welcome to Growtiva! 🎉</h2>
  <p>You're now subscribed to Growtiva updates — industry insights, offers, and more.</p>
  <p>No spam, ever.</p>
  <p style="margin-top:24px; font-size:14px; color:#666;">— The Growtiva Team</p>
`);

module.exports = {
  advertRequestAdmin,
  advertRequestConfirmation,
  contactAdmin,
  contactConfirmation,
  profileAdmin,
  profileConfirmation,
  subscriberAdmin,
  subscriberConfirmation,
};
