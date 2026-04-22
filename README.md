# Software Quality Intelligence Platform

**Predictive code quality analytics for teams that ship.**

Stop guessing about code health. Get a clear quality score, understand the risk, and know exactly what to fix — in seconds.

[Live Demo](https://qualioro.vercel.app/) · [Get Started](#getting-started)

---

## Why This Matters

Shipping under pressure is normal. Shipping blind isn't.

Without visibility into code health, small issues compound into technical debt, unpredictable releases, and burnt-out teams. This platform gives you **clarity** — input your metrics, get an instant quality score, and know what to prioritize.

---

## Features

| Feature | What You Get |
|---------|--------------|
| **Quality Scoring** | AI-based score (0-100) with risk classification. Know your code health instantly. |
| **Explainable AI** | See exactly how each metric contributes. No black boxes. |
| **What-If Simulator** | Adjust inputs and see impact in real-time. Find high-leverage improvements before writing code. |
| **Smart Recommendations** | Prioritized actions based on your data. Not generic advice. |
| **Analytics Dashboard** | Track trends, compare runs, visualize score distribution. |
| **Export & Share** | CSV exports, shareable links, PDF-ready reports. |

---

## How It Works

The scoring engine evaluates four core factors:

| Factor | Measures | Ideal State |
|--------|----------|-------------|
| **Bug Density** | Bugs per commit | Lower is better |
| **Complexity** | Cyclomatic complexity | Manageable (< 10) |
| **Test Coverage** | Code covered by tests | Higher is better |
| **Dev Productivity** | Commits per developer | Balanced output |

Each factor is weighted based on empirical research. The model outputs:

- **Quality Score** (0-100) — Overall code health
- **Risk Level** — Low / Medium / High release readiness
- **Confidence** — Prediction reliability given your data
- **Recommendations** — Specific actions ranked by impact

Toggle **Advanced Mode** to inspect the exact formulas.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Next.js)                     │
├─────────────────────────────────────────────────────────┤
│  Input Panel  →  Prediction Engine  →  Results Display  │
│                        ↓                                │
│              ┌─────────────────────┐                    │
│              │   Scoring Model     │                    │
│              │  (Weighted Formula) │                    │
│              └─────────────────────┘                    │
│                        ↓                                │
│    ┌────────────┬──────────────┬───────────────┐        │
│    │ Risk Level │ Confidence   │ Recommendations│       │
│    └────────────┴──────────────┴───────────────┘        │
└─────────────────────────────────────────────────────────┘
```

**Data flow**: Metrics enter via the Input Panel → the Prediction Engine computes a weighted quality score → Results render with risk classification, confidence indicators, and actionable recommendations.

All logic runs client-side. No data leaves your browser.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Charts | Recharts |

---

## Project Structure

```
app/           → Routes and pages
components/    → Reusable UI components
lib/           → Prediction engine, utilities, types
public/        → Static assets
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Fadydesoky/Software-Quality-Intelligence-Platform.git

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [localhost:3000](http://localhost:3000) to start analyzing.

---

## Use Cases

- **Pre-release checks** — Know if you're ready to ship
- **Debt prioritization** — Quantify what to fix first
- **Team health** — Spot trends before they become problems
- **Code reviews** — Data-backed quality conversations
- **Sprint planning** — Factor quality into velocity

---

## Roadmap

- [ ] GitHub/GitLab integration for automated metrics
- [ ] Team dashboards with role-based access
- [ ] CI/CD pipeline data ingestion
- [ ] Historical trend alerts
- [ ] Public API for custom integrations

---

## Author

Built by [**Fady Desoky**](https://github.com/Fadydesoky)

---

<p align="center">
  <strong>Ship better code, faster.</strong>
</p>
