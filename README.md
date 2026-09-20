# CashFloor — Irregular Income & Cash Runway Calculator

> A mathematically conservative runway and income floor calculator for freelancers, solopreneurs, and independent studios. Calibrated to the **20th percentile cash floor** rather than misleading averages.

![CashFloor Preview](./public/og-image.png)

---

## 🎯 Key Features

- **20th Percentile (P20) Cash Floor**: Stress-test your solvency against the worst 1-in-5 month headwind instead of naive averages.
- **Capital Partitioning (5 Pillars)**: Automatically partition incoming payments into Tax Escrow (25%), 3.5-Month Operating Buffer, Living Stipend, Client Deficit reserve, and Discretionary Growth.
- **Stress-Testing Lab**: Simulate 6 real-world disasters in 1 click (Client Churn, 60-Day Invoice Delay, Tax Hike, Sudden Windfall, Retainer Slump, Double Disaster).
- **Tax Deadline Visualizer**: Never miss US Quarterly Estimated Tax payments (Q1 April 15, Q2 June 15, Q3 September 15, Q4 January 15).
- **Multi-Currency Engine**: Instant conversion across `$ USD`, `€ EUR`, `£ GBP`, `₹ INR`, `C$ CAD`, and `A$ AUD` using live open exchange rates.
- **Zero-Telemetry Privacy**: 100% private and client-side safe with zero server surveillance.
- **Cloud Sync & Supabase RLS**: Optional cloud persistence across devices with strict Row Level Security policies.
- **Double-Entry CSV Export & Pinterest Cards**: Download clean audit spreadsheets or export 1000x1500px visual Pinterest cards.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling & Aesthetics**: Google Stitch Design System (*Fraunces Serif, IBM Plex Sans, JetBrains Mono, `#F1F4F2` warm canvas, `#16232B` ink, `#2F6F62` calm teal*)
- **Database & Auth**: [Supabase](https://supabase.com) PostgreSQL with Row Level Security (RLS)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & Lucide Icons
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Math Engine) + [Playwright](https://playwright.dev/) (Multi-viewport E2E)
- **CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yml`)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/cashfloor.git
cd cashfloor
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase keys to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If omitted, CashFloor automatically runs in offline mode using `localStorage`)*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Verification

```bash
# Run Vitest unit tests (22/22 passing)
npm test

# Run Playwright responsive and layout audit tests
npx playwright test

# Next.js production build verification
npm run build
```

---

## 🗄️ Database Setup (Supabase)

To enable cloud backup across devices:
1. Open your Supabase project dashboard and navigate to the **SQL Editor**.
2. Run the migration script located at [`supabase/migrations/20260920000000_create_ledger_tables.sql`](./supabase/migrations/20260920000000_create_ledger_tables.sql).
3. The tables (`ledgers`, `ledger_records`, `ledger_assumptions`) and Row Level Security policies will be automatically provisioned.

---

## 🚢 Continuous Integration & Deployment (CI/CD)

The repository includes a GitHub Actions CI workflow in `.github/workflows/ci.yml` that automatically:
1. Validates code on every push or pull request to `main`.
2. Runs all 22 Vitest unit tests.
3. Executes a clean Next.js production build to prevent broken deployments.

---

## 📄 License
MIT © CashFloor
