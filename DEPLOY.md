# Deploying the Pet Hospital Portal

Deploying fixes the **mobile "blank page"** problem: locally the emailed links point to
`http://localhost`, which on a phone means the phone itself. Once deployed, links use a
public URL that works everywhere.

You deploy two things:
1. **Backend** → Render (web service)
2. **Frontend** → any static host (Render Static Site, Netlify, or Vercel)

---

## 1. Backend on Render

### Option A — Blueprint (uses `render.yaml`)
1. Push this repo to GitHub.
2. Render → **New +** → **Blueprint** → pick the repo. It reads [`render.yaml`](render.yaml).
3. Fill in the `sync: false` env vars (see the list below) → **Apply**.

### Option B — Manual web service
1. Render → **New +** → **Web Service** → connect the repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. **Health Check Path:** `/`
6. Add the environment variables below → **Create Web Service**.

### Backend env vars (Render → Environment)
| Key | Value |
|-----|-------|
| `NODE_VERSION` | `22` |
| `JWT_SECRET` | a long random string |
| `FRONTEND_URL` | your deployed frontend URL (comma-separate multiple, e.g. `https://yourapp.netlify.app,http://localhost:5173`) |
| `SUPABASE_URL` | your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | your service-role key |
| `GMAIL_USER` | your Gmail address |
| `GMAIL_APP_PASSWORD` | 16-char app password |
| `MAIL_FROM` | `Pet Hospital Portal <youraddress@gmail.com>` |
| `STRIPE_SECRET_KEY` | `sk_test_...` (or live) |
| `STRIPE_WEBHOOK_SECRET` | from the deployed webhook (see below) |
| `DEMO_PRICE_AMOUNT` | `4900` |
| `DEMO_PRICE_CURRENCY` | `usd` |

Your backend will be at something like `https://pet-hospital-api.onrender.com`.

---

## 2. Frontend (Render Static / Netlify / Vercel)

- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish/Output Directory:** `dist`
- **SPA rewrite:** redirect all routes to `/index.html` (Netlify: add `frontend/public/_redirects` with `/*  /index.html  200`; Vercel/Render have an SPA/redirect setting). This is required so `/schedule/:token`, `/feedback/:token`, `/register/:token` work on refresh.

### Frontend env vars
| Key | Value |
|-----|-------|
| `VITE_API_URL` | your deployed backend URL, e.g. `https://pet-hospital-api.onrender.com` |
| `VITE_CALCOM_LINK` | your Cal.com event link, e.g. `yourname/30min` |

---

## 3. After both are live
1. Set the backend's `FRONTEND_URL` to the real frontend URL (redeploy).
2. **Stripe webhook (production):** Dashboard → Developers → Webhooks → **Add endpoint** →
   `https://pet-hospital-api.onrender.com/api/payments/webhook` → event `checkout.session.completed`
   → copy the `whsec_...` into the backend `STRIPE_WEBHOOK_SECRET` and redeploy.
3. Test a booking from your **phone** — the emailed scheduling link now opens the public URL. ✅

---

## Important notes
- **`backend/data/db.json` is ephemeral on Render.** The existing HMS auth/users live in this
  JSON file; on Render's free tier the filesystem resets on every deploy/restart, so admin
  accounts created by approving registrations **won't survive a redeploy**. The Supabase funnel
  data (bookings, registrations, payments) *is* persistent. For production, migrate the HMS
  users/hospitals into Supabase too (ask me and I'll do it).
- **Free Render services sleep** after inactivity; the first request after idle takes ~30s to wake.
- **Cal.com + Google Meet:** in your Cal.com event type, set **Location → Google Meet** so the
  booking creates a real Google Meet link (requires connecting your Google Calendar in Cal.com).
