const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const adminAuth = require('./middleware/adminAuth');

const projectRequestRoutes = require('./routes/projectRequests');
const callRequestRoutes = require('./routes/callRequests');
const contactRoutes = require('./routes/contact');
const subscriberRoutes = require('./routes/subscribers');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'https://swiftpixelsstudio.com',
    'https://www.swiftpixelsstudio.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-secret'],
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SwiftPixels API is running 🚀' });
});

// ─── Admin Stats ──────────────────────────────────────────────────────────────
app.get('/api/admin/stats', adminAuth, async (req, res) => {
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

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/project-requests', projectRequestRoutes);
app.use('/api/call-requests', callRequestRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscribers', subscriberRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
