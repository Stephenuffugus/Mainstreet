# STATUS, MAINSTREET
Updated: 2026-10-11  ·  Current milestone: handed to the dev team at v1.0.0-rc3; vendored into lucid-winds behind the beta gate 2026-10-11; playtest, songs and sprites open (fun gate still open)  ·  Engine MS1 · Content DECK4 · Rubric PLAN1 · Art ART0

## Done since last note
- rc8 R17, the walk in (2026-10-11, not pushed): chapter 1 is a guided walk; the Town Clerk lights one piece of the Town at a time (the coins, the goal, the Jar, the bakery, a share, the plan tray, My Plan, Next season, the confirm sheet) and the player does each step; My Plan explains itself in every chapter; the stop guides carry the Clerk. Engine 131 pass, Chromium 52 journeys (45 plus 7), fixtures unchanged; pictures in /tmp/ms-build/shots5.
- rc7 phase B, the proud pass (2026-10-11, not pushed): chapters 3 and 5 at 190 and 800 (content DECK4; Ada funds 48.6% and 61.7%; Bo now buys his chapter 3 bicycle in about 1 town in 10, Stephen's call), the Clerk in chapter 1 too, the Gazette without the money panel after a recap, the six storefronts on Home, durations in years, no minus zero, 48 px small buttons, darker orange text, chapter 1's Scrapbook beside Home, and four faults fixed from the pictures. Engine 131 pass, Chromium 45 journeys pass (WebKit in CI). Plan: docs/plans/PHASE-B-PROUD-PASS-2026-10-11.md.
- rc5 phase A (R15, R16, 2026-10-11, not pushed): the stake (content DECK3: goals chapter 2 210, chapter 4 850, chapter 6 1500 indexed, each Ada's 35th percentile and above saving alone; chapters 3 and 5 kept at 80 and 150 because saving alone beats Ada's 35th percentile there, Stephen's call) and the moves layer: the Town Clerk's cold open, a check-in at every stop (Spread out, Pull toward my goal, Keep a buffer), the pull card at the goal fit checkpoint, a recap line, a closing card, stamps named as moves. Engine code untouched; fixtures rewritten once for DECK3. Engine 131 pass, Chromium 41 journeys pass (WebKit in CI). Plan: docs/plans/PHASE-A-MOVES-AND-STAKE-2026-10-11.md.
- rc4 (R14, 2026-10-11): the connective tissue after Stephen's first play. The show holds 1.1 s a month in chapter 1 with a caption per month; a recap sheet after every advance in every chapter (prices from and to, your shares, why, your money, one teaching line); the two futures on the confirm sheet; a four-sentence guide at each chapter 1 stop; chapter 1 intro and results as one story; the Town plan tray and buttons pinned at the bottom. Engine, numbers and fixtures untouched. Engine 131 pass, Chromium 37 journeys pass (WebKit in CI). Plan: docs/plans/CH1-CONNECTIVE-TISSUE-2026-10-11.md. Open: the rename (R13), Pages, the fun gate, the art batch.
- Pickup kit: START-HERE.md, split and join tools, npm scripts, a devcontainer, CI on every push, tag v1.0.0-rc3. Stephen is closing his Codespace; the dev team and Astra pick up from the repo alone.
- M8: the music lane (docs/MUSIC.md): songs by feel per moment, crossfade, off by default, host-music handshake, three journeys; art-slot guard test. Waiting on Stephen's songs.
- M7 (rc2): sound, focus for screen readers, Spent on the Town, six checklist journeys automated, first-pass art in all 110 sprite slots (1.3 MB), show news-card fix, plate sizing. 56 Playwright journeys green in chromium and webkit.
- M6: content DECK2 (six drifts recalibrated on held-out seeds; every shop within 0.2 points of its design total), docs/calibration.md with an M6 reading, docs/FLEET-HANDOFF.md, docs/RELEASE-NOTES.md, the embed-protocol journey, Grown-ups copy current, build stamp 1.0.0-rc1, tag v1.0.0-rc1.
- M5 complete: free play with presets and typed town names; scrapbook pages with the year strip, stamps and neighbors' notes; read-aloud with local voices; export and import with a confirm and a hardened parser; the real service worker (precache from art/manifest.json, update banner, embed guard) with an automated offline-after-install test; the two-tab lock; damaged-save recovery; the debug panel; an overflow sweep at 412, 375 and 320. 28 Playwright journeys green in chromium and webkit.
- M4 complete: chapters 4 to 6 playable (practice coins and routing, dividends and Reinvest, E18 stop, the authored slump, Robo Lab setback, a closure on the street with the payout, Cass, rising prices with the indexed goal and what-it-can-buy, the fee lab with two baskets); the time machine with two gardens, per-chapter experiments, a year slider and saved experiments. 20 Playwright journeys green in chromium and webkit; 130 engine tests.
- M3 complete: chapters 2 and 3 playable; six shops and the Basket stall with look-through bars; Ada, Bo and Dev on the street, in the show (coin bars), in the Gazette (one sentence each) and on Results ("Every plan on this town"); the surprise-cost decision with every funding path; chapter intros; basic Scrapbook with the 40-card album and the decoder. 14 Playwright journeys green in chromium and webkit.
- M2 complete: chapter 1 playable end to end (Home, intro, Town with tiles and the trading panel, plan tray with Undo and Clear, confirm sheet, season show with skip and reduced-motion strip, Gazette, goal day, Results with stamps, decoration and discovery picks, Settings, Grown-ups), saves after every change and resumes on reload. tools/ui.spec.mjs drives chapter 1 through the real UI in Chromium and WebKit, including a keyboard-only journey. tools/shots.mjs captures every screen at 412 px.
- M1 complete: engine and content in index.html (85 KB), 126 tests green, 8 golden fixtures replay identically in Chromium and WebKit, 10,000 seeds × four neighbors in 58 s. Engine decisions in docs/decisions.md (funding order, per-shop fund reinvestment, Cass reacts to losses not announcements, E12 hazard, posValue fast path, content before engine).
- Review of the v1 packet (six verified defects, eighteen gaps, fleet integration, art pipeline) and Stephen's rulings R01, R02, R11; fun pass (neighbors, year show, inline trading, Gazette, album, keeper voices, town names).
- `HANDOFF.md` v2 written and is the single source of truth; v1 kept at `docs/handoff-v1-2026-10-10.md`.
- Repo laid out: `docs/` (decisions, WORKLOG, FLEET, ART-BRIEF, playtest, calibration, relay inputs), `tools/` (calibrate-v1, setup.sh, art_manifest.mjs, render_sprites.py), `package.json`, `.gitignore`, stubs for `index.html`, `sw.js`, `manifest.webmanifest`, empty `icons/`, `art/`, `tools/fixtures/`.
- `node tools/calibrate-v1.js` reproduces the v1 table (pasted into `docs/calibration.md`).

## In progress
- Vendored into lucid-winds 2026-10-11 (lucid-winds fcda4676): card MAINSTREET beta:true at /satellites/mainstreet/?v=20261011e, gated on lucidwinds.com; re-vendor with `node scripts/vendor_satellites.mjs --vendor mainstreet` then `git add -f satellites/mainstreet/music`.
- Waiting on Stephen: GitHub Pages, the fun gate with Penny, the wider playtest, the art batches, the reference device.
- Fun gate (R12) still open: Penny plays chapters 1 and 2 when Stephen has a moment; M3 proceeded on his call.
- Earlier: M0 committed and pushed. `tools/setup.sh` ran (Playwright 1.64.0, engines chromium and webkit). GitHub Pages could not be enabled from the Codespace (403); waiting on Stephen.
- Asset lists are in Drive: Business Materials › Github › 012Assets › mainstreet (sheet with 113 rows plus the direction and prompts doc); links at the top of `docs/ART-BRIEF.md`.

## What shipped and what did not (v1.0.0-rc1)
- Shipped: six chapters, free play with seven presets and typed town names, six voiced shops, the Town Basket Fund (two baskets in chapter 6), the Savings Jar bands, four neighbors, inline trading with a plan tray, the year show, the Gazette, Results with five stamps, the scrapbook and album, the time machine, Guided and Explorer, read-aloud with local voices, export and import, recovery, the two-tab lock, offline after first load, the embed protocol, the debug panel. Full list in docs/RELEASE-NOTES.md.
- Did not ship, by decision: sunbeams, earn messages and music unlocks (R01); a "force a card" debug control; a chapter 3 free-play unlock (flag exists, off).
- Did not ship, backlog (HANDOFF 16): Glow Slime and any crypto-flavored content, Pro Picker Fund, share cards and replay links, a calendar scenario, Family Night, bonds, ORCHARD, Play Store packaging.
- Not yet done, needs Stephen: Pages, the live airplane-mode check, the fun gate and the children's playtest, the art batches (every sprite slot is a labeled placeholder), the reference device, TalkBack, vendoring with the portal card.

## Next three steps
1. Stephen: enable Pages (Settings, Pages, main, root), open the URL on a phone, play chapter 1, airplane mode, reload, play on; then let Penny play (docs/playtest.md prompts) and rule on the fun gate.
2. Stephen: the M2 art batch per the Drive asset list; name the reference device so the performance line and the TalkBack pass can be done there.
3. Fleet: vendored (done 2026-10-11); after the playtest, tag v1.0.0, drop beta:true and the dev-gate line, re-vendor.

## Tests
- node tools/test.mjs: 131 pass / 0 fail · npx playwright test: 62 passed (replay fixtures and twenty-three UI journeys incl. offline after install with the art precached, the embed protocol, two tabs, import, recovery, three overflow widths, focus, sound, blocked storage, exit, hidden page, reduced motion; chromium and webkit) · harness: free standard 10,000 held-out towns in about 60 s, all families and presets in about 7 min · harness ch5 2,000 seeds: 5.0 s · harness 10,000 seeds, four neighbors: 58.4 s

## Measurements
- Performance, headless Chromium at 4x CPU throttle (stand-in until the reference device is named): boot to title 385 ms; new run plus Town render 165 ms; queue an action and re-render 1 ms; advance 12 months 3 ms; full render 5 ms
- index.html 216 KB (content, engine, app, styles) · precache about 1.55 MB: 216 KB page plus 110 first-pass sprites, 1,326 KB (art/manifest.json) · market precompute 14 ms for 240 months, 39 ms with four neighbors (Node on this Codespace; reference device still to measure) · free play, 10,000 seeds: three shops 0.4 to 0.7 points under drift plus yield after events (LEMN, TOYS, BIKE), to be settled at M6 calibration.
- Reference device still: Reference device: [Stephen to name one; default is a 412 by 915 Android phone, plus 375 and 320 sweeps]

## Decisions made this session (also in docs/decisions.md)
- R01 to R12 and the three unlettered entries dated 2026-10-11.

## Open questions for Stephen
- Reference device (and whether Penny plays on a Fire tablet).
- GitHub Pages: the Codespace token cannot enable it (403). Settings → Pages → Deploy from a branch → main, / (root).
- The M2 art batch per `docs/ART-BRIEF.md` (Bakery three states, Bram three poses, art-supplies goal, ground and sky plates, sun overlay) whenever ready; Opus builds against placeholders until then.

## Known issues
- `tools/render_sprites.py` is untested here (no Blender in this Codespace).
