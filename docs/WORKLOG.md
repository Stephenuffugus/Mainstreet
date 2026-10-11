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
- [x] Tag `m0`
      evidence: M0 shipped inside the M1 commit (50e566a, tag m1); no separate m0 tag exists

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
- [x] `node tools/harness.mjs --seeds 10000 --report docs/calibration.md` on held-out seeds; report complete per HANDOFF section 14, including every neighbor's distribution and Cass's move count
      evidence: docs/calibration.md, M6 reading plus the harness tables: free standard 10,000 held-out towns, chapters 2 to 6 at 10,000 each, six presets at 2,000 each; every neighbor's p10/p50/p90 nominal and real, drawdown, goal funded, below Ada, Plan Practice and moves
- [x] Any asset more than 0.5 pt from drift plus yield adjusted, recorded, rerun
      evidence: DECK1 gaps were LEMN -0.92, TOYS -0.61, BIKE -0.67 (BAKE -0.45, ROBO -0.42, PAWS -0.14); DECK2 moved every drift by its gap; rerun gaps are within 0.2 points (docs/calibration.md, decisions.md entry of 2026-10-11)
- [ ] Five to eight children playtested; notes in `docs/playtest.md`; release blockers checked; product gates reported as counts
      open: Stephen and Penny first (the fun gate, R12), then the wider group; the automated blockers in docs/playtest.md are ticked
- [x] Known limitations in Grown-ups and release notes
      evidence: Grown-ups page (in-game) and docs/RELEASE-NOTES.md v1.0.0-rc1
- [x] Fleet handoff written per `docs/FLEET.md` ("earn moments: none, by design")
      evidence: docs/FLEET-HANDOFF.md: live URL, file manifest with a vendor MANIFEST entry, card copy, earn moments none (R01), nav map, thumbnail note, every localStorage key, how to update
- [x] Fleet checks pass: overflow probe, SW cache scope, no dashes, build stamp, `ready`/`close` in a frame, zero requests during play
      evidence: ui.spec.mjs overflow sweep (3 widths, 0 px), no-dashes content test, build stamp on #s-title asserted in the chapter 1 journey, embed-protocol journey (ready posted, no worker in the frame, exactly one close, nothing else leaves the frame), offline-after-install journey (plays with the network off); sw.js deletes only mainstreet-* caches
- [x] Portal card `beta:true` live; thumbnail delivered
      evidence: vendored into lucid-winds 2026-10-11 by the section 9 patch (lucid-winds fcda4676, deployed to main the same hour): FEATURED card MAINSTREET `?v=20261011e` with `beta:true`, search alias, 480 px Town thumbnail; `vendor_satellites.mjs --check mainstreet` reports only BEHIND on docs commits (not drift), `--selftest` 11 ok, `sw_cache_scope_check` SCOPED own=mainstreet-, the dev-gate line present; engine tests 131 pass on the lucid-winds box; live URL https://lucidwinds.com/satellites/mainstreet/?v=20261011e behind the gate. Pages on this repo still waits on Stephen
- [x] Tag `v1.0.0-rc1`; STATUS.md says what shipped and what did not
      evidence: git tag v1.0.0-rc1 on the M6 commit; STATUS.md and docs/RELEASE-NOTES.md list what shipped and the backlog

## M7 Polish after rc1 (2026-10-11; not in HANDOFF; Stephen: "keep building")

- [x] Sound per HANDOFF sections 8 and 10: off by default; a soft paper tick per month in the year show; one quiet chime at the Gazette and at the chapter end; a Settings toggle; nothing in the game needs sound
      evidence: synthesized in WebAudio (filtered noise tick, two-sine chime), no audio files; ui.spec.mjs sound journey: toggle persists in ms:settings, a show with sound on raises no errors, chromium and webkit
- [x] Focus for screen readers: a screen change lands on the screen's heading; an in-screen action keeps focus on its control; a sheet that opens takes focus; the Town title carries heading semantics
      evidence: ui.spec.mjs focus journey, chromium and webkit
