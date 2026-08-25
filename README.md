# The Unofficial Fine Menu

> Crowdsourced, unofficial reported bribe estimates for common traffic, vehicle, government, tax, and municipal situations across India.

**Live:** [bribes-menu.vercel.app](https://bribes-menu.vercel.app)

---

## Overview

The Unofficial Fine Menu is an editorially curated, database-backed catalog of **43 documented situations** where citizens in India commonly encounter unofficial payments — from traffic violations to government certificate processing.

All figures are **crowdsourced anecdotal estimates**, not fixed rates, official challans, or legal counsel. The project aggregates publicly disclosed cases (ACB trap reports, CBI operations, Vigilance Directorate filings, and community accounts) to surface realistic street-level ranges.

## Features

- **43 offence/situation pages** across 8 categories (Traffic, Vehicles, Documents, Government, Tax, Business, Police, Municipal)
- **Database-backed estimates** — every amount is driven by a PostgreSQL database, not hardcoded static values
- **Research seed data** — initial estimates sourced from documented ACB/CBI/Vigilance trap cases
- **User report submission** — anonymous crowdsourced reports with PII detection, rate limiting, and spam protection
- **Moderation queue** — admin panel to approve or reject pending reports
- **Intelligent search** — token-based weighted search engine matching titles, aliases, keywords, and categories
- **Responsive design** — mobile, tablet, and desktop layouts
- **Loading state handling** — skeleton placeholders during data fetch, no static value flash
- **Security headers** — HSTS, X-Frame-Options DENY, X-Content-Type-Options, XSS Protection, Referrer Policy

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 |
| Database | PostgreSQL |
| ORM | Drizzle ORM 0.45 |
| Validation | Zod 4.4 |
| Deployment | Vercel |
| Package Manager | npm |

## Live Demo

**[bribes-menu.vercel.app](https://bribes-menu.vercel.app)**

Key pages:

- `/` — Homepage with category tabs and search
- `/browse` — Full directory with sorting and filtering
- `/offence/[slug]` — Individual offence detail with DB-backed estimates
- `/moderation` — Admin moderation queue (requires authentication)
- `/about` — Methodology and philosophy

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20)
- **PostgreSQL** database (local, Supabase, Neon, or any PostgreSQL provider)
- **npm** package manager

### Installation

```bash
git clone https://github.com/IndraJeet-09/bribes-menu.git
cd bribes-menu
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/fine_menu"
MODERATION_SECRET="change-this-to-a-secure-secret-token"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `MODERATION_SECRET` | Yes | Admin secret for accessing the moderation queue and approving/rejecting reports |

> **Never commit `.env` files to version control.** The `.gitignore` excludes `.env` and `.env*.local`.

### Database Setup

Push the schema to your database:

```bash
npm run db:push
```

### Seed Data

Seed categories and services (idempotent — safe to re-run):

```bash
npm run seed
```

Seed research observations and initial estimates (idempotent — safe to re-run):

```bash
npm run seed:research
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `categories` | 8 offence categories (Traffic, Vehicles, Documents, Government, Tax, Business, Police, Municipal) |
| `services` | 46 reportable services with slug, aliases, and active status |
| `reports` | Crowdsourced user reports with amount, location, payment mode, source attribution |
| `initial_estimates` | Pre-seeded estimates from documented ACB/CBI/Vigilance cases |

### Key Relationships

```
categories (1) ──< services (many)
services (1) ──< reports (many)
services (1) ──< initial_estimates (1)
```

### Report Statuses

| Status | Visibility |
|--------|-----------|
| `pending` | Only visible in moderation queue |
| `approved` | Visible in public API and offence pages |
| `rejected` | Not visible anywhere |

## Seed Data Scripts

### `npm run seed`

Seeds **8 categories** and **46 services** using fixed UUIDs and `onConflictDoUpdate` — idempotent and safe for production.

### `npm run seed:research`

Seeds research observations (ACB/CBI documented cases) and initial estimates. Uses `sourceRecordId` uniqueness checks — will not create duplicate reports.

### Unseeded Services

`missing-lost-document-complaint` is intentionally excluded from initial estimates due to insufficient documented evidence. It will show "Estimate pending" until crowdsourced data accumulates.

## API Documentation

### GET /api/reports

Returns aggregated service statistics for all active services.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `service` | string | Filter by service slug (e.g., `helmet-violation`) |
| `category` | string | Filter by category slug (e.g., `traffic`) |
| `city` | string | Filter reports by city |
| `state` | string | Filter reports by state |
| `limit` | number | Results per page (default: 20) |
| `cursor` | string | Pagination cursor |

**Response (all services):**

```json
{
  "success": true,
  "serviceStats": {
    "helmet-violation": {
      "name": "Helmet violation",
      "slug": "helmet-violation",
      "initialEstimate": { "amount": 500, "confidence": "high" },
      "reportStats": { "medianAmount": 500, "reportCount": 1 },
      "mergedStats": { "typical": 500, "min": 500, "max": 500 }
    }
  }
}
```

**Response (single service):**

```json
{
  "success": true,
  "reports": [...],
  "stats": { "typical": 500, "min": 500, "max": 500, "reportCount": 1 },
  "initialEstimate": { "amount": 500, "methodology": "single_observation" },
  "service": { "name": "Helmet violation", "slug": "helmet-violation" },
  "pagination": { "nextCursor": null }
}
```

### POST /api/reports

Submit an anonymous report.

**Request Body:**

```json
{
  "serviceId": "20000000-0000-4000-a000-000000000029",
  "amount": 1500,
  "paid": true,
  "paymentMode": "cash",
  "city": "Mumbai",
  "state": "Maharashtra",
  "incidentMonth": "2026-08",
  "description": "Optional description",
  "officialRole": "Optional official role"
}
```

**Response:**

```json
{ "success": true, "message": "Report submitted for review." }
```

**Rate Limiting:** 5 reports per 15 minutes per IP. Duplicate detection within 15-minute window.

### PATCH /api/reports

Moderator action to approve or reject a report. Requires `Authorization: Bearer <MODERATION_SECRET>` header.

**Request Body:**

```json
{
  "reportId": "uuid-of-report",
  "action": "approve" | "reject"
}
```

## Project Structure

```
bribes-menu/
├── app/
│   ├── about/              # Methodology & philosophy page
│   ├── api/reports/        # API route (GET, POST, PATCH)
│   ├── browse/             # Full directory browse page
│   ├── moderation/         # Admin moderation queue
│   ├── offence/[slug]/     # Individual offence detail (SSR)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── AmountVisualizer.tsx  # Amount range visualization
│   ├── CategoryTabs.tsx      # Category filter tabs
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Site footer
│   ├── OffenceCard.tsx       # Offence summary card
│   ├── OffenceGrid.tsx       # Grid layout for offence cards
│   ├── PopularSearches.tsx   # Popular search suggestions
│   ├── ReportCTA.tsx         # Report submission call-to-action
│   ├── ReportModal.tsx       # Report submission modal
│   ├── SearchBar.tsx         # Search input with dropdown
│   └── ShareButton.tsx       # Social share button
├── data/
│   ├── categories.ts         # Category seed data (8 categories)
│   ├── offences.ts           # Editorial offence content (43 offences)
│   ├── services.ts           # Service seed data (46 services)
│   └── research/
│       ├── normalized/
│       │   ├── seed-reports.ts    # Research observations
│       │   └── seed-estimates.ts  # Initial estimates
│       └── raw/                    # Raw research data
├── lib/
│   ├── aggregation/reports.ts    # Statistical calculations (median, min, max)
│   ├── data/
│   │   ├── enriched-offences.ts  # Client-side DB enrichment hook
│   │   ├── server-data.ts        # Server-side DB fetch for offence pages
│   │   └── service-mapping.ts    # Offence-to-service slug mapping
│   ├── db/
│   │   ├── index.ts              # Database connection (Drizzle + postgres.js)
│   │   ├── schema.ts             # Database schema (Drizzle)
│   │   └── seed.ts               # Category & service seed script
│   ├── search.ts                 # Token-based search engine
│   ├── security/
│   │   ├── authorization.ts      # Timing-safe secret verification
│   │   ├── detect-pii.ts         # PII and spam detection
│   │   ├── rate-limit.ts         # In-memory rate limiter
│   │   └── sanitize.ts           # Input sanitization
│   ├── utils.ts                  # Utility functions (formatINR, etc.)
│   └── validation/
│       ├── moderation.ts         # Moderation action schema
│       ├── query.ts              # API query parameter schema
│       └── report.ts             # Report submission schema
├── scripts/
│   ├── seed-research.ts          # Research data seed script
│   └── generate-report.ts        # Report generation utility
├── types/
│   ├── offence.ts                # Offence type definitions
│   └── report.ts                 # Report type definitions
├── drizzle/                      # Drizzle migration files
├── drizzle.config.ts             # Drizzle Kit configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
└── package.json                  # Dependencies and scripts
```

## Deployment (Vercel)

### Automatic Deployment

Push to `main` branch triggers automatic deployment on Vercel.

### Manual Deployment

```bash
npx vercel --prod
```

### Post-Deployment Setup

After first deployment, run seed commands against the production database:

```bash
# Via Vercel CLI or a one-off build step
npm run seed
npm run seed:research
```

Or add to your build script in `package.json` for fully self-contained deployment:

```json
"build": "npm run db:push && npm run seed && npm run seed:research && next build"
```

### Environment Variables on Vercel

Configure in Vercel Dashboard → Settings → Environment Variables:

| Variable | Environment | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Production | PostgreSQL connection string |
| `MODERATION_SECRET` | Production | Admin moderation secret |

## Security

- **No secrets in client code** — `DATABASE_URL` and `MODERATION_SECRET` are server-side only
- **Timing-safe comparison** — moderation secret verification uses `crypto.timingSafeEqual`
- **PII detection** — report descriptions are scanned for phone numbers, emails, Aadhaar, PAN, and bank details
- **Rate limiting** — 5 reports per 15 minutes per IP address
- **Duplicate detection** — identical reports within 15-minute window are rejected
- **Input sanitization** — all user-submitted strings are sanitized
- **Security headers** — HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, XSS Protection, Referrer Policy
- **No `.env` in git** — `.gitignore` excludes `.env` and `.env*.local`

## Data Sources

All research seed data is sourced from publicly available documents:

- Anti-Corruption Bureau (ACB) trap case reports
- Central Bureau of Investigation (CBI) press releases
- State Vigilance Directorate filings
- Times of India, Indian Express, and other news reports
- Community accounts and crowdsourced submissions

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:push` | Push schema to database |
| `npm run seed` | Seed categories and services |
| `npm run seed:research` | Seed research observations and estimates |

## License

This project is for educational and informational purposes only. All figures are crowdsourced unofficial estimates and should not be treated as legal advice.

## Disclaimer

Unofficial, crowdsourced, and compiled strictly for entertainment and informational context. These figures are not official government challans, statutory fees, or guarantees. Do not treat this as legal advice or instructions to offer or settle any bribe.

---

**Built with data from Bhopal, Delhi, Mumbai, Bengaluru, and cities across India.**
