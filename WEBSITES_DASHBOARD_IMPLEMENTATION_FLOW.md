# Websites Dashboard Implementation Flow

## Goal

Implement the websites dashboard at `/` using the provided screenshot and source-of-truth notes, while reusing the repo's existing routing, data hooks, and UI primitives.

## Inputs Used

- Screenshot reference provided in chat
- `C:\Users\sirig\Downloads\websites_dashboard_source_of_truth.md`
- `C:\Users\sirig\Downloads\sitely_websites_dashboard_source_of_truth.md`
- Existing route and component stack already present in the repo

## Repo Discovery

I inspected the existing implementation first instead of rebuilding the page from scratch.

Files read first:

- `src/routes/_protected/index.tsx`
- `src/components/websites/websites-tabs.tsx`
- `src/components/websites/websites-filters.tsx`
- `src/components/websites/websites-table.tsx`
- `src/components/layout/sidebar.tsx`
- `src/components/layout/top-bar.tsx`
- `src/routes/_protected.tsx`
- `src/hooks/use-websites.ts`
- `src/components/websites/types.ts`
- `src/styles.css`

This established:

- the dashboard already lives at `/`
- URL search params already drive table state
- data comes from `useWebsites`, `useWebsiteStats`, `useDeleteWebsite`, `useSettings`
- the repo already has button/input/select/dropdown/dialog primitives
- layout changes should fit the protected shell rather than bypass it

## Implementation Strategy

I kept the existing business logic and API contracts intact and limited changes to:

- layout
- responsive shell behavior
- websites route composition
- websites table presentation
- filter and tab presentation
- pagination presentation

I did not change:

- route paths
- query keys
- fetch contracts
- mutation behavior
- auth flow

## Main Changes

### 1. Protected shell

Updated `src/routes/_protected.tsx` to make the app shell responsive:

- removed the hard desktop `min-w-[1200px]` constraint
- added mobile sidebar open state
- wired the top bar menu button to open the sidebar on small screens

### 2. Top bar

Rebuilt `src/components/layout/top-bar.tsx` around the later Sitely reference:

- keeps route-specific header content as the main focus
- restores the dashboard-specific action cluster on desktop:
  - Add Website button
  - search field
  - notification icon
  - theme icon
  - avatar
- adds a mobile menu button only when needed
- compresses the desktop action widths at `lg` so the layout still fits correctly at `1200x780`

### 3. Sidebar

Reworked `src/components/layout/sidebar.tsx` to align with the screenshot:

- narrower desktop sidebar
- cleaner icon-first navigation
- mobile sheet-based navigation using existing `Sheet`
- reused existing auth/logout behavior

### 4. Websites route

Rebuilt `src/routes/_protected/index.tsx` around the screenshot requirements:

- preserved URL-driven search, sort, tab, page, and limit state
- kept tab changes resetting page to `1`
- kept delete confirmation at page level
- preserved the existing data hooks and URL behavior even after the screenshot-specific filter toolbar was later removed
- tightened outer paddings and vertical gaps so the full desktop composition fits within `1200x780`

### 5. Status tabs

Rebuilt `src/components/websites/websites-tabs.tsx` into the underline-style tab row shown in the final reference:

- All, Live, In Progress, Overdue, Due Soon
- count badges from `/websites/stats`
- refresh button on the right
- horizontal scroll on smaller widths

### 6. Toolbar iteration

I initially preserved a search/filter toolbar under the tabs because the earlier screenshots showed it.

Later, based on the updated source-of-truth screenshot and direct user correction, I removed that toolbar from the websites page entirely:

- removed the extra search field under the tabs
- removed the client/type/filter/reset controls from the page body
- kept the existing route search/filter plumbing intact so behavior remains compatible with repo patterns

### 7. Websites table

Rebuilt `src/components/websites/websites-table.tsx` with two responsive modes:

- desktop: stable 9-column grid inside a scrollable card
- mobile: stacked cards for each website

Other table changes:

- sortable headers kept URL-driven
- platform marks added for WPX and Netlify
- row action menu preserved
- renewal date display updated for normal, due soon, and overdue states
- footer pagination aligned with the reference layout
- desktop body changed so only the table body scrolls when height is constrained
- column widths were tightened so the right edge stays inside the viewport at `1200x780`
- row/header/footer density was reduced in the final pass so 10 rows plus the footer remain visible

### 8. Shared pagination control

Updated `src/components/ui/page-size-selector.tsx` to match the dashboard tone:

- neutral border styling
- compact select sizing
- total count text matching the footer design

### 9. Badge styling

Adjusted `src/components/websites/status-badges.tsx` so pills/badges better match the screenshot:

- softer rounded pills
- simpler status pill presentation

## Validation Flow

### Build validation

Ran:

```powershell
npm.cmd run build
```

Result:

- build passed after the route/component changes

### Visual validation

The requested `$playwright-interactive` tool was not available in this session, so I used the available Playwright runtime through the Node REPL instead.

Validation approach:

1. Build the app with `vite build`.
2. Serve `dist/client` locally from a lightweight Node HTTP server.
3. Launch Playwright with the system Chrome executable.
4. Seed local auth tokens in `localStorage`.
5. Stub API responses for:
   - `/auth/me`
   - `/settings`
   - `/websites/stats`
   - `/clients`
   - `/websites`
6. Capture a real `1200x780` screenshot of the dashboard.
7. Compare viewport fit against the reference and iterate.

### Behavior checks confirmed

- page button updates `page` in the URL
- tab bar and refresh button render correctly
- the right edge of the table stays inside the viewport at `1200x780`
- the footer is fully visible while still showing 10 rows
- the desktop composition no longer relies on page-level overflow to expose the footer

## Assumptions Made

- The later Sitely screenshot replaced the earlier dashboard version, so I treated the Sitely layout as the final visual source of truth.
- I kept the top-right search field in the header because it remains visible in the final reference.
- I removed the extra body toolbar because the user explicitly said it was no longer needed.
- Mobile behavior is implemented as stacked cards because the 9-column desktop table does not translate well to small screens.
- Validation used stubbed frontend data so layout and interactions could be checked without depending on live API/auth availability.

## Files Changed

- `src/routes/_protected.tsx`
- `src/components/layout/top-bar.tsx`
- `src/components/layout/sidebar.tsx`
- `src/routes/_protected/index.tsx`
- `src/components/websites/websites-tabs.tsx`
- `src/components/websites/websites-table.tsx`
- `src/components/websites/status-badges.tsx`
- `src/components/ui/page-size-selector.tsx`

## Reusable Skill Pattern

The repeatable workflow for a future skill is:

1. Read the screenshot notes and existing route/component structure first.
2. Preserve current route and data hooks.
3. Move visual changes into existing shell/components instead of building parallel ones.
4. Keep all dashboard state in URL search params.
5. Add mobile behavior explicitly for dense desktop tables.
6. Validate visually with Playwright using stubbed auth/API data when backend availability is uncertain.
7. Do a final fixed-viewport pass for the exact desktop size shown in the source screenshot before stopping.
