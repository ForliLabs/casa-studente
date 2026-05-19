---
slug: /intro
title: Introduction
sidebar_position: 1
description: What CasaStudente is, who it’s for, and the problem it solves.
---

# CasaStudente

> **The student housing marketplace that makes renting in Forlì transparent, fast, and safe — for students and landlords alike.**

CasaStudente is a full-stack, open-source rental platform built for the University of Bologna's Forlì campus. It connects **fuorisede** students searching for accommodation with **verified landlords**, and it handles everything in between: search, messaging, payments, lease contracts, roommate matching, reviews, and disputes.

It is designed to be deployed and operated by a single team, but its codebase is open so universities, civic groups and other student cities can fork and adapt it.

## Why it exists

Forlì is the canary in Italy's student-housing coalmine:

- **2,426 new students enroll yearly** at the Forlì campus (+3.2% YoY)
- **78% are fuorisede** — they need housing they have never seen
- A new 45-bed studentato was **fully booked in 20 days** with 20+ inquiries/day
- University-managed beds for **all of Romagna**: only **2,438** for 6,000+ campus students
- Rent: **€750/month for 17 sqm**

Meanwhile thousands of apartments sit empty because Italian landlords fear non-paying tenants and have no easy way to reach trustworthy renters. CasaStudente is the bridge.

## What it does, concretely

CasaStudente ships **70+ production features** across 24 Prisma models, including:

- **Verified listings** with photo verification, 360° tours, and zone-aware filters
- **University-verified accounts** with bcrypt auth, CSRF, role-based access
- **Stripe Connect marketplace** — rent, deposits, refunds, platform fees, subscriptions
- **AI search and chat** powered by OpenAI (with graceful template fallbacks)
- **Roommate matching** using a 5-factor compatibility algorithm
- **Trust scoring** with bronze/silver/gold tiers and 5-dimension reviews
- **Italian-law lease contracts** (transitorio, 4+4, 3+2) with cedolare secca support
- **Multilingual UX** in Italian, English, Spanish and French
- **In-app + email notifications** via Resend with preference management
- **Admin operations**: moderation, analytics, telemetry, dispute resolution
- **Moonshot modules**: guaranteed rent, co-living pods, digital twins, arrival concierge

See the [feature comparison](./comparison) for how CasaStudente stacks up against Immobiliare.it, Idealista, HousingAnywhere and Facebook groups.

## Who it’s for

| Audience | What they get |
| -------- | ------------- |
| **Fuorisede students** | A trustworthy, searchable inventory of verified rooms — in their language, with one-click payments. |
| **Landlords** | A pipeline of UniBo-verified tenants, automated payouts, and tax-ready receipts. |
| **University offices** | A complement to Er.Go's overflowing inventory with API access to institutional data. |
| **Civic & policy teams** | An open dataset of rents, vacancy and demand. See [`/api/institutional/*`](./api/rest#institutional-data-apis). |
| **Other student cities** | A fork-and-adapt platform ready for Cesena, Bologna, Parma and beyond. |

## How the docs are organised

This site uses progressive disclosure:

1. **[Getting Started](./getting-started)** — clone, install, run in five minutes.
2. **[Core Concepts](./concepts/architecture)** — the mental model behind the platform.
3. **[Guides](./guides/student-quickstart)** — step-by-step walkthroughs for the most common journeys.
4. **[API Reference](./api/rest)** — REST endpoints, Server Actions, webhooks, errors, rate limits.
5. **[Configuration](./config/environment)** — environment variables, scripts, feature flags.
6. **[Troubleshooting](./troubleshooting)** and **[FAQ](./faq)** — for when things go sideways.

If you’re new, start with **[Getting Started](./getting-started)**. If you’re evaluating, jump to **[Comparison](./comparison)** or **[Architecture](./concepts/architecture)**.
