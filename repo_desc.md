# Cactoide Repository Description

## Overview
Cactoide is a mobile-first event RSVP platform built with SvelteKit. It enables instant event creation and RSVP collection without requiring user registration, using a cookie-based identification system.

## Tech Stack
- **Framework**: SvelteKit 2 (Svelte 5) with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Deployment**: Node adapter for production, Docker support
- **Build Tool**: Vite 7

## System Requirements
- **git** - Version control
- **docker & docker-compose** - Container orchestration
- **Node.js** - Recommended: 20.19.0 or higher
- **make** - For convenient development commands

---

## Core Functionality

### ===========================
### 1. Routing & Page Structure
### ===========================
SvelteKit uses file-based routing where `.svelte` files define UI and `+page.server.ts` files handle server-side logic (data loading and form actions).

**Key Routes:**
- `/` - Landing page (optional, controllable via env var)
- `/discover` - Browse public events
- `/create` - Event creation form
- `/event/[id]` - Individual event detail page with RSVP management
- `/event/[id]/edit` - Edit existing event
- `/healthz` - Health check endpoint

### ===========================
### 2. Event Management
### ===========================
**Creation:**
- Generates 8-character random IDs for unique event URLs
- Supports two event types: limited (with capacity) or unlimited
- Location types: none, text description, or embedded maps URL
- Visibility: public (discoverable) or private (direct link only)
- Server-side validation (date checks, capacity limits)

**Editing:**
- Only accessible by event creator (via userId cookie)
- Updates stored in database with timestamp tracking

**Data Model:**
- Events: name, date, time, location (3 types), capacity limits, visibility
- RSVPs: attendee name, linked to event, supports guests

### ===========================
### 3. RSVP System
### ===========================

**Features:**
- No registration required - uses anonymous RSVPs
- Supports adding guests (creates multiple RSVP entries)
- Capacity checking for limited events
- Duplicate name prevention per event
- Real-time availability display
- Self-service removal (delete your own RSVP)

**Implementation:**
- Form actions handle add/remove operations
- Database enforces unique constraint on (event_id, name)
- Cascading deletes when events are removed

### ===========================
### 4. Database Layer
### ===========================

**ORM Pattern:**
- Drizzle ORM provides type-safe database operations
- Schema definitions mirror PostgreSQL tables
- Enums for event types, visibility, location types
- Indexes on frequently queried fields (event ID, user ID, visibility)

**Schema:**
- `events` table: stores event metadata
- `rsvps` table: tracks attendees per event
- Foreign key relationships with cascade delete
- Check constraints (e.g., positive capacity limits)

**Configuration:**
- `drizzle.config.ts` - Drizzle Kit configuration
  - Points to schema location (`./src/lib/database/schema.ts`)
  - Defines database dialect (PostgreSQL)
  - Loads DATABASE_URL from environment
  - Migration output directory (`./drizzle`)

### ===========================
### 5. User Identification
### ===========================

**Cookie-Based System:**
- Generates unique user IDs on first visit
- Stored in long-lived cookies (400 days)
- No authentication or passwords
- Used to track event ownership and RSVPs
- Managed in root layout server load function


### ===========================
### 6. Calendar Integration
### ===========================

**iCal Export:**
- Generates ICS files for calendar imports
- Supports Google Calendar, Outlook, Apple Calendar
- Timezone-aware event creation
- Modal component for calendar selection
- Helper functions generate proper iCal format

### ===========================
### 7. Search & Discovery
### ===========================

**Public Event Discovery:**
- Lists all public events sorted by creation date
- Uses Fuse.js for fuzzy search capabilities
- Database query filters by visibility enum
- Data transformation between DB and UI types

### ===========================
### 8. Internationalization (i18n)
### ===========================

**Simple Translation System:**
- Location: `/src/lib/i18n/` directory
- JSON-based message files with nested key structure (e.g., 'calendar.addToCalendarTitle')
- Parameter interpolation support
- Active language determined by renaming `<language_code>.json` to `messages.json`
- No complex i18n library - lightweight approach

**Adding New Languages:**
1. Copy `messages.json` to `<language_code>.json` (e.g., `es.json`, `fr.json`)
2. Translate all strings in the new file
3. Rename your language file to `messages.json` to activate it

