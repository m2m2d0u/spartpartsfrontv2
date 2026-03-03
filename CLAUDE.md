# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NextAdmin — a Next.js 16 admin dashboard template built with React 19, TypeScript, and Tailwind CSS. It provides 200+ pre-built UI components, charts, tables, forms, and dashboard pages.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint (next lint)

No test framework is configured.

## Architecture

**Next.js App Router** with `/src/app` directory. All pages use the modern App Router pattern.

### Component Hierarchy
```
RootLayout (providers + sidebar + header + main content area)
  → Page components (async server components by default)
    → Feature components (Charts, Tables, Forms)
      → Presentational components (UI elements, inputs)
```

### Key Directories
- `src/app/` — Pages and layouts using App Router (route groups like `(home)`)
- `src/components/` — All React components (Layouts, Charts, Tables, FormElements, Auth, ui/)
- `src/services/` — Data services (currently mock data with simulated delays)
- `src/lib/` — Utilities (`cn()` helper using clsx + tailwind-merge, formatters)
- `src/hooks/` — Custom hooks (`useIsMobile` at 850px breakpoint, `useClickOutside`)
- `src/css/` — Global styles and Satoshi font declarations
- `src/types/` — Shared TypeScript types

### Data Fetching Pattern
Server components fetch data via async service functions → Suspense boundaries show skeleton loaders while data loads → search params drive filtering/time-frame selection via `createTimeFrameExtractor`.

### State Management
- **Sidebar state**: React Context (`SidebarProvider` / `useSidebarContext`)
- **Dark mode**: `next-themes` with class-based strategy
- No global state library; props and context only

### Styling
- Tailwind CSS with extensive custom theme in `tailwind.config.ts` (custom colors, spacing, shadows, breakpoints)
- `cn()` utility in `src/lib/utils.ts` for conditional class merging
- `class-variance-authority` for component variants
- Prettier plugin sorts Tailwind classes automatically
- Custom font: Satoshi (loaded via `src/css/satoshi.css`)
- Dark mode via `dark:` Tailwind variants (class strategy)

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

### Image Domains
Remote images allowed from: `cdn.sanity.io`, `lh3.googleusercontent.com`, `avatars.githubusercontent.com`, `pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev` (configured in `next.config.mjs`).
