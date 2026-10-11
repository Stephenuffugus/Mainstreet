# STATUS, MAINSTREET
Updated: 2026-10-11  ·  Current milestone: Fun gate, then M3 Town loop  ·  Engine MS1 · Content DECK1 · Rubric PLAN1 · Art ART0

## Done since last note
- M2 complete: chapter 1 playable end to end (Home, intro, Town with tiles and the trading panel, plan tray with Undo and Clear, confirm sheet, season show with skip and reduced-motion strip, Gazette, goal day, Results with stamps, decoration and discovery picks, Settings, Grown-ups), saves after every change and resumes on reload. tools/ui.spec.mjs drives chapter 1 through the real UI in Chromium and WebKit, including a keyboard-only journey. tools/shots.mjs captures every screen at 412 px.
- M1 complete: engine and content in index.html (85 KB), 126 tests green, 8 golden fixtures replay identically in Chromium and WebKit, 10,000 seeds × four neighbors in 58 s. Engine decisions in docs/decisions.md (funding order, per-shop fund reinvestment, Cass reacts to losses not announcements, E12 hazard, posValue fast path, content before engine).
- Review of the v1 packet (six verified defects, eighteen gaps, fleet integration, art pipeline) and Stephen's rulings R01, R02, R11; fun pass (neighbors, year show, inline trading, Gazette, album, keeper voices, town names).
- `HANDOFF.md` v2 written and is the single source of truth; v1 kept at `docs/handoff-v1-2026-10-10.md`.
- Repo laid out: `docs/` (decisions, WORKLOG, FLEET, ART-BRIEF, playtest, calibration, relay inputs), `tools/` (calibrate-v1, setup.sh, art_manifest.mjs, render_sprites.py), `package.json`, `.gitignore`, stubs for `index.html`, `sw.js`, `manifest.webmanifest`, empty `icons/`, `art/`, `tools/fixtures/`.
- `node tools/calibrate-v1.js` reproduces the v1 table (pasted into `docs/calibration.md`).

## In progress
- Fun gate (R12): Penny plays chapter 1 on the reference device; then Stephen's call on M3.
- Earlier: M0 committed and pushed. `tools/setup.sh` ran (Playwright 1.64.0, engines chromium and webkit). GitHub Pages could not be enabled from the Codespace (403); waiting on Stephen.
- Asset lists are in Drive: Business Materials › Github › 012Assets › mainstreet (sheet with 113 rows plus the direction and prompts doc); links at the top of `docs/ART-BRIEF.md`.

## Next three steps
1. Stephen: enable Pages, open the live URL on the reference device, let Penny play chapter 1; record the fun gate in docs/playtest.md.
2. M3: chapters 2 and 3 in the app (six shops, Basket stall, neighbors Ada, Bo and Dev on the street and in the Gazette, the E20 cost decision, keeper lines by state and card).
3. M3: year show with activity overlays for six shops; album collecting; fixtures already cover chapters 2 and 3.

## Tests
- node tools/test.mjs: 126 pass / 0 fail · npx playwright test: 10 passed (replay fixtures and four UI journeys, chromium and webkit) · harness 10,000 seeds, four neighbors: 58.4 s

## Measurements
- index.html 143 KB (content, engine, app, styles) · precache 144 KB · market precompute 14 ms for 240 months, 39 ms with four neighbors (Node on this Codespace; reference device still to measure) · free play, 10,000 seeds: three shops 0.4 to 0.7 points under drift plus yield after events (LEMN, TOYS, BIKE), to be settled at M6 calibration.
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
