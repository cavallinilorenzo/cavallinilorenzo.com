# Engineering config

Read by `/verify`, `/judge`, `/build`, `/ship`, `/ui` and `/release`.

## Risk

- floor: low
- sensitive: no
- high-risk paths:
  - .github/workflows/**: deploy pipeline
  - hosting/DNS config, if it ever lands in the repo: takes the public site down

## Recipe

TODO: no stack yet. Fill in once the framework is chosen, then run each command once.

- setup: `TODO`
- checks:
  - `TODO lint or typecheck`
  - `TODO test`
  - `TODO build`
- run: `TODO`, available at `TODO`
- exercise: TODO (browser or curl against the dev server)
- screenshots: TODO
- test data: none needed, the site has no user data

## Review

- second_opinion: none

## Release

- release: none
