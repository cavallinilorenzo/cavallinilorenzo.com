# Engineering config

Read by `/verify`, `/judge`, `/build`, `/ship`, `/ui` and `/release`.

## Risk

- floor: low
- sensitive: no
- high-risk paths:
  - .github/workflows/**: deploy pipeline
  - hosting/DNS config, if it ever lands in the repo: takes the public site down

## Recipe

- setup: `pnpm install --frozen-lockfile && pnpm exec playwright install chromium`
- checks:
  - `pnpm format:check` (Prettier)
  - `pnpm lint` (ESLint)
  - `pnpm typecheck`
  - `pnpm test` (Vitest, pure logic in `src/**/*.test.ts`)
  - `pnpm build` (every route in the table must be `○ Static`)
  - `pnpm e2e` (Playwright against the production build; run `pnpm build` first)
- run: `pnpm dev`, available at `http://localhost:3000`. For the production build: `pnpm build && pnpm start --port 3100`, at `http://localhost:3100`
- exercise: browser or curl against the production server, e.g. `curl -sI http://localhost:3100/cv.pdf` must answer `content-type: application/pdf`
- screenshots: with the production server on :3100, `node scripts/screenshots.mjs <path> <outDir>` writes dark/light, desktop/390px PNGs (default dir `screenshots/`, gitignored)
- test data: none needed, the site has no user data

## Review

- second_opinion: none

## Release

- release: none