- [x] Manual checklist items automated: blocked storage, exit to the portal with and without history, hidden page, update banner on Home only and never embedded, reduced motion strip, own and spent and left on the Town screen
      evidence: six journeys in ui.spec.mjs; docs/playtest.md boxes ticked with the test names
- [x] First-pass art for all 113 slots from tools/gen_art.mjs; manifest regenerated; precache total recorded in STATUS.md
      evidence: 110 sprites in art/ (the other three slots are the two PWA icons and the portal thumbnail, already in place), 1,326 KB, largest 19 KB, every corner transparent except the two opaque plates; contact sheet checked; the show's news cards fixed (an array was passed to replaceChildren); sky and weather plates sized; offline-after-install test waits for install to finish; npx playwright test 56 passed
- [x] Art-slot guard: tools/test.mjs enumerates every slot the app can request (shops by state, closable shops, keepers, neighbors, houses, goals, decorations, frames, stamps, trees, weather from real frames) and fails if art/manifest.json lacks one; free-play scrapbook pages borrow a chapter frame by town name
      evidence: node tools/test.mjs 131 pass / 0 fail
- [x] Tag `v1.0.0-rc2`
      evidence: git tag v1.0.0-rc2; build stamp 1.0.0-rc2; worker cache DECK2-MS1-1.0.0-rc2

## M8 Music lane (2026-10-11; Stephen: songs assigned by feel once he hears the game)

- [x] Music layer: music/manifest.json with tracks and a moment map; one song at a time with a crossfade; off by default; starts after the first tap; pauses when hidden; Home toggle; Settings toggle, volume and "Now playing"; debug panel state; the arcade's host-music handshake; songs cached on first play by the worker
      evidence: ui.spec.mjs three music journeys with routed silent audio (toggle, feel follows the screen to the Gazette, no-tracks build shows no controls, host-music mutes and unmutes, volume and now-playing), chromium and webkit; node tools/music_check.mjs
- [x] docs/MUSIC.md: the drop-in guide with the moment table and the rules
- [ ] Stephen's songs in music/ with feels assigned; card flag ownMusic:true in the arcade patch

## R14 Connective tissue (2026-10-11; Stephen's first play, "it must explain itself"; plan docs/plans/CH1-CONNECTIVE-TISSUE-2026-10-11.md)