**Translation Validation:**
- Script validates all translations against source `messages.json`
- Checks for missing keys and completeness
- Run validation: `make i18n` (all files) or `make i18n FILE=src/lib/i18n/it.json` (specific file)

---

## Svelte/SvelteKit Concepts in Use

### File Conventions
- `+page.svelte` - UI component for a route
- `+page.server.ts` - Server-side data loading and form actions
- `+layout.svelte` - Shared layout wrapper
- `+layout.server.ts` - Server-side layout logic (runs on every page)
- `+error.svelte` - Error boundary for routes

### Server-Side Patterns
- **Load functions**: Fetch data before page renders (SSR)
- **Form actions**: Handle POST requests without JavaScript
- **Cookies**: Access via server functions for user tracking
- **Type safety**: Generated types from route files (`$types`)

### Component Features
- **Reactive statements**: `$:` syntax for computed values
- **Event dispatchers**: Parent-child communication
- **Slots & props**: Component composition
- **Two-way binding**: Form inputs with `bind:value`

### Data Flow
1. Server loads data in `+page.server.ts` load function
2. Data passed to `+page.svelte` as props
3. Form submissions trigger actions in `+page.server.ts`
4. Actions return data or redirect
5. Page automatically re-renders with fresh data

---

## Configuration & Deployment

### Environment Variables

**Core Variables:**
- `DATABASE_URL` - PostgreSQL connection string
  - Local dev: `postgres://cactoide:cactoide_password@localhost:5432/cactoide_database`
  - Docker: `postgres://cactoide:cactoide_password@postgres:5432/cactoide_database`
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT` - Database credentials
- `PORT` - Application port (default: 3000 for Docker, 5173 for dev)
- `HOSTNAME` - Bind address (default: 0.0.0.0)

**Feature Flags:**
- `PUBLIC_LANDING_INFO` - Landing page control
  - `true` (default): Shows landing page at `/` route
  - `false`: Redirects `/` to `/discover` (minimal discovery-focused experience)
  - Useful for customizing user journey based on deployment environment

**Configuration Files:**
- `.env.example` - Template for local development (use with `make db-only` + `npm run dev`)
- `.env.docker.example` - Template for full Docker stack deployment

### Docker Setup
- Compose file includes app + PostgreSQL
- Init script creates database schema (`database/init.sql`)
- Seed script provides test data (`database/seed.sql`) - optional for dummy data
- Volume mounting for database persistence
- Health checks for PostgreSQL readiness

### Build Process
- Vite builds for production
- Adapter-node generates Node.js server
- Static assets in `/static` directory
- TypeScript compilation with svelte-check

---

## Helper Utilities

### Date Helpers
- Format dates for display
- Parse ISO date/time strings
- Local timezone handling

### Calendar Helpers
- Generate iCal format strings
- Create Google Calendar URLs
- Create Outlook web URLs
- File download triggers

### Type Definitions
- Shared interfaces between client/server
- Database model types from Drizzle
- Form data types for validation
- Enum types for constrained values

---

## Development Workflow

### Local Development (Recommended)

**Automated (WSL2):**
```bash
./startup-wsl2.sh
```

**Manual Setup:**
1. Copy `.env.example` to `.env`
2. Ensure `DATABASE_URL` uses `localhost:5432`
3. Start database: `make db-only`
4. Apply schema: `npx drizzle-kit push`
5. Start dev server: `npm run dev` (opens at http://localhost:5173)

**Advantages:** Fast hot-reload, native Node.js debugging, better file watching performance

### Full Docker Stack
**Setup:**
1. Copy `.env.docker.example` to `.env`
2. Ensure `DATABASE_URL` uses `postgres:5432` (container networking)
3. Run: `docker compose up -d`

**Use Case:** Production-like environment, isolated testing

### Common Commands
- **Development**: `npm run dev` (port 5173 with hot-reload)
- **Database**: `make db-only` (PostgreSQL container only)
- **Type checking**: `npm run check`
- **Linting**: `npm run lint` (ESLint + Prettier)
- **Formatting**: `npm run format`
- **Migrations**: `npx drizzle-kit push` (apply schema changes)
- **Translation validation**: `make i18n`
- **Seed data**: Use `database/seed.sql` for dummy data population


