# Life Pulse — Your Life, In Receipts

Life Pulse is a frontend-only interactive data story built for WebRush. It turns the supplied life-activity dataset into:

**Raw data → Patterns → Connections → Evidence → Story**

## What the experience does

- **Overview:** presents dataset scale and recurring signals without loading the full receipt file.
- **Moment exploration:** selects a connected calendar day and loads its detailed evidence on demand.
- **Evidence Explorer:** searches and filters receipt records.
- **Life Patterns:** derives monthly activity, time-of-day rhythm, category signals, and a 7×8 activity heatmap from the supplied records.
- **Connection Explorer:** groups a selected day by receipt type and exposes the underlying records.
- **Story Mode:** walks through the selected day as evidence-based chapters.
- **Responsive UI:** designed for desktop, tablet, and mobile layouts.

## Relationship mechanisms

The project uses observable relationships rather than invented personal explanations:

1. **Temporal relationship:** multiple receipt types occurring on the same calendar day.
2. **Artist relationship:** records sharing an artist field can be related.
3. **Category relationship:** records sharing a category can be related.

The current connection UI foregrounds the temporal relationship because it is the clearest cross-type relationship in the supplied dataset. Pattern analysis exposes the other observable dimensions.

## Data architecture

The initial page uses a small derived overview:

`public/data/overview.json`

The detailed records remain in:

`public/data/receipts.json`

The application does not load the full receipt dataset until the user requests deeper analysis through search/filtering, moment exploration, or Life Patterns.

### Flow

```text
Supplied dataset
      ↓
Overview builder
      ↓
overview.json
      ↓
Fast initial dashboard
      ↓
User requests evidence / patterns
      ↓
receipts.json loaded on demand
      ↓
Selectors + pattern analysis
      ↓
Story Mode / Connection Explorer
```

## Component architecture

```text
src/
├── components/
│   ├── dashboard/
│   │   ├── ActivityChart.tsx
│   │   └── LifePatterns.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── receipts/
│   │   ├── EvidenceExplorer.tsx
│   │   └── ReceiptCard.tsx
│   ├── connections/
│   │   └── ConnectionExplorer.tsx
│   ├── story/
│   │   └── StoryMode.tsx
│   └── ui/
│       ├── Signal.tsx
│       └── Stat.tsx
├── app/
│   └── App.tsx
├── features/
│   ├── patterns/
│   │   └── patterns.ts
│   └── receipts/
│       ├── data.ts
│       └── selectors.ts
├── hooks/
│   └── useReceiptDataset.ts
└── utils/
    └── formatting.ts
```

`src/app/App.tsx` is intentionally a thin composition shell. Formatting helpers live in `src/utils/formatting.ts`, receipt filtering lives in `src/features/receipts/selectors.ts`, and heavy interactive sections use dynamic imports and Suspense boundaries.

## Pattern analysis

Life Patterns is calculated from the actual receipt fields:

- monthly receipt volume
- time-of-day buckets
- day-of-week × time-of-day heatmap
- non-music category counts
- neutral observed-pattern summary

Pattern labels are descriptive. They are not claims about personality, intent, or identity.

## Performance decisions

- Lightweight overview loaded first.
- Full dataset deferred until needed.
- Story, connection, and pattern sections are dynamically imported.
- React and Lucide are split into separate vendor chunks during production builds.
- Document metadata includes a description, Open Graph tags, theme color, and an overview preload hint.
- Receipt cards are memoized because they are repeated list items.

## Accessibility and responsive design

- Semantic sections and navigation landmarks.
- Search input has an accessible label.
- Filter controls expose `aria-pressed`.
- Expandable connection groups expose `aria-expanded`.
- Interactive controls include visible keyboard focus states.
- Layouts are tested at mobile, tablet, and desktop viewport sizes.
- Contrast was checked with a production Lighthouse audit.

## Dataset summary

The normalized supplied dataset contains:

- **12,833 receipts**
- **8,881 music sessions**
- **3,952 other activity records**
- **3,131 active days**
- **1,093 connected days**

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Playwright
- ESLint
- Vercel

No backend, database, or server-side application logic is required.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

Regenerate the lightweight overview after changing the supplied normalized dataset:

```bash
node scripts/build-overview.cjs
```

## Quality verification

The project is checked for:

- production build success
- lint cleanliness
- overview loading
- deferred full-dataset loading
- responsive layouts
- horizontal overflow
- keyboard-accessible controls
- Explore Moment
- Story Mode
- Connection Explorer
- production performance and accessibility

## Design rationale

The project deliberately separates **fast orientation** from **deep evidence inspection**. A user can understand the dataset before downloading the full receipt collection. Once a user asks a question—searching, filtering, opening a connected day, or revealing patterns—the application loads the detailed records needed to answer it.

That keeps the initial experience lightweight while preserving a rich, data-grounded exploration path.