- [x] The show can be read: 1100 ms a month in chapter 1, 800 ms elsewhere, ×2 halves it, end hold 900 ms; a caption per month (one shop: the keeper's line for that month's activity; a street: the busy shop, a busy street or a quiet street); reduced motion and Skip unchanged
      evidence: ui.spec.mjs "R14 show captions" (chapter 1 caption is Bram's busy line; a chapter 2 year has 12 captions, more than one distinct, changing between frames), chromium, 2026-10-11; screenshot 6-show
- [x] A recap after every advance: "{Season} is done" or "Year n is done", Prices, Your shares ("Still yours"), Why (months by activity, the keeper's line, a fired card, never busy means up), Your money, one teaching line, #recap-go "Back to town" or "Continue" in arrive()'s order; a reload mid recap lands on the town
      evidence: ui.spec.mjs "R14 recap" (from 10 to 11, Still yours: 1 share., From 100 to 101., no dashes, exclamation marks or arrows in its text, reload falls through to the town, the year end goes on to the Gazette) and "R14 recap after a drop" (from 11 to 9, from 22 to 18 coins, Still yours: 2 shares.), chromium; screenshots 6b, 8a, 8c, 16b
- [x] The confirm sheet says what could happen, in the player's own numbers from the live quote
      evidence: ui.spec.mjs "R14 confirm sheet": "goes from 10 to 11, your 3 shares would be worth 33. If it goes to 9, they would be worth 27", the next season starts from 11, nothing held says prices cannot change your money; screenshots 5-confirm, 7b-confirm-spring
- [x] The chapter 1 guide at every stop (steps 1, 3, 4, 5 and months 3, 6, 9) with the Practice year eyebrow; the intro's third paragraph; the results card "Your year in prices"
      evidence: ui.spec.mjs "R14 chapter 1 guide" (from 10 to 11, from 11 to 9, from 9 to 10.5, the town price reads 10.5) and "R14 chapter 1 results" (bought 1 share at 10 and kept it, 11 in spring, 9 in summer, 10.5 in autumn and 10.5 in winter, worth 10.5, bought from the Jar); the chapter 1 end to end journey follows the new copy
- [x] Versions and suites: build 1.0.0-rc4, worker DECK2-MS1-1.0.0-rc4; no engine or content number changed, fixtures replay with no --write-fixtures
      evidence: node tools/test.mjs 131 pass / 0 fail; node tools/join.mjs --check matches; npx playwright test --project=chromium 37 passed (31 before plus 6 R14 journeys), 2026-10-11. WebKit is not installed on this box; CI runs it on push
- [x] Pictures looked at, 412 by 915: 5-confirm, 6-show, 6b-recap-winter, 7-town-spring, 8-town-drop, 8a-recap-spring, 8c-recap-autumn, 11-results, 16b-ch2-recap
      evidence: node tools/shots.mjs /tmp/ms-build/shots 412 915. Fixed after looking: "about 71" beside "worth 10.5" on Results, a lone "This is what someone would pay" under the recap, illegible orange change text, "every one of them" for one share, a money line that wrapped onto a leading dot
- [ ] The lead reviews the pictures, pushes, and re-vendors into the arcade
- [ ] WebKit journeys green in CI on the push

## Phase A The moves layer and the stake (2026-10-11; Stephen's third note, R15 and R16; plan docs/plans/PHASE-A-MOVES-AND-STAKE-2026-10-11.md)

- [x] The stake, content DECK3: chapter 2 goal 210, chapter 4 goal 850, chapter 6 goal 1500 in month 0 coins (indexed); chapters 3 and 5 kept at 80 and 150 because the rule cannot be met there (Ada's p35 is below saving alone); chapter 1 and free play untouched
      evidence: node tools/harness.mjs --seeds 2000 --family all --heldout --due --policies ada,bo (18.1 s): ch2 Ada p35 209, saving only 200, funded 63.8%; ch3 p35 193 vs saving only 212.17; ch4 p35 846, saving only 796.97, funded 63.8%; ch5 p35 819 vs saving only 962.74; ch6 real p35 1480, saving only 1297.55 in month 0 coins, funded 62.3%. Numbers and the fixed point method in docs/decisions.md
- [x] Fixtures rewritten for DECK3 once, then green: node tools/test.mjs --write-fixtures; node tools/test.mjs 131 pass / 0 fail; replay.spec in Chromium: all eight PASS. All eight changed because the market identity includes the content version (decisions.md)
- [x] The Town Clerk: the cold open on the chapter 2 to 6 intro (goal, start, contributions, saving alone, the chapter's move), the closing card on Results, the pull card, the check-in
      evidence: ui.spec.mjs "phase A cold open" (chapter 2: "Your nature trip costs 210 coins and is due in 36 months. You have 200 coins. Saving alone gets you 200. The rest has to grow."; chapter 4 "about 797"; chapter 3 "enough for this goal"; chapter 6 the indexed sentence; no Clerk in chapter 1); screenshot 40-ch2-coldopen
- [x] The check-in at every stop in chapters 2 to 6 and free play: Spread out, Pull toward my goal, Keep a buffer, or "Nothing needs doing this year. Keep going."; the drop and card lines stay on top
      evidence: ui.spec.mjs "phase A check-in" (no shares, then one shop, the 48 px button, the Basket line in the open tray and in view, the Basket panel open, wallet 180 to 90 in the draft and nothing in the saved checkpoint, the row gone, Undo brings it back); screenshots 41, 42, 43, 44, 50-ch2-checkin-viewport-412x780 (one viewport, the pinned footer in view)
- [x] The pull card at the goal fit checkpoint, Move now and Move half and Keep growing, the confirm sheet listing the sells and the Jar in, the recap line, Soon holding the amount after the advance
      evidence: ui.spec.mjs "phase A pull card" (Maple Hollow 7, all in the Basket: the row at month 12, the card at month 24, "You need 210 more in the Jar", tray Sell + "Put 210 in my Jar (Soon)", checkpoint Soon 0 until Next year, confirm "Sell 16 shares of Town Basket Fund" and "Put 210 coins in your Jar", recap "You moved 210 to your Jar for your nature trip.", saved Soon 21000 cc on goal day, Buy it from my Jar); screenshots 45, 46, 47, 48
- [x] Results names the move; stamps as moves; each plan says whether it bought its goal
      evidence: ui.spec.mjs "phase A pull card" ("You pulled money toward your goal in time. You spread your money out.") and "phase A closing card" (no trades: postponed on a short goal day, "You kept everything where it was. Next town, try one move.", "Your nature trip has to wait."); chapter 1 and 6 journeys read the new stamp names; screenshot 49-ch2-results
- [x] Versions and suites: build 1.0.0-rc5, worker DECK3-MS1-1.0.0-rc5, content DECK3, engine MS1 and rubric PLAN1 unchanged, engine code untouched
      evidence: node tools/test.mjs 131 pass / 0 fail; node tools/join.mjs --check matches; npx playwright test --project=chromium 41 passed (37 before plus 4 phase A journeys), 2026-10-11. WebKit is not installed on this box; CI runs it on push
- [x] Pictures looked at, 412 by 915: 40-ch2-coldopen, 41 to 44 the check-in, 45-ch2-pull-card, 46-ch2-pull-queued, 47-ch2-confirm-pull, 48-ch2-recap-pull, 49-ch2-results, 18-ch2-results, 21-ch4-results, 23-ch5-slump, 27-ch6-town, and 50 at 412 by 780
      evidence: node tools/shots.mjs /tmp/ms-build/shots3 412 915. Fixed after looking: the centered cold open, the new tray line hidden under the tray's scroll (and a squeezed Undo), "your a nature trip", "Buy part of a share" for 7.5 shares, choose_basket and route printed raw, a stamp name reading as an award when the move was missed, Ada and Dev's "Now" read without the goal, "Check when you need this money." twice at the slump stop
- [ ] Stephen rules on chapters 3 and 5 (keep, or a goal Ada funds in fewer than 60% of towns, or a longer horizon) and names the Clerk
- [ ] The lead reviews the pictures, updates HANDOFF sections 3 and 5 (goals, DECK3), pushes, and re-vendors into the arcade
- [ ] WebKit journeys green in CI on the push

## Phase B The proud pass (2026-10-11; Stephen at 20:05, "bring this game to the person who asked for it and be proud of it"; plan docs/plans/PHASE-B-PROUD-PASS-2026-10-11.md)

- [x] Chapters 3 and 5 get a real stake, content DECK4: chapter 3 goal 190 (was 80), chapter 5 goal 800 (was 150); fixtures rewritten once; HANDOFF section 3 rows 3 and 5 and the section 5 DECK line
      evidence: node tools/harness.mjs --seeds 2000 --family all --heldout --due --policies ada,bo (16.5 s): ch3 Ada funds 48.6% (p35 188, saving only 212.17), Bo 10.3%; ch5 Ada funds 61.7% (p35 805, saving only 962.74), Bo 100%; ch2 64.3%, ch4 64.2%, ch6 62.5% after the re-key. node tools/test.mjs --write-fixtures, then node tools/test.mjs 131 pass / 0 fail. Two property tests rewritten (cash-only 100 in chapter 3 checked at the old goal; Cass's moves read as the fixture plus 170 of 200 towns, 183 measured), see docs/decisions.md
- [x] The Town Clerk in every chapter: chapter 1's intro card (the plan's sentence), purple border and "The Town Clerk" eyebrow everywhere, none on Home; chapter 3's cold open names 190 and says a big surprise cost could leave a saver short; chapter 5's names 800
      evidence: ui.spec.mjs "phase A cold open" (chapter 1 card text, eyebrow, Home has no .clerk) and "rc7 the stake for chapters 3 and 5" (190 and 800 in the cold opens and goal lines, DECK4); screenshots 02-ch1-intro-412, 03-ch3-intro-412
- [x] The Gazette no longer repeats the recap: no "Your money" panel after a recap in chapters 2 to 6 and free play; masthead, weather, busiest shop, neighbors and one thing to notice stay; chapter 1's year end Gazette keeps its panel
      evidence: ui.spec.mjs "rc7 Gazette after a recap" (chapter 2: the recap has Your money, the Gazette has no Your money heading and no money panel, Your neighbors and One thing to notice visible; chapter 1 after four seasons: Your money and the money panel visible); screenshot 04b-ch2-gazette-412
- [x] Home gets the town: six storefronts under the hook line, decorative
      evidence: ui.spec.mjs "rc7 Home shows the town" over http (six img, the six open shop files in order, all loaded, alt empty, aria-hidden, 56 px tall, below the tag line, one row at 412, two rows at 320, no horizontal scroll); screenshots 01-home-412, 05a-home-320
- [x] The small faults: durations in years (goal chip, intro goal line, cold open, pull card, pull row, My Plan); no "−0" (signed, signedAmt, and pct with no arrow); the discovery sentence; .btn.small 48 px; --down-text for orange text; chapter 1's lone Scrapbook beside Home
      evidence: ui.spec.mjs "rc7 durations" (210 coins, in 3 years on the intro, the cold open and the chip; in 2 years after a year; durationWord, signed, signedAmt and pct tables; Home button 48 px; chapter 2 keeps its two-link row) and "rc7 Gazette after a recap" (chapter 1 has no links row, Scrapbook and Home in the header); the overflow sweep passes at 412, 375 and 320; screenshots 05c-ch1-town-320, after/06-ch1-town-412
- [x] Versions and suites: build 1.0.0-rc7, worker DECK4-MS1-1.0.0-rc7, content DECK4, engine MS1 and rubric PLAN1 unchanged, engine code untouched
      evidence: node tools/test.mjs 131 pass / 0 fail; node tools/join.mjs --check matches; npx playwright test --project=chromium 45 passed (41 before plus 4 rc7 journeys; the chapter 5 journey and tools/shots.mjs move to Clover Field 14, where Toy Box closes at month 20 and the slump starts at 26), 2026-10-11. WebKit is not installed on this box; CI runs it on push
- [x] Pictures looked at, served over http: /tmp/ms-build/shots4 (01-home-412, 02-ch1-intro-412, 03-ch3-intro-412, 04a-ch2-recap-412, 04b-ch2-gazette-412, 05a-home-320, 05b-ch2-town-tray-open-320, 05c-ch1-town-320, each with a -full page shot) and /tmp/ms-build/shots4/after after the fixes
      evidence: node /tmp/ms-build/shoot4.mjs against python3 -m http.server 8766. Fixed after looking: the chapter 1 intro said its practice sentences twice; the chapter 3 Clerk said "This year" for a cost after the first year; at 320 the open tray footer took 384 of 568 px (now 328: one line title, the two actions on one row); at 320 Home and Scrapbook labels ran into their borders. Seen, not fixed: the recap's "from 10 to about 10" beside "Down 2%"
- [ ] The lead reviews the pictures, pushes, and re-vendors into the arcade
- [ ] Stephen rules on Bo's chapter 3 (he now buys his bicycle in about 1 town in 10) and names the Clerk
- [ ] WebKit journeys green in CI on the push
