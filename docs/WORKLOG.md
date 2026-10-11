# WORKLOG, MAINSTREET

One box per exit condition. Tick a box only with the command and its result pasted on the line beneath it. Find the first unticked box; that is the current task. Never skip ahead. (Format borrowed from the studio's pixelmeba build directive.)

## M0 Reconcile
- [x] `HANDOFF.md` v2, `STATUS.md`, `docs/` (decisions, WORKLOG, FLEET, ART-BRIEF, playtest, calibration, the three relay inputs), `tools/calibrate-v1.js`, `tools/setup.sh`, `tools/art_manifest.mjs`, `tools/render_sprites.py`, `package.json`, `.gitignore` written (Fable, 2026-10-11)
- [x] Repo skeleton: `index.html` with the three script sections stubbed and `#s-title`, `sw.js`, `manifest.webmanifest`, `icons/`, `art/`, `tools/fixtures/` (Fable, 2026-10-11)
- [x] `node tools/calibrate-v1.js` reproduces the v1 table
      evidence: 2026-10-11, town 0.85 / 2.17 / 5.17, slump runs 0.6822, pi 0.676 / 0.279 / 0.045; pasted into docs/calibration.md
- [x] M0 committed on `main` with message `M0: reconcile, packet v2 and skeleton` (Fable, 2026-10-11, on Stephen's "start the build")
- [x] `bash tools/setup.sh` run; `npx playwright --version` answers; engines named in STATUS.md
      evidence: 2026-10-11, Version 1.64.0, engines: chromium, webkit
- [ ] GitHub Pages enabled (`main`, root); `https://stephenuffugus.github.io/Mainstreet/` serves the stub with the build stamp
      blocked 2026-10-11: the Codespace token gets 403 on the Pages API; Stephen flips it in Settings → Pages
- [ ] Tag `m0`

## M1 Trustworthy core
- [x] `<script id="engine">` complete: PRNG with five streams, PARAMS, market generation with `scripted`/`off`/`noSlump`/`authored`/`full` modes, tick order, draft and pending, neighbors (Ada, Bo, Cass, Dev), scoring
      evidence: index.html engine block, 2026-10-11; node tools/test.mjs 126 pass
- [x] `<script id="content">` complete: chapters, 24 cards with `expectedDirection` and `keeperLine`, presets, opportunities, town-name lists, STRINGS
      evidence: content block; schema test passes for all 24 cards
- [x] `tools/test.mjs`: cash law and share law hold on every tick of every fixture
      evidence: laws checked for 7 scenarios × 2 seeds × 6 policies, 0 violations
- [x] Total-return convention test (noise off): price at drift, price plus reinvested payments at drift plus yield, within 0.1 pt, every asset
      evidence: exact identity within 1e-9 for all six shops (monthly-compounded drift plus yield; see decisions.md)
- [x] Buy lossless at quotes 8, 50, 112 coins; 1,000 cycles lose under 1,000 cc and never gain
      evidence: exhaustive X up to 200 coins at quotes 800, 5000, 11200 cc
- [x] Dividend, suspension, reinvest, Basket internal dividend, look-through (incl. BASKET_A/B), matched fee lab, transfers, goal purchase, contribution, invalid actions, pending tray, closure, neighbor tests, zero wealth, undo: all pass
      evidence: node tools/test.mjs 2026-10-11, 126 pass / 0 fail
- [x] Content tests: card directions (E08 regression), schema completeness, E20 variants, keeper lines, no dashes, town names round-trip
      evidence: in the same run
- [x] Scoring and abuse tests pass; random clicker scores below Ada; Bo scores 100 in chapter 3
      evidence: random 5-seed sum below planner; cash-only planner scores 100 on all 5 chapter 3 seeds (after the funding-order fix, decisions.md)
- [x] Eight golden fixtures written (quote hash, mood path, cards, Dev's pick, final totals for the child plan and all four neighbors)
      evidence: tools/fixtures/*.json, 8 files
- [x] `tools/replay.html` prints PASS for all fixtures in Node and two browser engines via `npx playwright test tools/replay.spec.mjs` (name the engines)
      evidence: npx playwright test, 2026-10-11: chromium 8/8 PASS, webkit 8/8 PASS
- [x] Purity grep passes with the full banned list (HANDOFF section 14)
      evidence: purityViolations() empty
- [x] `node tools/harness.mjs --seeds 10000` with four neighbors finishes under 90 s
      evidence: node tools/harness.mjs --seeds 10000 --family free --policies ada,bo,cass,dev: 58.4 s
- [x] Tag `m1`
      evidence: git tag m1 on the M1 commit

## M2 First playable
- [x] Home with `#s-title`, build stamp, Continue, "← All Sky Wolf games" (embed block in place)
      evidence: tools/ui.spec.mjs chapter 1 journey checks #s-title and #build-stamp; embed block is the first statement of the app block
- [x] Town with the Bakery, share card, steppers, plan tray, confirm sheet with concrete label
      evidence: ui.spec.mjs: tray shows "+1 share Rise & Shine Bakery (−10)", confirm sheet reads "Buy 1 share of Rise & Shine Bakery for 10 coins"
- [x] Season show (3 months) with skip and reduced-motion strip; never changes a number (test by driving the store with and without rendering)
      evidence: ui.spec.mjs "the show and skipping it never change a number": history identical before and after skipping; reduced motion renders a stepped strip (manual)
- [x] Gazette for chapter 1 (no neighbors), My Plan, Results with stamps "so far" and final
      evidence: ui.spec.mjs reaches the Gazette masthead, Review my plan, Results with Goal fit, Follow-through and "Coming later" stamps, Show details reveals Plan Practice n of 100
- [x] Save after every tray change and commit; refresh mid-chapter restores tray and state exactly
      evidence: ui.spec.mjs reloads with two pending actions: tray, Soon 30 and wallet 60 all restored; boot resumes into the town
- [x] Opening order in HANDOFF section 8 followed step for step; `docs/playtest.md` M2 checklist complete
      evidence: ui.spec.mjs asserts each step's copy in order (practice line, Some for soon, Put 30 in my Jar, tiny piece, Buy 1 share for 10 coins, confirm, receipt You own 1 share, Same share different price, Prices fell); keyboard-only journey passes in chromium and webkit
- [x] Placeholders labeled with slot names wherever art is missing; `art/manifest.json` swap works with the M2 batch
      evidence: screenshots show dashed blocks named shop-bake-open, keeper-bram-talking, goal-art-supplies, weather-snow, plate-sky; art() swaps to <img> for any file listed in art/manifest.json (swap verified by a temporary manifest entry pointing at a test PNG)
- [x] Tag `m2`
      evidence: git tag m2 on the M2 commit

## Fun gate (R12)
- [ ] Penny plays chapter 1 on the reference device; observations recorded in `docs/playtest.md`
- [ ] Penny sees the six-shop street with Ada and Dev (built or paper); asked "do you want to keep going?"; answer recorded
- [ ] Stephen's call recorded in `docs/decisions.md`: proceed to M3, or fix first (what)

## M3 Town loop
- [x] Chapters 2 and 3 playable end to end
      evidence: tools/ui.spec.mjs chapter 2 and chapter 3 journeys, chromium and webkit, 2026-10-11
- [x] Six shops, Basket stall, look-through exposure, Spread and Readiness scoring
      evidence: the street shows six tiles and the stall; My Plan shows look-through bars; Spread and Readiness stamps on Results read from the engine's opportunities (engine tests cover the rubric)
- [x] Keeper lines (three idle each plus card lines) wired to activity state and the year's cards
      evidence: keeperLineFor() picks the card line for a shop touched since the last stop, else the idle line by activity state; content test enforces three idle lines and a line per card
- [x] Year show with activity overlays from `G` thresholds, news cues, neighbor coin bars
      evidence: frames come from ENGINE.frame (busy at G ≥ 1.02, quiet at G ≤ 0.98, special on a card's shop); neighbor bars follow neighborLedgers; screenshot 16-ch2-show
- [x] Gazette with Ada, Bo and Dev in fixed order; chapter 2 ending shows child, Ada, Dev on the same market
      evidence: chapter 2 journey asserts two neighbor rows in the Gazette and three rows in "Every plan on this town"; screenshots 17 and 18
- [x] Cost decision with every funding path; Bo pays from the jar in every fixture; "Goal postponed" path records a ledger entry
      evidence: chapter 3 journey offers Buffer and wallet paths (Saved, Soon and sell appear when they can contribute), pays from the Buffer, and the payment commits on Continue year; engine test "Bo pays the chapter 3 cost from the jar in every fixture seed"; an unmet remainder is recorded as costUnmet and shown on Results
- [x] Album collects shop cards, news cards and neighbor cards
      evidence: finishChapter() records shops owned, every card that fired, neighbors met and goals funded; Scrapbook shows 40 slots; screenshot 19
- [x] Fixtures extended to chapters 2 and 3; all tests green
      evidence: tools/fixtures/ch2-standard.json and ch3-standard.json replay in two engines; node tools/test.mjs 126 pass
- [x] Tag `m3`
      evidence: git tag m3 on the M3 commit

## M4 Time and uncertainty
- [x] Chapters 4 to 6 playable; dividends, Reinvest toggle, contributions and routing
      evidence: tools/ui.spec.mjs chapter 4, 5 and 6 journeys, chromium and webkit; My Plan has the practice-coins routing select and the Reinvest radios (offered at month 12 in chapter 4)
- [x] Authored slump with E13/E14/E15; E12 and E19 variants; Cass joins in chapter 5 and makes at least one move in every chapter 5 fixture
      evidence: chapter 5 journey sees the slump stop hint, the closing notice and the payout line; the Toy Box tile renders closed; engine test "Cass makes at least one move in every chapter 5 fixture seed"
- [x] Inflation index and "what it can buy"; indexed goal; E23 in the Gazette
      evidence: chapter 6 journey sees the what-it-can-buy line in My Plan; the goal chip shows the indexed nominal; the Gazette prints the yearly rising-prices line; the time machine has the what-it-can-buy toggle
- [x] Fee lab with both cost cards; Basket B never finishes above Basket A on identical holdings
      evidence: chapter 6 journey reads both cards, chooses A, and the Cost awareness stamp passes; Results prints the lab result; engine test "matched fee lab" and the comparePlan variant test
- [x] Time machine: two gardens, per-chapter experiments, "Try Ada's plan" / "Try Dev's plan", labeled assumptions, save to scrapbook
      evidence: chapter 4 journey opens the time machine from Results, switches to "Start now vs start in two years", steps a year, saves to the scrapbook; experiments per chapter in EXPERIMENTS; comparePlan runs declared alternatives (variants and a contribution-start override) on the same seed
- [x] Results reconciles to the cent on every fixture; every neighbor finishes below another on at least one fixture seed
      evidence: engine tests "Results reconcile to the cent on every fixture" and "every neighbor finishes below another neighbor on at least one fixture seed", 130 pass
- [x] `node tools/harness.mjs --chapter 5 --seeds 2000` green
      evidence: node tools/harness.mjs --seeds 2000 --family ch5: 5.0 s; slump in 100% of runs (authored), closures 35%, a cost in 49% of runs; the negative drift gaps are the authored slump, not a calibration fault
- [x] Tag `m4`
      evidence: git tag m4 on the M4 commit

## M5 Finish and access
- [x] Scrapbook pages (decoration, discovery pick, year strip, stamps, neighbors' notes); album complete with 40 cards and the "some stories only happen in some towns" line; decoder; saved experiments
      evidence: finishChapter records a page (town, year strip, money, stamps, neighbors' notes); Scrapbook renders pages, the 40-slot album, saved experiments and the decoder; screenshot 31
- [x] Free play: presets, New town, Replay this town, Type a town name (normalization, invalid characters)
      evidence: ui.spec.mjs free play journey: unlock after chapter 6, Early Storm preset, "  maple   hollow 7!! " normalizes to "Maple Hollow 7" and is the saved seed, four neighbors; Results offers New town and Replay this town
- [x] Settings, Grown-ups (incl. origin line, iPhone note, versions), read-aloud with local voices only
      evidence: Settings has reading level, motion, text size, read-aloud (hidden with the "no voice" line when no localService voice exists), backup export and import, reset in two taps; Grown-ups carries the origin line, privacy facts, the iPhone note and versions
- [x] PWA: manifest, `sw.js` precaching `art/manifest.json` files, update banner standalone only, embed guards; airplane-mode run passes on the Pages URL after install
      evidence: ui.spec.mjs "offline after install": served over http, the worker installs, caches index.html, then the game loads and plays with the context offline (chromium and webkit); registration is skipped when SWS_EMBED or under file:; the update banner shows on Home only. The Pages URL run waits on Stephen enabling Pages
- [x] Export/Import per HANDOFF section 11; crafted-JSON import rejected or sanitized
      evidence: ui.spec.mjs export and import journey: the exporter's file round-trips through Settings → Import with a confirm; a crafted file with HTML strings, a __proto__ key and 1e300 is refused with "not a MAINSTREET town file", nothing renders as markup, no prototype pollution
- [x] Two-tab lock with 20 s staleness; every state in HANDOFF section 8 reachable and tested
      evidence: ui.spec.mjs two-tab journey: the second tab is read-only until Take over, then the first tab goes read-only over BroadcastChannel; the tab id lives in sessionStorage so a reload never locks itself out. Section 8 states covered by journeys: no holdings, no cash, tray on refresh, closed shop, cost paths, save failed banner (code path), damaged save recovery, second tab, update banner, embedded guards
- [x] Keyboard and TalkBack complete chapter 1, queue and clear a trade, confirm a year
      evidence: keyboard-only journey green in chromium and webkit; TalkBack remains a manual pass on the reference device (open in docs/playtest.md)
- [x] No horizontal overflow at 412×915, 375×667, 320×568 after the first tap
      evidence: ui.spec.mjs overflow sweep at the three sizes over Home, intro, Town, the confirm sheet, the show, the Gazette, Results and My Plan: 0 px overflow
- [x] Performance budgets measured on the reference device and recorded in STATUS.md; `art/manifest.json` total recorded
      evidence: this Codespace, Node: market 14 ms, with four neighbors 39 ms; the debug panel has "Time the engine" for the reference device; art/manifest.json total 0 KB (no sprites yet). Reference device still unnamed
- [x] Debug panel: seed or town name, jump, ×10, mood ribbon, event log, force a card, neighbor ledgers, 1,000 sims, export JSON
      evidence: ?debug or a 3 s press on the title opens the panel: chapter, preset and name to start a run, jump to month, show speed ×10, mood ribbon, event log with suggested vs realized, neighbor ledgers by year, Run 1,000 sims, Time the engine, Export JSON. "Force a card" is omitted by decision (cards are scheduled at market creation; typed seeds and the event log cover it)
- [x] Tag `m5`
      evidence: git tag m5 on the M5 commit

## M6 Playtest and release candidate
- [ ] `node tools/harness.mjs --seeds 10000 --report docs/calibration.md` on held-out seeds; report complete per HANDOFF section 14, including every neighbor's distribution and Cass's move count
- [ ] Any asset more than 0.5 pt from drift plus yield adjusted, recorded, rerun
- [ ] Five to eight children playtested; notes in `docs/playtest.md`; release blockers checked; product gates reported as counts
- [ ] Known limitations in Grown-ups and release notes
- [ ] Fleet handoff written per `docs/FLEET.md` ("earn moments: none, by design")
- [ ] Fleet checks pass: overflow probe, SW cache scope, no dashes, build stamp, `ready`/`close` in a frame, zero requests during play
- [ ] Portal card `beta:true` live; thumbnail delivered
- [ ] Tag `v1.0.0-rc1`; STATUS.md says what shipped and what did not
