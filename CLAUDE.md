# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for a Yamb (dice game) scoreboard. The application allows users to track scores across different scoring categories and columns, with automatic sum calculations and validation rules.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000 (DO NOT RUN THIS)
- `npm run build` - Build for production (DO NOT RUN THIS)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests in watch mode

**IMPORTANT**: Never run `npm run build` or `npm run dev` commands in this project.

## Testing

- Jest is configured with jsdom environment for React component testing
- Test files should be placed alongside source files with `.test.ts` or `.test.tsx` extension
- Path aliases are configured: `@/components/*`, `@/hooks/*`, `@/lib/*`
- Run single test: `npm test -- --testNamePattern="test name"`

## Architecture

### Core Hook: useScore
The `useScore` hook in `src/hooks/useScore.ts` is the central state management for the application:
- Manages the game state including scores matrix and star counter
- Implements complex scoring rules and validation for Yamb game
- Handles automatic sum calculations (sum1, sum2, totalSum)
- Validates score inputs based on game rules (multiples, ranges, specific values)

### Component Structure
- `src/app/page.tsx` - Main page component that orchestrates the entire scoreboard
- `src/components/Scoreboard.tsx` - Interactive table component for score entry
- `src/components/StarCounter.tsx` - Simple counter component for tracking stars
- `src/components/ui/table.tsx` - Reusable table UI components (likely shadcn/ui)

### Scoring System
The scoreboard uses a 6-column system (↓, S, ↑, N, D, ↕) with 16 different scoring categories:
- Basic numbers (1-6) with multiplication validation
- Special combinations (straight, full, poker, yamb, trilling)
- Calculated fields (sum1, sum2, totalSum) that auto-update
- Min/max values for strategy scoring

### UI Framework
- Uses Tailwind CSS for styling
- Incorporates shadcn/ui components for consistent design
- Client-side components with 'use client' directive
- Responsive design with overflow handling for mobile

## Code Patterns

### State Management
- Uses React useState for local state management
- Custom hook pattern for complex logic encapsulation
- Immutable state updates with spread operators

### Type Safety
- TypeScript with strict typing
- Custom types: `ScoreRow`, `Scores` for game state
- Proper component prop typing

### Validation
The game implements specific Yamb rules:
- Number scores must be multiples of the row number (1-6)
- Special combinations have specific valid ranges
- Straight can only be 0, 46, 56, or 66
- Automatic sum calculations with bonus rules (30 points for sum ≥ 60)

### Hydration
- The `<body>` element uses `suppressHydrationWarning={true}` to prevent hydration warnings caused by browser extensions (like Grammarly) that modify DOM attributes after server render but before client hydration

### Data Persistence
- All game data (scores and stars) is automatically saved to localStorage
- Data persists across page refreshes and browser sessions
- SSR-safe implementation: initial render shows default state, localStorage data loads after hydration
- Storage keys: `yamb-scores` (JSON) and `yamb-stars` (string)
- Includes error handling for localStorage failures

### Mobile Features
- **Screen Wake Lock**: Prevents mobile device screens from turning off during gameplay
- Automatically requests wake lock when app loads
- Re-acquires wake lock when returning to the app (visibility change)
- Properly releases wake lock on app close/unmount
- Includes fallback for browsers that don't support Wake Lock API