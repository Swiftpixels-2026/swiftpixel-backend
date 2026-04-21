// ─── Shared wrapper ───────────────────────────────────────────────────────────
const wrap = (content) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
    <div style="background: #0f0f0f; padding: 24px 32px; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">
        ⚡ SwiftPixels Studio
      </h1>
    </div>
    <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
      ${content}
    </div>
    <p style="text-align:center; font-size: 12px; color: #999; margin-top: 16px;">
      swiftpixelsstudio.com
    </p>
  </div>
`;

const row = (label, value) =>
  value ? `<p style="margin: 8px 0;"><strong>${label}:</strong> ${value}</p>` : '';

const block = (label, value) =>
  value ? `
    <p style="margin: 12px 0;"><strong>${label}:</strong></p>
    <p style="background:#fff; padding:12px; border-left:4px solid #0f0f0f; border-radius:4px; margin:0 0 12px 0; white-space: pre-wrap;">${value}</p>
  ` : '';

// ─── Project Request ──────────────────────────────────────────────────────────
const projectRequestAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0f0f0f;">📋 New Project Request</h2>
  ${row('Name', data.name)}
  ${row('Email', data.email)}
  ${row('Company', data.company)}
  ${row('Phone', data.phone)}
  ${row('Project Type', data.projectType)}
  ${row('Budget', data.budget)}
  ${row('Timeline', data.timeline)}
  ${row('Target Audience', data.targetAudience)}
  ${block('Description', data.description)}
  ${block('Primary Goals', data.goals)}
`);

const projectRequestConfirmation = (data) => wrap(`
  <h2 style="margin-top:0;">Hi ${data.name} 👋</h2>
  <p>Thanks for reaching out! We've received your project request and will review it shortly.</p>
  <p>We'll get back to you within <strong>1–2 business days</strong>.</p>
  <hr style="border:none; border-top:1px solid #e5e5e5; margin: 24px 0;" />
  <p style="font-size: 14px; color: #666;">
    In the meantime, feel free to browse our portfolio at 
    <a href="https://swiftpixelsstudio.com" style="color:#0f0f0f;">swiftpixelsstudio.com</a>.
  </p>
`);

// ─── Call Request ─────────────────────────────────────────────────────────────
const callRequestAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0f0f0f;">📞 New Call Request</h2>
  ${row('Name', data.name)}
  ${row('Email', data.email)}
  ${row('Phone', data.phone)}
  ${row('Preferred Date', data.preferredDate)}
  ${row('Preferred Time', data.preferredTime)}
  ${row('Topic', data.topic)}
  ${block('Notes', data.notes)}
`);

const callRequestConfirmation = (data) => wrap(`
  <h2 style="margin-top:0;">Hi ${data.name} 👋</h2>
  <p>Your call request has been received! We'll confirm your slot shortly.</p>
  ${row('Requested Date', data.preferredDate)}
  ${row('Requested Time', data.preferredTime)}
  <p style="margin-top:16px; font-size:14px; color:#666;">
    We'll reach out to confirm and send a calendar invite.
  </p>
`);

// ─── Contact Form ─────────────────────────────────────────────────────────────
const contactAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0f0f0f;">✉️ New Contact Message</h2>
  ${row('Name', `${data.firstName} ${data.lastName}`)}
  ${row('Email', data.email)}
  ${row('Phone', data.phone)}
  ${row('Project Type', data.projectType)}
  ${block('Message', data.message)}
`);

const contactConfirmation = (data) => wrap(`
  <h2 style="margin-top:0;">Hi ${data.firstName} 👋</h2>
  <p>We got your message! We typically reply within <strong>24 hours</strong>.</p>
  <p style="font-size:14px; color:#666;">
    — The SwiftPixels Team
  </p>
`);

// ─── Subscriber ───────────────────────────────────────────────────────────────
const subscriberAdmin = (data) => wrap(`
  <h2 style="margin-top:0; color:#0f0f0f;">🔔 New Subscriber</h2>
  ${row('Email', data.email)}
  ${row('Name', data.name)}
`);

const subscriberConfirmation = () => wrap(`
  <h2 style="margin-top:0;">Welcome aboard! 🎉</h2>
  <p>You're now subscribed to SwiftPixels Studio updates.</p>
  <p>We'll keep you in the loop on new projects, case studies, and offers — no spam, ever.</p>
  <p style="margin-top:24px; font-size:14px; color:#666;">
    — The SwiftPixels Team
  </p>
`);

module.exports = {
  projectRequestAdmin,
  projectRequestConfirmation,
  callRequestAdmin,
  callRequestConfirmation,
  contactAdmin,
  contactConfirmation,
  subscriberAdmin,
  subscriberConfirmation,
};
