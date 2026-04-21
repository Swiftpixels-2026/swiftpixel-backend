const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const adminAuth = require('./middleware/adminAuth');

// ─── SwiftPixels Routes ───────────────────────────────────────────────────────
const spProjectRequests = require('./routes/projectRequests');
const spCallRequests    = require('./routes/callRequests');
const spContact         = require('./routes/contact');
const spSubscribers     = require('./routes/subscribers');

// ─── Growtiva Routes ──────────────────────────────────────────────────────────
const gSubscribers     = require('./routes/growtiva/subscribers');
const gAdvertRequests  = require('./routes/growtiva/advertRequests');
const gProfiles        = require('./routes/growtiva/profiles');
const gContactMessages = require('./routes/growtiva/contactMessages');

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'https://swiftpixelsstudio.com',
    'https://www.swiftpixelsstudio.com',
    'https://growtivaafrica.com',
    'https://www.growtivaafrica.com',
    'http://localhost:3000',
    'http://localhost:8080',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-secret'],
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '20kb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SwiftPixels + Growtiva API running 🚀' });
});

// ─── Admin Stats ──────────────────────────────────────────────────────────────
// SwiftPixels stats
app.get('/api/swiftpixels/admin/stats', adminAuth, async (req, res) => {
  try {
    const [ProjectRequest, CallRequest, Contact, Subscriber] = [
      require('./models/ProjectRequest'),
      require('./models/CallRequest'),
      require('./models/Contact'),
      require('./models/Subscriber'),
    ];
    const [projectRequests, callRequests, contacts, subscribers] = await Promise.all([
      ProjectRequest.countDocuments(),
      CallRequest.countDocuments(),
      Contact.countDocuments(),
      Subscriber.countDocuments({ active: true }),
    ]);
    res.json({ projectRequests, callRequests, contacts, subscribers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// Growtiva stats
app.get('/api/growtiva/admin/stats', adminAuth, async (req, res) => {
  try {
    const [Subscriber, AdvertRequest, Profile, ContactMessage] = [
      require('./models/growtiva/Subscriber'),
      require('./models/growtiva/AdvertRequest'),
      require('./models/growtiva/Profile'),
      require('./models/growtiva/ContactMessage'),
    ];
    const [subscribers, advertRequests, profiles, contactMessages] = await Promise.all([
      Subscriber.countDocuments({ active: true }),
      AdvertRequest.countDocuments(),
      Profile.countDocuments(),
      ContactMessage.countDocuments(),
    ]);
    res.json({ subscribers, advertRequests, profiles, contactMessages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// ─── SwiftPixels Routes ───────────────────────────────────────────────────────
app.use('/api/swiftpixels/project-requests', spProjectRequests);
app.use('/api/swiftpixels/call-requests',    spCallRequests);
app.use('/api/swiftpixels/contact',          spContact);
app.use('/api/swiftpixels/subscribers',      spSubscribers);

// ─── Growtiva Routes ──────────────────────────────────────────────────────────
app.use('/api/growtiva/subscribers',      gSubscribers);
app.use('/api/growtiva/advert-requests',  gAdvertRequests);
app.use('/api/growtiva/profiles',         gProfiles);
app.use('/api/growtiva/contact',          gContactMessages);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
