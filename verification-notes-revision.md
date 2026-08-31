# Interaction Revision Verification

## Navigation

The landing page remains the primary one-page narrative. Its Coverage, Quality run, and AI layer links scroll to real sections. The header and footer now include a real `/case-study` route, and the case-study page includes back-to-system and return-to-live-system links. The routed case-study page rendered successfully at desktop and mobile widths.

## Cursor

The hero-only cursor wrapper was removed. `GlowCursor` now supports a `global` mode and wraps the complete router from `App.tsx`; its trail is fixed, pointer-events-free, idle-fades, and follows the pointer across all sections and routes without blocking interaction.

## Responsive behavior

The landing page still stacks correctly at 375px. The case-study page collapses its evidence grid to one column, keeps tables readable, and preserves the same dark shell and lime action hierarchy. Desktop and mobile screenshots rendered without visible route or layout failures.

## Build status

TypeScript checks and the production build pass after the revision. The build still reports only the existing Vite chunk-size advisory.
