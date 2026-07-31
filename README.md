# GymFlow - Gym Management SaaS

A complete, production-quality gym management platform. Gym owners get one
beautiful dashboard to run members, class scheduling, attendance, trainers,
billing and analytics - plus a premium marketing site that sells the product.

> **Portfolio project** by [Yagnesh Patel](https://yagneshpateldev.com) -
> a full-stack proof-of-work demonstrating end-to-end product engineering.

**Live demo:** [getgymflow.vercel.app](https://getgymflow.vercel.app/) · **One-click demo login:**
`demo@gymflow.app` / `demo1234` (or hit **View demo dashboard** on the login page).

---

## Highlights

- **Real authentication** - signup, login and sessions (JWT in httpOnly cookies,
  bcrypt-hashed passwords) plus a frictionless one-click demo.
- **Analytics dashboard** - KPI tiles and charts (revenue, attendance trends,
  member status) computed live from the database, with a colourblind-safe palette.
- **Members** - searchable/filterable table, full CRUD, rich profile pages, and
  cash/UPI/card/bank payment tracking (no gateway required).
- **Class scheduler** - an interactive weekly calendar with overlap-aware layout,
  a live "now" indicator, filters and click-to-edit.
- **Attendance** - fast front-desk check-in (QR / app / kiosk / manual) with a
  live activity feed and foot-traffic trends.
- **Trainers & Plans** - manage your coaching team and the membership tiers you
  offer, with per-item revenue and member counts.
- **Cohesive design system** - token-driven Tailwind v4 theme, reusable
  primitives, fully responsive, consistent across every screen.
- **Realistic seed data** - 140 members, 8 trainers, 5 plans, a full weekly
  schedule and 90 days of attendance, so nothing ever looks empty.

## Tech stack

| Layer | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first tokens) |
| Backend | Next.js Route Handlers |
| Database | MongoDB (Mongoose) on Atlas |
| Auth | Custom JWT sessions (`jose`) + `bcryptjs` |
| Charts | Recharts |
| Validation | Zod |

## Architecture

Single repo, App Router **route groups**:

```
src/app/
  (marketing)/   -> public landing site (own layout: nav + footer)
  (auth)/        -> login & signup (split-screen layout)
  (dashboard)/   -> the app (sidebar + topbar layout, auth-guarded)
  api/           -> route handlers (auth, members, classes, attendance, ...)
src/components/  -> ui primitives + per-feature components
src/lib/         -> db, auth, data-access, validation, utils
src/models/      -> Mongoose models
```

## Getting started

```bash
# 1. Install
npm install

# 2. Configure env - copy and fill in
cp .env.example .env.local
#   MONGODB_URI   -> your MongoDB Atlas connection string (with a /gymflow db)
#   JWT_SECRET    -> any long random string
#   DEMO_EMAIL / DEMO_PASSWORD -> demo account credentials
#   SEED_SECRET   -> protects the seed endpoint

# 3. Run
npm run dev

# 4. Seed the demo gym (first run only)
curl -X POST "http://localhost:3000/api/seed?secret=YOUR_SEED_SECRET"
```

Open [http://localhost:3000](http://localhost:3000) and click **View demo dashboard**.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |

## Notes

- New sign-ups are seeded with their own starter dataset, so a fresh account is
  never a blank screen.
- All data is scoped per owner - the demo account and any real account see only
  their own gym.
