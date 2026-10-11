# STATUS, MAINSTREET
Updated: 2026-10-11  ·  Current milestone: M5 Finish and access (fun gate still open)  ·  Engine MS1 · Content DECK1 · Rubric PLAN1 · Art ART0

## Done since last note
- M4 complete: chapters 4 to 6 playable (practice coins and routing, dividends and Reinvest, E18 stop, the authored slump, Robo Lab setback, a closure on the street with the payout, Cass, rising prices with the indexed goal and what-it-can-buy, the fee lab with two baskets); the time machine with two gardens, per-chapter experiments, a year slider and saved experiments. 20 Playwright journeys green in chromium and webkit; 130 engine tests.
- M3 complete: chapters 2 and 3 playable; six shops and the Basket stall with look-through bars; Ada, Bo and Dev on the street, in the show (coin bars), in the Gazette (one sentence each) and on Results ("Every plan on this town"); the surprise-cost decision with every funding path; chapter intros; basic Scrapbook with the 40-card album and the decoder. 14 Playwright journeys green in chromium and webkit.
- M2 complete: chapter 1 playable end to end (Home, intro, Town with tiles and the trading panel, plan tray with Undo and Clear, confirm sheet, season show with skip and reduced-motion strip, Gazette, goal day, Results with stamps, decoration and discovery picks, Settings, Grown-ups), saves after every change and resumes on reload. tools/ui.spec.mjs drives chapter 1 through the real UI in Chromium and WebKit, including a keyboard-only journey. tools/shots.mjs captures every screen at 412 px.
- M1 complete: engine and content in index.html (85 KB), 126 tests green, 8 golden fixtures replay identically in Chromium and WebKit, 10,000 seeds × four neighbors in 58 s. Engine decisions in docs/decisions.md (funding order, per-shop fund reinvestment, Cass reacts to losses not announcements, E12 hazard, posValue fast path, content before engine).
- Review of the v1 packet (six verified defects, eighteen gaps, fleet integration, art pipeline) and Stephen's rulings R01, R02, R11; fun pass (neighbors, year show, inline trading, Gazette, album, keeper voices, town names).
- `HANDOFF.md` v2 written and is the single source of truth; v1 kept at `docs/handoff-v1-2026-10-10.md`.
- Repo laid out: `docs/` (decisions, WORKLOG, FLEET, ART-BRIEF, playtest, calibration, relay inputs), `tools/` (calibrate-v1, setup.sh, art_manifest.mjs, render_sprites.py), `package.json`, `.gitignore`, stubs for `index.html`, `sw.js`, `manifest.webmanifest`, empty `icons/`, `art/`, `tools/fixtures/`.
- `node tools/calibrate-v1.js` reproduces the v1 table (pasted into `docs/calibration.md`).

## In progress
- M5: free play with presets and town names, scrapbook polish, read-aloud, PWA and offline, export and import, the two-tab lock, recovery states, debug panel, accessibility and performance checks.
- Fun gate (R12) still open: Penny plays chapters 1 and 2 when Stephen has a moment; M3 proceeded on his call.
- Earlier: M0 committed and pushed. `tools/setup.sh` ran (Playwright 1.64.0, engines chromium and webkit). GitHub Pages could not be enabled from the Codespace (403); waiting on Stephen.
- Asset lists are in Drive: Business Materials › Github › 012Assets › mainstreet (sheet with 113 rows plus the direction and prompts doc); links at the top of `docs/ART-BRIEF.md`.

## Next three steps
1. M5: free play (presets page, New town, Replay this town, Type a town name), the finished Scrapbook pages, Export and Import, Settings read-aloud with local voices.
2. M5: service worker precache from art/manifest.json with the embed guard, update banner, two-tab lock, recovery states, debug panel; airplane-mode test on the Pages URL once Stephen enables Pages.
3. M5: keyboard and TalkBack pass, overflow sweep at 412, 375 and 320, performance on the reference device.

## Tests
- node tools/test.mjs: 130 pass / 0 fail · npx playwright test: 20 passed (replay fixtures and nine UI journeys, chromium and webkit) · harness ch5 2,000 seeds: 5.0 s · harness 10,000 seeds, four neighbors: 58.4 s

## Measurements
- index.html 186 KB (content, engine, app, styles) · precache 187 KB · market precompute 14 ms for 240 months, 39 ms with four neighbors (Node on this Codespace; reference device still to measure) · free play, 10,000 seeds: three shops 0.4 to 0.7 points under drift plus yield after events (LEMN, TOYS, BIKE), to be settled at M6 calibration.
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
