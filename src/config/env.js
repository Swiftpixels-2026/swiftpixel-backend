require("dotenv").config();

const required = ["RESEND_API_KEY", "MONGODB_URI"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // ─── SwiftPixels email config ──────────────────────────────────────────────
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || "hello@swiftpixelsstudio.com",
  EMAIL_TO: process.env.EMAIL_TO || "swiftpixels.tech@gmail.com",

  // ─── Growtiva email config ─────────────────────────────────────────────────
  GROWTIVA_RESEND_API_KEY: process.env.GROWTIVA_RESEND_API_KEY,
  GROWTIVA_EMAIL_FROM:
    process.env.GROWTIVA_EMAIL_FROM || "hello@growtivaafrica.com",
  GROWTIVA_EMAIL_TO:
    process.env.GROWTIVA_EMAIL_TO || "growtivaafrica@gmail.com",

  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  ADMIN_SECRET: process.env.ADMIN_SECRET || "swiftpixels@2026",
};
