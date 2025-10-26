# Homepage Customization


## Objective
Customize the Cactoide home page

## Relevant Modules

### 1. Main Page Component
**File:** `src/routes/+page.svelte`
- Main UI component for the home page
- Uses Svelte template syntax
- Imports i18n for translations via `t()` function
- Uses `goto()` for client-side navigation

**Structure:**
- **Hero Section** (lines 11-41): Main title, subtitle, tagline, CTA button
- **Public Events Section** (lines 43-60): Discover public events CTA
- **Features Section** (lines 62-136): 6 feature cards with icons
  - 🎯 Instant Event Creation
  - 🔗 One-Click Sharing
  - 🔍 All-in-One Clarity
  - 👤 No Hassle, No Sign-Ups
  - 🛡️ Smart Limits
  - ✨ Effortless Simplicity
- **How It Works Section** (lines 138-176): 3-step process
  1. Create Event
  2. Get Unique URL
  3. Collect RSVPs
- **CTA Section** (lines 178-192): Final call-to-action

**Styling:**
- Uses Tailwind CSS classes
- Responsive grid layouts (md:grid-cols-2, lg:grid-cols-3)
- Violet theme color (#violet-400, #violet-500)
- Border and hover effects

### 2. Server-Side Logic
**File:** `src/routes/+page.server.ts`
- Controls landing page visibility
- Reads `PUBLIC_LANDING_INFO` environment variable
- If set to 'false', redirects to `/discover` page (line 6-7)
- Otherwise, loads empty data object (line 10)

### 3. Navigation Component
**File:** `src/lib/components/Navbar.svelte`
- Global navigation bar
- Conditionally shows "Home" link based on `PUBLIC_LANDING_INFO` (lines 28-35)
- Navigation items:
  - Home (conditional)
  - Discover
  - Create
  - My Events
- Active state highlighting using violet color
- Uses `goto()` for navigation

### 4. Translation/i18n System
**File:** `src/lib/i18n/messages.json`
- All text content is externalized
- Nested structure under `home` key (lines 101-136)
- Includes all section titles, descriptions, and button text
- Easy to modify without touching component code


### 5. Environment Configuration
**Variable:** `PUBLIC_LANDING_INFO` in `.env`
- Controls whether landing page is shown
- `true` (default): Shows home page at `/`
- `false`: Redirects `/` to `/discover`

## Key Technologies
- **SvelteKit 5**: Component framework
- **Tailwind CSS 4**: Utility-first styling
- **i18n**: Simple JSON-based translations
- **TypeScript**: Type safety

## Dependencies
- `$app/navigation`: Client-side routing (`goto()`)
- `$app/stores`: Page state (`page`)
- `$lib/i18n/i18n.js`: Translation function (`t()`)
- `$env/static/public`: Environment variables

