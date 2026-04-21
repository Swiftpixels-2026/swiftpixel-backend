<<<<<<< HEAD
# SwiftPixels Studio — Backend API

Express.js + MongoDB backend for form submissions, Resend emails, and full admin CRUD.

---

## Project Structure

```
swiftpixels-backend/
├── server.js
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── env.js                 # Environment loader & validation
│   ├── middleware/
│   │   └── adminAuth.js           # x-admin-secret header guard
│   ├── models/
│   │   ├── ProjectRequest.js
│   │   ├── CallRequest.js
│   │   ├── Contact.js
│   │   └── Subscriber.js
│   ├── routes/
│   │   ├── projectRequests.js
│   │   ├── callRequests.js
│   │   ├── contact.js
│   │   └── subscribers.js
│   └── services/
│       ├── emailService.js
│       └── emailTemplates.js
├── frontend-api/
│   ├── forms.ts      → copy to src/api/forms.ts in your frontend
│   └── admin.ts      → copy to src/api/admin.ts in your frontend
├── .env.example
└── package.json
```

---

## Setup

### 1. Install
```bash
npm install
```

### 2. Create .env
```bash
cp .env.example .env
# Fill in all values — see comments inside .env.example
```

### 3. MongoDB Atlas (free tier)
1. Create account at https://cloud.mongodb.com
2. Create a free M0 cluster
3. Database Access → Add user with password
4. Network Access → Add IP 0.0.0.0/0
5. Connect → Drivers → copy URI into MONGODB_URI in .env

### 4. Resend
1. Sign up at https://resend.com
2. Domains → Add swiftpixelsstudio.com → add DNS records in Hostinger
3. API Keys → create one → paste into RESEND_API_KEY in .env

### 5. Admin Secret
Generate at https://generate-secret.vercel.app/32 → paste into ADMIN_SECRET

### 6. Run locally
```bash
npm run dev
```

### 7. Deploy on Hostinger VPS
```bash
npm install --omit=dev
pm2 start server.js --name swiftpixels-api
pm2 save && pm2 startup
```

---

## Frontend Setup

Copy files and add to your frontend .env:
```
VITE_API_URL=https://api.swiftpixelsstudio.com
VITE_ADMIN_SECRET=same-value-as-backend-ADMIN_SECRET
```

---

## API Reference

### Public (no auth)
| Method | Path | Body required |
|--------|------|--------------|
| POST | /api/project-requests | name, email, projectType, budget |
| POST | /api/call-requests | name, email, preferred_date, preferred_time |
| POST | /api/contact | firstName, lastName, email, message |
| POST | /api/subscribers | email |

### Admin (header: x-admin-secret: YOUR_SECRET)
| Method | Path | Notes |
|--------|------|-------|
| GET | /api/admin/stats | counts for all collections |
| GET | /api/project-requests | ?status= ?page= ?limit= |
| GET | /api/project-requests/:id | |
| PATCH | /api/project-requests/:id | status, notes |
| DELETE | /api/project-requests/:id | |
| GET | /api/call-requests | ?status= |
| GET | /api/call-requests/:id | |
| PATCH | /api/call-requests/:id | status, adminNotes, preferredDate, preferredTime |
| DELETE | /api/call-requests/:id | |
| GET | /api/contact | ?status= |
| GET | /api/contact/:id | |
| PATCH | /api/contact/:id | status, adminNotes |
| DELETE | /api/contact/:id | |
| GET | /api/subscribers | ?active=true/false |
| GET | /api/subscribers/:id | |
| PATCH | /api/subscribers/:id | active, name |
| DELETE | /api/subscribers/:id | |

### Status enums
- ProjectRequest: new · reviewing · quoted · accepted · rejected
- CallRequest: new · confirmed · completed · cancelled
- Contact: new · read · replied · archived
- Subscriber: active (boolean)
=======
# swiftpixel-backend
>>>>>>> 7199069600e491756a31d212fcd6fb1af77baf02
