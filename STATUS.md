# STATUS, MAINSTREET
Updated: 2026-10-11  ·  Current milestone: M2 First playable  ·  Engine MS1 · Content DECK1 · Rubric PLAN1 · Art ART0

## Done since last note
- M1 complete: engine and content in index.html (85 KB), 126 tests green, 8 golden fixtures replay identically in Chromium and WebKit, 10,000 seeds × four neighbors in 58 s. Engine decisions in docs/decisions.md (funding order, per-shop fund reinvestment, Cass reacts to losses not announcements, E12 hazard, posValue fast path, content before engine).
- Review of the v1 packet (six verified defects, eighteen gaps, fleet integration, art pipeline) and Stephen's rulings R01, R02, R11; fun pass (neighbors, year show, inline trading, Gazette, album, keeper voices, town names).
- `HANDOFF.md` v2 written and is the single source of truth; v1 kept at `docs/handoff-v1-2026-10-10.md`.
- Repo laid out: `docs/` (decisions, WORKLOG, FLEET, ART-BRIEF, playtest, calibration, relay inputs), `tools/` (calibrate-v1, setup.sh, art_manifest.mjs, render_sprites.py), `package.json`, `.gitignore`, stubs for `index.html`, `sw.js`, `manifest.webmanifest`, empty `icons/`, `art/`, `tools/fixtures/`.
- `node tools/calibrate-v1.js` reproduces the v1 table (pasted into `docs/calibration.md`).

## In progress
- M2: Chapter 1 playable (Home, Town with the Bakery, steppers and tray, confirm sheet, season show, Gazette, My Plan, Results, save and restore).
- Earlier: M0 committed and pushed. `tools/setup.sh` ran (Playwright 1.64.0, engines chromium and webkit). GitHub Pages could not be enabled from the Codespace (403); waiting on Stephen.
- Asset lists are in Drive: Business Materials › Github › 012Assets › mainstreet (sheet with 113 rows plus the direction and prompts doc); links at the top of `docs/ART-BRIEF.md`.

## Next three steps
1. M2: app store, persistence, Town and tray, confirm sheet, season show.
2. M2: Gazette, goal-day decision, Results with stamps; the chapter 1 opening order; a Playwright journey through chapter 1 as evidence.
3. Fun gate: Penny plays chapter 1 on the reference device (Stephen).

## Tests
- node tools/test.mjs: 126 pass / 0 fail · replay.html: PASS (chromium, webkit) · harness 10,000 seeds, four neighbors: 58.4 s

## Measurements
- index.html 85 KB (engine and content, no app yet) · precache 86 KB · free play, 10,000 seeds: three shops 0.4 to 0.7 points under drift plus yield after events (LEMN, TOYS, BIKE), to be settled at M6 calibration.
- Reference device still: Reference device: [Stephen to name one; default is a 412 by 915 Android phone, plus 375 and 320 sweeps]

## Decisions made this session (also in docs/decisions.md)
- R01 to R12 and the three unlettered entries dated 2026-10-11.

## Open questions for Stephen
- Reference device (and whether Penny plays on a Fire tablet).
- GitHub Pages: the Codespace token cannot enable it (403). Settings → Pages → Deploy from a branch → main, / (root).
- The M2 art batch per `docs/ART-BRIEF.md` (Bakery three states, Bram three poses, art-supplies goal, ground and sky plates, sun overlay) whenever ready; Opus builds against placeholders until then.

## Known issues
- Playwright is not installed until `tools/setup.sh` runs.
- `tools/render_sprites.py` is untested here (no Blender in this Codespace).
