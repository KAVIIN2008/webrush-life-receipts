# Life Pulse — Your Life, In Receipts

Life Pulse is a frontend-only interactive data story built for WebRush.

It transforms the supplied receipt dataset into:
Raw data → Patterns → Connections → Evidence → Story

## Features

- Receipt and activity overview
- Connected-day discovery
- Search and activity filtering
- Connection Explorer
- Evidence-based Story Mode
- Responsive desktop, tablet, and mobile UI

## Relationship mechanism

A connected day is identified when multiple receipt types occur on the same calendar date.

The user can select a connected day, inspect the underlying records, and move through the day using Story Mode.

## Dataset

The normalized dataset contains:

- 12,833 receipts
- 8,881 music sessions
- 3,952 other activity records
- 3,131 active days
- 1,093 connected days

Data files:

public/data/receipts.json
public/data/overview.json

The lightweight overview is used for the initial page load. The full receipt dataset is loaded only when detailed evidence is needed.

## Architecture

Browser
  ↓
overview.json
  ↓
Dashboard
  ↓
User exploration
  ↓
receipts.json
  ↓
Connection Explorer
  ↓
Story Mode

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Playwright
- ESLint

No backend, database, or server-side application is required.

## Performance

Production Lighthouse results:

- Performance: 99
- Accessibility: 100
- Best Practices: 100

Production metrics:

- FCP: 1.4 s
- LCP: 1.6 s
- Speed Index: 1.4 s
- TBT: 80 ms

## Run locally

Install dependencies:

npm install

Start development:

npm run dev

Build:

npm run build

Preview production build:

npm run preview

## Regenerate overview data

Run:

node scripts/build-overview.cjs

This regenerates:

public/data/overview.json

## Quality checks

The project has been tested for:

- Responsive layouts
- Horizontal overflow
- Overview loading
- Deferred full-dataset loading
- Explore Moment
- Story Mode
- Connection Explorer
- Accessibility
- Production performance

## Project status

Core experience complete and production-tested.

Built as a frontend hackathon project.
