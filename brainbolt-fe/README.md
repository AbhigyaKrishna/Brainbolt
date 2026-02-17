# BrainBolt Frontend

Next.js 14+ frontend for the BrainBolt adaptive quiz platform.

## Features

- **Adaptive Quiz Interface** - CSR-based quiz with real-time difficulty adjustment
- **Server-Side Rendering** - SSR for landing page, leaderboard, and dashboard
- **Design System** - Comprehensive design tokens with light/dark mode support
- **shadcn/ui Components** - Reusable, accessible UI components
- **State Management** - Zustand for auth and quiz state
- **Real-time Updates** - TanStack Query with polling for leaderboard
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Animations** - Framer Motion for engaging UX

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Landing page (SSR)
├── error.tsx / loading.tsx / not-found.tsx
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── quiz/page.tsx           # Quiz play (CSR)
├── dashboard/page.tsx      # Metrics (SSR+CSR)
└── leaderboard/page.tsx    # Leaderboard (SSR)

components/
├── ui/                     # shadcn/ui primitives
├── layout/                 # Header, Footer, ThemeToggle
├── quiz/                   # Quiz components
├── leaderboard/            # Leaderboard components
└── dashboard/              # Dashboard components

lib/
├── api-client.ts           # API client
├── utils.ts                # Utilities (cn, formatters)
└── validators.ts           # Zod schemas

store/
├── auth-store.ts           # Auth state
└── quiz-store.ts           # Quiz state

types/
└── index.ts                # TypeScript types
```

## Design System

All colors, spacing, typography, and other design tokens are defined in `globals.css` using CSS custom properties. **Zero hardcoded values** in components - everything uses tokens through Tailwind config.

### Theme Colors

- Primary: Blue (`hsl(var(--primary))`)
- Secondary: Slate
- Accent: Violet
- Success: Green
- Destructive: Red
- Warning: Orange

### Difficulty Colors

10-level gradient from green (easy) to red (expert)

## Docker

Build the Docker image:

```bash
docker build -t brainbolt-frontend .
```

Run:

```bash
docker run -p 3000:3000 -e API_URL=http://backend:8000 brainbolt-frontend
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## License

MIT

