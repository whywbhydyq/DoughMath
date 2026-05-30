# DoughMath Current Package Notes

Date: 2026-05-30

## Current package status

This package reflects the homepage workspace implementation and dependency-install optimization pass. The current project shape is a static-first English tool site for baker’s percentage, sourdough hydration, starter feeding, dough scaling, and pizza dough calculation.

## Current product shape

- Home page: tool matrix plus a default simplified Dough Scaling workspace.
- Home workspace: mode cards, compact inputs, live result preview, Copy result, Reset sample, and Open full calculator.
- Full calculator pages: application-style calculator workspaces with the complete input set, results, copy, print, share URL, reset, formula details, examples, related tools, and below-tool content.
- Content pages: lightweight legal, guide, sitemap, robots, and disclosure routes are preserved.

## Current deployment configuration

- Vercel remains the production build environment.
- `vercel.json` keeps `ignoreCommand` to skip old Vercel builds.
- `vercel.json` sets `installCommand` to `npm ci --prefer-offline --no-audit --fund=false` to reduce dependency-install time.
- GitHub Actions no longer runs local lint, typecheck, test, or build steps.
- The local package intentionally removes Vitest and ESLint tooling from the dependency tree.

## Verification boundary for this package

No local build, test, lint, or typecheck command was run for this dependency-optimized package. Production verification should be based on Vercel deployment logs and manual browser review after deployment.

Recommended deployment checks:

```text
1. Confirm Vercel install time is lower than the previous 8-minute dependency-install phase.
2. Confirm Vercel production build completes.
3. Open the homepage and verify the matrix plus default workspace renders.
4. Edit homepage inputs and confirm the right-side result preview updates.
5. Use Copy result, Reset sample, and Open full calculator.
6. Confirm Open full calculator carries the current homepage inputs through query parameters.
7. Spot-check the five full calculator pages.
8. Confirm /sitemap.xml, /robots.txt, /privacy, /terms, /disclaimer, /contact, and /affiliate-disclosure resolve.
```

## Historical note

Earlier internal reports referenced local `typecheck`, `test`, `lint`, and local production build verification. Those commands belonged to an earlier package state and are no longer part of the current dependency-optimized workflow.
