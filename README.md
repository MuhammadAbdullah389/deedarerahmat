# Deedar-e-Rahamat Pilgrim Paths

Web platform for Hajj and Umrah package management, bookings, testimonials, and agency dashboards.

## Overview

Deedar-e-Rahamat Pilgrim Paths helps a pilgrimage agency manage package listings and customer bookings in one place. The system includes:

- Public pages for Hajj and Umrah package browsing
- User dashboard for booking history and testimonial submission
- Admin dashboard for package, booking, hotel, and testimonial management
- Supabase authentication, database, and realtime features

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- Supabase (`@supabase/supabase-js`)
- React Query (`@tanstack/react-query`)
- React Router
- Vitest + Testing Library

## Prerequisites

- Node.js 18+
- npm 9+

## Local Development

```sh
git clone <your-repo-url>
cd alhabib-pilgrim-paths
npm install
npm run dev
```

Default dev server: `http://localhost:5173`

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: values are sanitized with `trim()` in the Supabase client to prevent whitespace/newline issues.

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run build:dev` - build in development mode
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint
- `npm run test` - run unit tests once
- `npm run test:watch` - run tests in watch mode

## Project Structure

- `src/pages` - route-level pages
- `src/components` - reusable UI and feature components
- `src/hooks/useSupabase.ts` - data hooks and Supabase operations
- `src/lib/supabase.ts` - Supabase client setup
- `src/data` - mock/admin sample data sources

## Deployment

This project is deployed through Vercel with GitHub integration.

- Push to `main` to trigger production deployment.
- Ensure production environment variables are set in Vercel.

## Status

- Branding migrated to Deedar-e-Rahamat
- Placeholder metadata and generated default assets removed from core app metadata
- Live deployment active
