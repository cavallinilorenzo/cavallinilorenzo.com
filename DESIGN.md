# Design

An engineer's notebook: white squared paper, navy ink, one highlighter. Home is a real `git log --graph` of the site owner's work. The direction was chosen by prototype; every variant lives on the `prototype/redesign` branch.

## Tokens (`src/app/globals.css`)

- **Colour:** white `--bg`, navy `--fg` / `--navy` `#0b1f3f`, steel `--mut` `#4a5d7e`, highlighter `--acc` `#ffe14d`.
- **The highlighter is a background under navy text, never a text colour on white.** It marks what matters: the headline words, the active filter or nav item, `HEAD`, branches still open, first places, project nodes, the main call to action.
- **Paper:** 20px squares at 5%, `--paper` on white and `--paper-navy` on navy.
- **Type:** Schibsted Grotesk (variable), very heavy and tight for display. Spline Sans Mono for machine facts: hashes, dates, refs, URLs.
- **Shape:** square corners. Rounded only for app icons, phone frames and graph nodes.

## Avoid

Card grids, gradients, glows, pill badges, pulsing dots, an accent colour on a word's text, a fade-up on every section.

## Motion

Platform-native only (ADR-0002). One hero entrance, page transitions, reveals on Project cards, a cross-fade when the log filter changes.
