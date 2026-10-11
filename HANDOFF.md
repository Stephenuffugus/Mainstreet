# MAINSTREET, HANDOFF.md (build packet for Opus, v2)

2026-10-11 · Stephen Furpahs (Director) · Fable (design) · supersedes `docs/handoff-v1-2026-10-10.md`

## 0. Read me first (for Opus)

This is the build packet for MAINSTREET, a free kids' investing game and a Sky Wolf Studio satellite. It reconciles the Concept Packet v1 (Claude, research), the Astra review (ChatGPT, UX and fun), the v1 handoff (Fable, 2026-10-10) and the review of that handoff (Fable, 2026-10-11, with Stephen's rulings). Where they disagree, this packet decides. The earlier documents in `docs/` are inputs, not specifications.

The brief behind all of it, in Stephen's words: someone asked for a game like Crypto Parrot. This is the kid-safe answer: play money, a market that moves, decisions with consequences and no real risk, and neighbors to measure yourself against. Stephen's one instruction for this version: **make this game fun**, without breaking the non-negotiables in section 1.

**How to work**

1. Build in milestone order (section 13). Each milestone ends with a usable artifact, a commit, an updated `STATUS.md`, and ticked boxes in `docs/WORKLOG.md`. Stop adding features once a milestone's exit conditions pass.
2. Verify the ledger before visual polish. M1 (pure engine, tests, fixtures) comes before any town art.
3. Keep the engine pure: no DOM, wall clock, `Math.random`, or network inside `ENGINE`. UI animation never advances the money model; only a named time-advance action does.
4. Evidence or it did not happen. Never mark a test passed that did not run in this session. Paste the command and result summary into the commit message or `STATUS.md`. Calibration numbers from the v1 toy model are reference only; the finished engine is recalibrated (section 14).
5. Decide, log, continue. When this packet is silent, choose the simpler, more honest option, record it in `docs/decisions.md`, and keep going. List Director decisions in `STATUS.md` under "Open questions for Stephen" instead of blocking.
6. Items marked **[Stephen]** are his to confirm. Defaults are given so work can proceed.
7. Read `docs/FLEET.md` before any screen work. It holds the Sky Wolf embed protocol and the exemption ruling, and the fleet's scripts enforce it.
8. No dashes in anything a player reads. Exclamation marks only for a genuine celebration (goal day, chapter end).

**Inputs in the repo**

| File | What it is |
| --- | --- |
| `HANDOFF.md` | This packet. The single source of truth |
| `STATUS.md` | Resumable status note, updated at every stop |
| `docs/WORKLOG.md` | One checkbox per exit condition per milestone. Find the first unticked box; that is your task |
| `docs/decisions.md` | Running log of choices, newest first |
| `docs/FLEET.md` | Sky Wolf Studio integration: embed block, exemptions, deploy, vendoring, fleet checks |
| `docs/ART-BRIEF.md` | The art runbook for Stephen (Meshy, Blender, naming, delivery by milestone) |
| `docs/playtest.md` | Manual checklists and the Penny gate |
| `docs/calibration.md` | The v1 toy-model table (reference) and, from M6, the real calibration report |
| `docs/handoff-v1-2026-10-10.md` | The previous packet, for history. Not a spec |
| `docs/concept-packet-v1.md`, `docs/astra-review.md` | Rounds 1 and 2 of the relay. Inputs only |
| `tools/calibrate-v1.js` | The v1 calibration script (Node, no dependencies). Reproduces the v1 table; starting point for `tools/harness.mjs` |
| `tools/setup.sh` | Installs Playwright and browsers for the replay tests. Dev only |
| `tools/render_sprites.py` | Blender starter for the art lane. Dev only, Stephen's |

## 1. Product definition

MAINSTREET is a cozy paper-town investing game for children. Kids own little pieces of six town shops and a Town Basket Fund, keep money for soon in a Savings Jar, make a plan for a concrete goal, and watch what a year of news, weather and their choices changes on the street. Four neighbors with plans of their own play the same market beside them. Six short story chapters introduce one money idea each and one neighbor at a time, then unlock a 20-year free play in named towns. The one-line description: **"Own little pieces of a town. Make a plan. See what time changes."**

The teaching claim is: *match your money to your goal, spread it out, and understand that outcomes are uncertain.* It is not "always stay invested." Spending on a planned goal, keeping cash for something soon, and selling a damaged business can all be sensible, and the game treats them that way.

**Where the fun comes from** (built, not promised; section 8 is the spec)

- A town that reacts. Every year advance is a short show: seasons roll, queues form and thin at each shop, a news card lands with a visual gag at the shop it touches, share prices tick on their cards. The child watches their town have a year.
- Neighbors, not rivals. Ada spreads out and leaves it alone. Bo keeps everything in the jar. Cass follows the news. Dev picks one shop and holds. They are shown in a fixed order with plain observations, never ranked, never celebrated, never shamed. Any of them can have a good or bad year. The child compares plans on the same market, which is the whole lesson.
- Trading that feels like a toy. Tap plus and minus on a shop card; the plan sits in a tray; one confirmation commits it with the time advance. Fast to tinker with, impossible to trip over.
- The money is visible. Net worth and the year's change sit on the Town screen in plain coins, blue up and orange down. The score is about habits, but nobody hides the number.
- A Gazette every year, a scrapbook every chapter, and an album of town cards collected by playing (no rarity, no chance). Named towns in free play that a child can replay or type in for a friend.
- Shopkeepers with voices. Six animals who comment on the weather, the news and their own trade, and never on the child's money.

**Audience:** primary ages 8 to 11, with a Guided presentation that supports 7+. Two presentation levels (Guided, Explorer) change information density only (table in section 8). Neither changes market luck, honesty, or scoring. The game never asks for age, name, school or any personal fact.

**Non-negotiables** (unchanged from v1; Astra's review preserved them; Stephen reaffirmed 2026-10-11)

- Free. No ads, in-app purchases, real money or real crypto anywhere. No sunbeams, no studio currency, no earn messages (section 12).
- No player communication: no chat, trading or bartering between players, accounts, login or leaderboards. Neighbors are computed plans on the device, not people.
- Offline after first load. No network requests during play. Saves live on the device only.
- A fictional market. No real tickers, companies or prices. No live-ticking market mode, ever.
- One authored `index.html` in vanilla HTML/CSS/JS, mobile-first, no build step, plus `sw.js`, `manifest.webmanifest`, icons and the `art/` sprite folder.
- Never celebrate a single trade. Celebrate goal day, finishing a chapter and understanding a comparison.
- No loot boxes, spin wheels, rarity, streaks, daily-login pressure, timers, leverage, shorting or "act now" prompts.
- Calm presentation during drops: no flashing red, no alarm sounds, Buy and Sell equally available.
- Raw return is shown, plainly and often, but never drives the score and never ranks anyone.
- Every game word maps to the real one; plain financial words are used in action labels.

**Launch (v1.0) includes:** six chapters, free play with scenario presets and named towns, six shops with voiced keepers, Town Basket Fund, Savings Jar with Soon and Buffer earmarks, dividends with optional reinvestment, practice contributions, one life-cost type, one company closure variant, inflation (chapter 6 and free play), a matched fee lab, four neighbors, the year show, the Gazette recap, the time machine with two gardens, scrapbook, album and decorations, Guided and Explorer, optional local read-aloud, export and import of saves, the Sky Wolf embed protocol.

**Launch excludes** (backlog, section 16): the Glow Slime fad asset and any crypto-flavored content, Pro Picker Fund, share cards and replay links, a calendar scenario, Family Night mode, bonds, standalone ORCHARD app, Play Store packaging, sunbeams and music unlocks (excluded by ruling, not deferred).

**Platform:** Sky Wolf arcade satellite. GitHub Pages from this repo first, carded on the portal as `beta:true` (the tester gate), then vendored same-origin. Play Store only after a separate packaging and policy pass.

## 2. Decision log

### Astra's 22 changes (round 3), as reconciled in v1

Twenty accepted as written, two with a modification. C18 is modified again below (R03).

| ID | Astra proposal | Decision | How it lands |
| --- | --- | --- | --- |
| C01 | Don't award virtue points for holding through crashes | Accept | Follow-through credits *reviewing the plan* at a drop, whatever the child then does (section 7) |
| C02 | Cut the thumb-on-rope hold | Accept | No hold, drag or timed input anywhere. Trades are tap, tray, confirm |
| C03 | Replace Patience = share invested | Accept | Goal fit and Readiness replace it; cash for soon earns credit |
| C04 | Remove outcome points from the habit score | Accept | Score is process-only; outcomes shown separately and plainly |
| C05 | No doubling bell | Accept | Two quiet discovery cards, each shown once, no fanfare (section 9) |
| C06 | Town Fund is a concentrated basket, say so | Accept | Renamed Town Basket Fund; its card says "six shops in one town" |
| C07 | Separate fees from stock selection | Accept | Chapter 6 fee lab: two baskets, identical holdings, 0.2% vs 1.5%. Pro Picker deferred |
| C08 | Remove default trade fees | Accept | Trades cost zero. Costs live in fund expenses only |
| C09 | Account for dividends once with ex-price adjustment | Accept | `P_next = P × G − D` with `G` the total-return factor (section 4, R06) |
| C10 | Savings and inflation are scenario settings | Accept | Inflation off in chapters 1 to 5; chapter 3 shows cash winning a short-horizon goal |
| C11 | Defer the Glow Slime fad | Accept | Backlog as Hype Detective |
| C12 | Treat calibration claims as unverified | Accept with modification | `tools/calibrate-v1.js` reproduces the v1 table; numbers hold for the v1 toy model only; recalibrate the finished engine |
| C13 | Determinism needs fixtures, not just arithmetic rules | Accept | Integer units, quantization boundary, golden fixtures, cross-browser replay page |
| C14 | Batch background news into a digest | Accept | The yearly Gazette is the digest; only decision cards stop time |
| C15 | Symmetric counterfactuals | Accept | Four neighbors on the same market; any can finish lower |
| C16 | Local voices only for read-aloud | Accept | `localService === true` voices only; text always complete |
| C17 | Preserve corrupt saves | Accept | `ms:save:bak` and `ms:save:bad` slots, export before reset |
| C18 | Two neutral benchmarks instead of four named bots | Accept with modification, modified again by R03 | Four neighbors with neutral names and stated plans, fixed display order, plain observations, no ranking |
| C19 | Decorations independent of returns | Accept | One decoration choice per completed chapter, regardless of score or wealth |
| C20 | Plain words plus one metaphor | Accept | "Share" and "dividend" in labels; "slice" once as a picture; garden imagery only in the time machine |
| C21 | 24 authored cards | Accept | Section 6 |
| C22 | Orchard, daily, family modes later | Accept | Orchard becomes the time machine visual; the rest is backlog |

### Rulings of 2026-10-11 (Stephen and Fable)

| ID | Who | Ruling | Why | Affects |
| --- | --- | --- | --- | --- |
| R01 | Stephen | MAINSTREET ships no Sunbeam SDK, no `sws:'earn'` messages, no `/music-unlocks.js`. The embed protocol (ready, close, exit) is included | A daily-capped studio currency and a song-unlock ladder are the mechanics the non-negotiables forbid | Section 12, `docs/FLEET.md` |
| R02 | Stephen | Art is pre-rendered sprites (Meshy to Blender to WebP) for scenery and characters; SVG and DOM for everything dynamic. Stephen makes the assets. Budgets: `index.html` under 250 KB, precache under 2 MB | The inventory cannot fit inline SVG under 150 KB, and the studio owns the pipeline | Sections 10, 11, `docs/ART-BRIEF.md` |
| R03 | Fable | Four neighbors (Ada, Bo, Cass, Dev) launch, one introduced per chapter, replacing the faceless "Another plan" benchmarks. Same engine policies, with faces. Fixed order, plain observations, never ranked, never affect the score | "Make this game fun." Competition with no other players is the Crypto Parrot core, and Astra's objections (shaming names, personality predicts success, return rankings) are each addressed | Sections 3, 5, 8, 9, 10, 14 |
| R04 | Fable | Trading is inline: plus and minus on the shop card, a pending tray, one confirmation sheet on the time advance | Six taps per trade is too many for a child making three trades a stop; one deliberate review per stop is safer than six reflex confirms | Section 8 |
| R05 | Fable | Net worth and the year's change are shown on the Town screen in Guided too | "Shown but never the score" was implemented as "hidden". Kids need to see the number | Section 8 |
| R06 | Fable | `G` is the total-return factor: `g` includes `yieldM`. Fix for the v1 code, which subtracted the dividend from a price-only factor and halved every payer's return | Verified: Bakery 2.55%/yr as written vs 6.19%/yr fixed, 20,000 seeds | Section 4, 5, tests |
| R07 | Fable | Buying charges exactly the value of the shares received; the requested amount is a ceiling | The 1 cc tolerance failed above 50-coin quotes (11 cc at 112 coins) | Section 5, tests |
| R08 | Fable | The tested invariants are cash conservation and share conservation; `marketChange` is derived | The v1 identity defined `marketChange` as the residual, so it tested nothing | Section 5, tests |
| R09 | Fable | E08 weights are `BIKE 1.0, LEMN 0.5, TOYS −0.3`; every shock card carries `expectedDirection` and a content test | As written, rain raised bike sales | Section 6 |
| R10 | Fable | Chapter 1 has a `scripted` mood mode with a 13-month price array; the Basket neighbor moves goal money to Soon at the first stop where the goal is due within 12 months; decay kernel is linear; `own` loadings are stored literals; the draft-and-pending trade model; and the other gap resolutions listed in the review | Opus should not have to guess | Throughout |
| R11 | Stephen | The request was "a game like Crypto Parrot". The kids' interpretation stands | Recorded so no later round re-litigates it | Section 0 |
| R12 | Fable | A fun gate after M2: Penny plays chapter 1 and is shown chapter 2 before M3 starts | The cheapest insurance against building six chapters of a game nobody wants to continue | Section 13, 15 |

**Corrections carried forward from v1**

- InvestQuest (Chad Arnett, App Store) uses eight real companies, is rated 4+, offline, with PIN leagues, 13 lessons and an index fund. Our difference is embodied play, goals, neighbors and fair experiments.
- "A spread-out fund usually wins over 20 years" is replaced everywhere with: **"Spreading money out makes one problem matter less. Outcomes are still uncertain."**
- "Nothing else exists" and "only close competitor" claims never appear in public copy.

**Stephen's decisions, with defaults applied**

| Decision | Default in this packet |
| --- | --- |
| Title | MAINSTREET, working title. No trademark or domain check has been done |
| Age band | Primary 8 to 11; Guided supports 7+ |
| Where it ships | Sky Wolf arcade, GitHub Pages first, portal card `beta:true`, then vendored |
| Fleet layer | Embed protocol only (R01) |
| Art | Stephen produces sprites per `docs/ART-BRIEF.md`; Opus builds against placeholders until each batch lands |
| Reference device | **[Stephen]** Default: a 412 by 915 Android phone (the fleet standard), plus 375 and 320 sweeps. Name a Fire tablet model if Penny uses one |
| Repository | `Stephenuffugus/Mainstreet`, this repo. GitHub Pages from `main`, root, to be enabled in M0 |
| Free play unlock | After chapter 6. A `CONTENT.flags.freePlayAfterChapter3` flag exists for the M6 call |

## 3. Chapters and scenario constants

Six chapters, each introducing one new money idea and one neighbor, then free play. Chapter 1 runs a fixed demonstration market. Chapters 2 to 6 generate their market from a seed inside authored constraints, so good and bad outcomes both happen. The game never swaps in a kinder seed after a loss. All numbers below are scenario constants in `CONTENT.chapters`, editable without touching the engine.

| # | Chapter | Length | New idea | Neighbor introduced | Start coins | Goal (amount, due) | Contributions | Market moods | Required ending |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | A Little Piece | 12 months, stops every 3 | What do I own when I buy? | none (practice) | 100 | Art supplies, 30, month 12 | None | Fixed script | Same share at two prices; the planned purchase happens |
| 2 | Different Shops | 36 months, yearly stops | What if one shop has trouble? | Ada (spreads out) and Dev (one shop) | 200 | Nature trip, 210, month 36 (DECK3; was 60) | None | Normal only | Ada's basket and Dev's shop side by side on the same market; either can finish higher |
| 3 | Ready for Rain | 36 months | Which money needs to stay ready? | Bo (keeps it in the jar) | 200 | Bicycle, 80, month 36 | None | Normal only | A surprise cost is paid; Bo pays it without selling anything; cash served a purpose |
| 4 | Payments Can Grow | 60 months | What changes when payments are reinvested? | none new (Ada, Bo, Dev continue; Dev reinvests) | 150 | Project kit, 850, month 60 (DECK3; was 120) | 10/month | Normal and Boom, no Slump | Contributions, dividends and market change shown as three separate numbers |
| 5 | A Bumpy Journey | 60 months | What changed: price, business, or my goal? | Cass (follows the news) | 300 | Camp week, 150, month 60 | 10/month | Authored slump | A slump and a company setback look different; no recovery promised, no sale condemned; Cass's moves are described, never judged |
| 6 | Two Futures | 120 months | What can a plan buy, after costs and rising prices? | all four | 300 | Big project, 1500 indexed, month 120 (DECK3; was 300) | 10/month | Full chain, inflation on | Goal reached or revised; fee lab result; unlock free play |

**Pacing targets** (measured in playtests, never enforced): chapters 1 to 3 in 4 to 7 minutes each, chapters 4 to 6 in 6 to 10 minutes, the full 20-year free play in 8 to 12 minutes. The year show is about 6 seconds at normal speed and skippable.

### Per-chapter constants

| Constant | Ch1 | Ch2 | Ch3 | Ch4 | Ch5 | Ch6 | Free play |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shops available | Bakery only | All six + Basket | All six + Basket | All six + Basket | All six + Basket | All six + Basket A/B | All six + Basket |
| Neighbors shown | none | Ada, Dev | Ada, Bo, Dev | Ada, Bo, Dev | Ada, Bo, Cass, Dev | all four | all four |
| Savings Jar interest (yearly) | 0% | 0% | 2% | 2% | 2% | 2% | Preset |
| Inflation | Off | Off | Off | Off | Off | Mood-driven, 2.5% average | Preset |
| Dividends | Off | Off | Off | On | On | On | On |
| Reinvest toggle offered | No | No | No | Yes, at month 12 | Yes | Yes | Yes |
| Buffer earmark | No | No | Yes | Yes | Yes | Yes | Yes |
| Life cost (E20) | None | None | 1, months 13 to 30, range 15 to 30 coins, variant "backpack" | None | 50% of seeds, months 13 to 42, range 20 to 40, variant "bike" | 50% of seeds, months 13 to 60, range 25 to 50, variant "book" | 25% chance per year, range 20 to 50, variants rotate |
| Company closure (E19) | No | No | No | No | 33% of seeds | No | Off by default, toggle |
| Decision stops | Months 0, 3, 6, 9 | 0, 12, 24 | 0, 12, 24 | 0, 12 … 48 | 0, 12 … 48 | 0, 12 … 108 | Yearly |
| Goal-fit checkpoint | Months 0 and 9 | 24 | 24 | 48 | 48 | 108 | Yearly when due ≤ 12 months |
| Readiness checkpoint | None | None | 12 (buffer ≥ 15) | None | 12 (buffer ≥ 20) | 12 (buffer ≥ 25) | Yearly |
| Spread checkpoints | None | 0, 12, 24 | 0, 12, 24 | 0 to 48 yearly | 0 to 48 yearly | 0, 24, 48, 72, 96 | Yearly |
| Time machine experiments | none | Ada vs Dev (the ending) | Buffer kept vs Buffer invested | Reinvest on vs off; start at month 0 vs 24 (same monthly amount, labeled "more time and more money"); same total, early vs late | Hold through the slump vs sell at the slump start and re-enter 12 months later (declared policy) | Basket A vs B; nominal vs what it can buy | Any one control |

**Chapter 1 fixed script.** Mood mode `scripted`. Bakery quote per month, months 0 to 12: 10.00, 10.33, 10.67, 11.00, 10.33, 9.67, 9.00, 9.50, 10.00, 10.50, 10.50, 10.50, 10.50 (linear between the authored anchors at months 0, 3, 6, 9 and 12, quantized to cc; the array is stored in `CONTENT.chapters.ch1.script.BAKE` and in fixture 1). Narration marks it as practice: "This first year is a practice run. Prices here follow a story, not a real market." The opening order (section 8) ends with the child owning at least one share and seeing 30 coins set aside. The month-6 drop is the first Follow-through opportunity. No neighbors appear; the comparison idea arrives with Ada and Dev.

**Chapter 2 and 3 markets.** Mood fixed at Normal so differences come from company stories. One event slot per year draws from pool A (section 6); across the three slots at least one negative company card must appear. The chapter 2 ending shows three columns on the same market: the child, Ada (200 coins into the Basket at month 0) and Dev (200 coins into his seeded shop at month 0). The copy says what each did and what each has now, in that order, with no winner named.

**Chapter 3.** Bo joins. The published cost range (15 to 30) is shown at month 0 beside the Buffer. At the cost decision, the Gazette notes that Bo paid it from the jar.

**Chapter 4.** Moods Normal and Boom only (Slump probability set to 0). Contributions of 10 coins arrive on the first of each month as E22 ledger entries, routed by the child's contribution plan (default: wallet). E18 (a shop changes its payment plan) fires once in months 25 to 48 for a seeded dividend-paying shop. Dev reinvests his dividends; the recap's three-number panel is shown for the child and, in Explorer, for each neighbor.

**Chapter 5 authored slump.** Mood path: Normal, then Slump starting at a seeded month in 13 to 30, lasting a seeded 8 to 18 months, then Normal. Recovery strength varies with the seed; the Basket does not have to regain its peak by month 60. E13 explains the slump start, E14 fires mid-slump, E15 at the end. One of E12 (Robo Lab setback, 50% of seeds) or E19 (closure of Toy Box or Robo Lab, 33% of seeds) fires in months 13 to 42; 17% of seeds get neither. The slump start is a Follow-through checkpoint: time stops, "Review my plan" is offered, Buy and Sell stay equally available. Cass joins at month 0 of this chapter and her rule (section 5) moves her to the jar at the slump start.

**Chapter 6.** Full mood chain with inflation. Month 0 is the fee lab: Basket A (0.2%) and Basket B (1.5%), identical holdings; the child reads both cost cards and chooses one for this chapter. Both stay available. E23 (familiar things cost more) appears in each year's Gazette. The goal amount is indexed: 300 coins in month-0 purchasing power, shown as its current nominal figure at each stop. Ada holds Basket A. Finishing chapter 6 unlocks free play.

**Free play.** Twenty years, all four neighbors, yearly stops. Every run has a town name that is also its seed (section 11): a random one from the word lists, or one the child types. Presets, each a named setting override that the preset page explains: Standard; Early Storm (slump begins in year 1); Late Storm (slump in years 16 to 19); Long Quiet (20 years with Boom probability 0 and drift reduced 2 points); Rising Prices (inflation 5%, jar 2%); Savings Pay Well (jar 4%, inflation 1%); Shops Can Close (E19 enabled). "Replay this town" keeps the name and lets the child change the plan; "New town" draws a new name.

## 4. Assets and market model

Six shops, one fund (two in chapter 6), one jar. The model is a toy: a monthly simple-return random walk with three market moods and sector-correlated noise. The parameters below are the starting tuning candidate from v1; section 14 says how they get recalibrated. Do not describe them as real-world return expectations anywhere in the product.

### Assets

| ID | Name | Keeper | Sector (draw) | Start price (coins) | Price drift, yearly | Volatility, yearly | Dividend yield, yearly | `mkt` | `sec` | `own` (literal) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LEMN | Lemon Lane | Lou, a lemur | Food (0) | 8.00 | 5.9% | 28% | 2.0% | 0.40 | 0.40 | 0.824621125123532 |
| BAKE | Rise & Shine Bakery | Bram, a badger | Food (0) | 10.00 | 4.9% | 14% | 3.5% | 0.45 | 0.35 | 0.8215838362577492 |
| TOYS | Toy Box | Ottilie, an otter | Fun (1) | 12.00 | 6.6% | 24% | 1.5% | 0.55 | 0.40 | 0.733143914930759 |
| BIKE | Spoke Bikes | Hop, a hare | Outdoor (2) | 15.00 | 6.2% | 20% | 2.5% | 0.50 | 0.35 | 0.792148975887743 |
| PAWS | Paws Pet Care | Hazel, a hedgehog | Care (3) | 9.00 | 5.1% | 16% | 2.5% | 0.40 | 0.30 | 0.8660254037844386 |
| ROBO | Robo Lab | Fen, a fox | Tech (4) | 20.00 | 9.4% | 36% | 0% | 0.55 | 0.35 | 0.7582875444051551 |

- **Drift was recalibrated in M6 (content DECK2).** The v1 candidates were LEMN 5.0, BAKE 4.5, TOYS 6.0, BIKE 5.5, PAWS 5.0, ROBO 9.0. Authored moods and events cost each shop 0.1 to 0.9 points a year on average, so each drift moved up by its measured gap until the realized arithmetic mean total return over 10,000 held-out free-play towns lands on the v1 design total (LEMN 7.0%, BAKE 8.0%, TOYS 7.5%, BIKE 8.0%, PAWS 7.5%, ROBO 9.0%). `docs/calibration.md` shows both columns.
- **Drift excludes dividends** and is annualized. Monthly drift `driftM = yearly ÷ 12`; monthly yield `yieldM = yield ÷ 12`; monthly volatility `volM = yearly ÷ 3.4641016151377544` (√12 as a literal). All three are precomputed once at load with ÷ only and stored on the asset.
- **Total expected return = drift + yield**, and the engine honors that: the monthly factor `G` is a **total-return factor** that includes `yieldM`; the dividend is then carved out of it (section 4, Dividends). Price alone compounds at the drift; price plus reinvested payments compounds at drift plus yield.
- Drift is an arithmetic monthly mean. Realized median growth sits below it by about half the variance: roughly 1 point for the Bakery and 6 points for Robo Lab. That is intended, and it is why single-shop medians trail the Basket while single-shop best cases beat it.
- `mkt` and `sec` are noise loadings in the toy model, not CAPM betas. `own = √(1 − mkt² − sec²)` is stored as the literal above; the engine never computes a square root.
- **BASKET, Town Basket Fund:** holds all six shops at equal target weight, rebalanced each January, expense 0.2% a year. Its card says: "Six shops in one town. Spread out, but still one town." It keeps and reinvests the shops' dividends inside itself and pays none out. Start NAV 10.00 per unit. In chapter 6 only, two baskets exist: BASKET_A (0.2%) and BASKET_B (1.5%) with identical holdings. `PARAMS.funds = ['BASKET','BASKET_A','BASKET_B']`; every look-through routine iterates that list.
- **JAR, Savings Jar:** cash with earmarks **Soon** (goal money) and **Buffer** (for surprise costs). Interest is a scenario setting (0% or 2%), accrued monthly. The wallet is a third cash balance for everyday use. Wallet plus Jar is all cash; both count in net worth.

### Market moods (regime chain)

Codes `N`, `B`, `S` in `PARAMS.moods`; content uses the codes. Checked once per month. Drift added is scaled by `mkt ÷ 0.5` per asset. Verified stationary mix: 67.6% Normal, 27.9% Boom, 4.5% Slump.

| Mood | Code | Drift added, yearly | Volatility × | Inflation, yearly (ch. 6 and free play) | Monthly chance of switching |
| --- | --- | --- | --- | --- | --- |
| Normal | N | −1.15% | 1.0 | 2.5% | to B 1.0%, to S 0.5% |
| Boom | B | +6.0% | 0.8 | 3.5% | to N 2.5%, to S 0.4% |
| Slump | S | −20.0% | 1.5 | 1.5% | to N 7.0%, to B 3.0% |

Mood modes, set per scenario: `scripted` (chapter 1: explicit quote arrays, no chain, no noise), `off` (Normal only, chapters 2 and 3), `noSlump` (chapter 4), `authored` (chapter 5's scripted slump window inside an otherwise Normal path), `full` (chapter 6, free play).

### Monthly shock

Each month the prices stream yields, in this order: one market shock `zM`, five sector shocks `zS[0..4]`, six own shocks `zO[0..5]` (asset order). Each is an Irwin-Hall draw: sum of six uniforms, minus 3, times 1.4142135623730951 (unit variance, bounded at about ±4.2). For asset `a` with sector index `k`: `z = a.mkt·zM + a.sec·zS[k] + a.own·zO[i]`. Gross total-return factor:

```
g = a.driftM + a.yieldM + mood.driftM × (a.mkt ÷ 0.5) + a.volM × mood.volMul × z + eventShock
G = max(1 + g, 0.4)
```

Authored stress presets, not the noise, supply rare crashes.

### Dividends

Paid in months 3, 6, 9 and 12 of each year when the chapter has dividends on. Per share, `D = openingPrice × yield ÷ 4`. The ex-dividend price is `P_next = openingPrice × G − D`, always positive given the floor and yields under 1% a quarter. Holdings are snapshotted before the market advances (section 5). Direct holdings receive cash to the wallet; with Reinvest on, the cash buys shares at the ex-dividend quote in the same tick. A shop pays nothing in a month its factor `G` fell below 0.7 (a bad month suspends the quarter's payment; the business keeps the cash, so `P_next = openingPrice × G`). E18 halves or suspends a shop's yield for 12 months the same way: the payment shrinks, the business keeps the difference, and the shop's total return is unchanged. That neutrality is deliberate and is the lesson: payment plans change; the business is the same business.

### Fund mechanics

The Basket tracks internal holdings per unit, `h_i` shares of each shop, plus internal cash. `NAV = Σ h_i · P_i + cash`. Each month: internal dividends land in cash and buy shares pro rata at ex prices; the fee factor `(1 − expense ÷ 12)` scales all `h_i`; in January, holdings are reset to equal weights. Look-through exposure for the Spread score is `h_i · P_i ÷ NAV`. NAV stays a float internally and is quantized to centi-coins only for quotes, so a 0.2% fee is never rounded away.

### Company closure (E19)

At the announcement month: price drops to a liquidation value of 25% to 50% of the prior price (seeded), trading in that shop is suspended, the storefront shows a closing notice. Next month: every holder receives the liquidation value per share as cash, the holding is removed, and every fund moves its proceeds equally into the remaining five shops with no fee. The shop never reopens in that run. The Gazette reports it as a permanent loss, different from a slump. Dev, if he held that shop, now holds cash in his wallet and buys the Basket at the next stop (section 5).

### Inflation

A cumulative price index starts at 1.000 and multiplies monthly by `(1 + moodInflation ÷ 12)` when inflation is on. Real value = nominal ÷ index, both in month-0 coins. The Jar balance never shrinks in coins; the "what it can buy" view shows the real value beside it.

## 5. Ledger contract

This section is locked. The UI, the replay, the neighbors, the harness and the fixtures all use exactly this order and these units. If anything here changes, update the fixtures in the same commit and bump `ENGINE_VERSION`.

### Units and rounding

| Quantity | Stored as | Scale | Notes |
| --- | --- | --- | --- |
| Money (wallet, Jar bands, ledger totals) | Integer `cc` | 100 cc = 1 coin | Guided shows whole coins ("about 24 coins" when there are cents). Explorer shows two decimals |
| Shares and fund units | Integer `msh` | 1,000 msh = 1 share | "Part of a share" in Guided; exact quantity in details |
| Quoted price or NAV | Integer `cc` per share |  | `quote = Math.round(priceFloat × 100)`, minimum 1 cc |
| Internal price, NAV, index, fee residue | Float |  | Only inside the engine; quantized once at the ledger boundary |

- Position value `= floor(msh × quote ÷ 1000)` cc, computed with BigInt: `Number(BigInt(msh) * BigInt(quote) / 1000n)`.
- **Buy with up to `X` cc:** `msh = floor(X × 1000 ÷ quote)`; **cash spent `= posValue(msh, quote)`**, which is at most `X`. The preview shows the exact spend. Whole-share buys: `msh = n × 1000`, spend `= n × quote`. Buying is lossless by construction.
- Sell `n` msh: proceeds `= posValue(n, quote)`. Rounding loss under 1 cc.
- Dividend to a holder `= floor(msh × D_cc ÷ 1000)` where `D_cc = Math.round(openingQuote × yield ÷ 4)`. Rounding loss under 1 cc per holder per payment.
- Jar interest per month `= floor(jarTotal_cc × rate ÷ 12)`, credited to the Saved band.
- Caps: any balance or value above 10¹² cc (10 billion coins) rejects the action with a structured error. All stored integers must satisfy `Number.isSafeInteger`.
- A transaction can never produce a negative wallet, negative band, negative holding, NaN or Infinity. `validateAction` returns the error before `applyAction` is called.

### The Jar's three bands

The Savings Jar is one object with three visible bands, all earning the Jar rate: **Soon** (goal money), **Buffer** (surprise costs) and **Saved** (plain savings, Bo's whole plan). The wallet is the separate everyday balance at 0%. Guided shows the jar as a jar with bands and the wallet as a wallet; nothing else holds cash. Save schema: `jar:{soon, buffer, saved}`.

### Draft, pending and commit (the trade model)

While time is stopped, the child's actions do not change the saved run. They are appended to `pending`, and the screen renders `draft = replay(checkpoint, pending)`, recomputed on each change (cheap: pending is a handful of actions). Rules:

- `validateAction(draft, action)` validates against the draft, so the second buy sees the first buy's wallet.
- `UNDO` removes the last pending action (or a named `seq`); `CLEAR` empties the tray. Both recompute the draft.
- `ADVANCE` (Next season, Next year, Continue year) re-validates the whole pending list in order against the checkpoint, rejects everything if any step fails, otherwise commits (`checkpoint ← draft`, `pending ← []`) and then ticks. Decision-card choices (`FUND_COST`, `POSTPONE`, `GOAL_REVISE`) at a mid-year stop take the same path; "Continue year" is the `ADVANCE`.
- `pending` is saved, so a refresh keeps the tray. Nothing in `pending` can ever reach the market.
- A repeated `seq` is ignored, which makes double taps and retried dispatches idempotent.

### Tick order (one month)

1. **Execute** the committed actions at the frozen quotes (already validated at commit).
2. **Contribute:** add this month's practice coins (E22) to the wallet, then route them per the contribution plan. Only money that exists is routed.
3. **Snapshot** holdings entitled to this month's dividends.
4. **Advance the market:** step the mood chain; apply scheduled event shocks; compute each shop's `G`; compute `P_next` (ex-dividend when a payment is due); step the price index; accrue Jar interest.
5. **Distribute:** pay dividends on the snapshot once; credit cash; if Reinvest is on, buy shares at the ex-dividend quote.
6. **Fund housekeeping:** reinvest each fund's internal dividends, apply its monthly fee factor, run the January rebalance. Never a child trade; never a fee on the child.
7. **Neighbors:** advance each introduced neighbor's ledger through steps 1 to 6 with its own policy (below). Neighbors never read the child's state.
8. **Decisions:** process closure payouts; queue life costs (E20), goal day (E21) and any card with `decisionRequired`. If the queue is not empty, stop the time advance with time frozen and present them in order. Background cards go to the Gazette.
9. **Checkpoint:** update ledger totals, append the month to history, save, render.

A multi-month advance ("Next year") runs this loop up to 12 times and stops early at step 8 when a decision is queued. "Continue year" resumes from the next month. Nothing in the UI can run step 4 on its own.

### Conservation laws (the tested invariants)

Two exact laws hold at every tick, to the cc and the msh, with no residual term:

```
cash law:   (wallet + soon + buffer + saved)_t − (…)_{t−1}
            = contributionsIn + jarInterest + dividendsCash + sellProceeds + liquidationPaid
              − buySpend − reinvestSpend − goalSpending − costSpending
share law:  for every holding h:  msh_t = msh_{t−1} + bought + reinvested − sold − liquidated
```

`netWorth = wallet + jar + Σ positionValues` and `marketChange = ΔnetWorth − contributionsIn − jarInterest + goalSpending + costSpending` are **derived** and reported, never tested as identities. Results shows: starting value + money added + investment result − spending = ending value, with `investment result = marketChange + jarInterest` summed over the chapter. `fundFeesEstimate` is disclosed beneath it and never deducted again.

### Neighbor plans

Four policies run on the same market with the same starting coins, contributions, costs, goal, rates and quotes as the child. They are computed, not saved; `comparePlan(save, policy)` rebuilds any of them. Shown in fixed order Ada, Bo, Cass, Dev. They never read the child's holdings and never affect the child's score.

**Shared rules.** Month 0: Soon receives the goal amount if the goal is due within 12 months, Buffer receives the chapter's published minimum cost when the chapter has a Buffer. At every yearly stop: if the goal is due within 12 months and Soon is short, top Soon up from the wallet, then Saved, then a pro-rata sale of holdings. Expense funding order: wallet, Buffer, Saved, Soon, pro-rata sale (general savings before goal money, so a surprise cost never raids the goal while savings exist). An expense that still cannot be paid is recorded as unmet and the comparison is flagged as differing in goal completion. Goal day: pay from Soon, then wallet; if short, postpone. Reinvest is on where it applies. No trade fees. Trades happen at the same frozen quotes at the same stops as the child's.

| Neighbor | Plan, in the child's words | Policy |
| --- | --- | --- |
| **Ada** | "I spread it out and leave it alone." | Month 0: the rest buys the Basket (Basket A in chapter 6). Contributions buy the Basket. Holds |
| **Bo** | "I keep it all in my jar." | Everything goes to Saved. Contributions go to Saved. Never invests |
| **Cass** | "I follow the news." | Month 0: the rest buys the Basket. At each stop, the first rule that applies, one move per stop: (1) she is invested and this is a drop stop (her sleeve fell 10% or more since the last stop): sell all holdings into Saved; (2) she is in cash and the Basket's quote is 15% above where she sold, or 24 months have passed: buy the Basket with all of Saved; (3) a positive shock card landed for shop X: move half the invested sleeve into X, selling pro rata from the rest; (4) a negative shock card hit a shop she holds directly: sell that shop into the Basket. "Positive" and "negative" are the sign of weight × realized magnitude for the card's first-listed asset. She reacts to losses after they happen and to headlines after the chatter is in the price, never to the slump announcement itself. Contributions follow her current largest holding |
| **Dev** | "I pick one shop I believe in." | Month 0: the rest buys one shop drawn uniformly from the available shops by the `|neighbors` stream. Contributions buy that shop. Holds. If the shop closes (E19), the liquidation sits in the wallet until the next stop, then buys the Basket |

Ada is the plan-following bot the abuse tests use; Bo is the cash-only bot that can score 100 in chapter 3.

### Determinism and numeric policy

- `ENGINE_VERSION = 'MS1'`, `CONTENT_VERSION = 'DECK3'` (DECK1 was the v1 tuning candidate; DECK2 was the M6 recalibration; DECK3 (2026-10-11, R15) raised the chapter 2, 4 and 6 goals to the 35th percentile of Ada's net worth at the due month so saving alone cannot reach them, see docs/plans/PHASE-A-MOVES-AND-STAKE-2026-10-11.md and docs/decisions.md; DECK2 was the M6 recalibration of the six drifts), `RUBRIC_VERSION = 'PLAN1'`. A market's identity is `${ENGINE_VERSION}|${CONTENT_VERSION}|${scenarioId}|${seed}`. In free play the seed is the town name (section 11).
- PRNG: cyrb128 seeding into sfc32, five independent streams keyed `|mood`, `|events`, `|prices`, `|neighbors`, `|cosmetic`. `Math.random` never appears inside `ENGINE`. Seeds for chapters 2 to 6 come from the app layer (`crypto.getRandomValues`, encoded as a town name); the time machine and the neighbors reuse the attempt's seed; "Replay chapter" draws a new one; the debug panel accepts a typed one.
- Inside the tick: only `+ − × ÷ %`, `Math.round`, `Math.floor`, `Math.max`, `Math.min`, `Math.imul`, `>>>`, BigInt. **No `Math.pow`, `**`, `exp`, `log`, `sqrt`, `sin`, `cos`, `toFixed`, `parseFloat`, `Intl`, `Number()` on strings.** Every constant that would need them is a literal in `PARAMS`. Use `x * x`, not `x ** 2`.
- Asset, fund, card and neighbor iteration order is the fixed order of `PARAMS.assets`, `PARAMS.funds`, `CONTENT.cards`, `PARAMS.neighbors`. No object-key iteration in the engine; use arrays.
- No locale-dependent parsing, sorting or formatting inside the engine. Formatting happens in the UI layer only.
- This is a strong default, not a proof. The proof is the fixture suite in section 14, replayed in Node and two browser engines.

```js
// PRNG: cyrb128 seed hash -> sfc32 stream. Integer-exact across engines.
function cyrb128(s){let a=1779033703,b=3144134277,c=1013904242,d=2773480762;
  for(let i=0,k;i<s.length;i++){k=s.charCodeAt(i);a=b^Math.imul(a^k,597399067);b=c^Math.imul(b^k,2869860233);
  c=d^Math.imul(c^k,951274213);d=a^Math.imul(d^k,2716044179);}
  a=Math.imul(c^(a>>>18),597399067);b=Math.imul(d^(b>>>22),2869860233);
  c=Math.imul(a^(c>>>17),951274213);d=Math.imul(b^(d>>>19),2716044179);
  return[(a^b^c^d)>>>0,(b^a)>>>0,(c^a)>>>0,(d^a)>>>0];}
function sfc32(a,b,c,d){return()=>{a|=0;b|=0;c|=0;d|=0;const t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;
  b=c+(c<<3)|0;c=c<<21|c>>>11;c=c+t|0;return(t>>>0)/4294967296;};}
const stream = (marketId, name) => sfc32(...cyrb128(marketId + '|' + name));
const gauss = r => (r()+r()+r()+r()+r()+r()-3)*1.4142135623730951; // Irwin-Hall(6), unit variance

// One shop, one month. a.own, a.volM, a.driftM, a.yieldM are literals or computed once at load with / only.
// G is the TOTAL-RETURN factor (R06). The dividend is carved out of it.
function priceStep(a, pOpen, mood, zM, zS, zO, eventShock, payDividend){
  const g = a.driftM + a.yieldM + mood.driftM*(a.mkt/0.5) + a.volM*mood.volMul*(a.mkt*zM + a.sec*zS + a.own*zO) + eventShock;
  const G = Math.max(1 + g, 0.4);
  const D = payDividend && G >= 0.7 ? pOpen*a.yield/4 : 0;   // float; D_cc is rounded from the opening quote
  return { pNext: pOpen*G - D, G, D };
}

const quote = p => Math.max(1, Math.round(p*100));              // float -> cc
const posValue = (msh, q) => Number(BigInt(msh)*BigInt(q)/1000n);
function buyWithCash(X, q){ const msh = Math.floor(X*1000/q); return { msh, spend: posValue(msh, q) }; } // R07

// Look-through exposure for the Spread score: weights by company, every fund unwrapped.
function exposure(positions, funds, quotes, n){
  const w = new Array(n).fill(0); let tot = 0;
  for (const p of positions){
    const f = funds[p.id];                                  // funds is keyed by every id in PARAMS.funds
    const v = posValue(p.msh, quotes[p.id]); tot += v;
    if (f){ for (let i=0;i<n;i++) w[i] += v * f.weight[i]; } else { w[p.idx] += v; }
  }
  return tot ? w.map(x => x/tot) : null;   // null = nothing invested, Spread not applicable
}
```

## 6. Event deck

Twenty-four cards, five kinds. Only `shock` cards move prices. `explain` cards narrate a move the mood chain or ledger already made and must never apply it again. Magnitudes are yearly-equivalent shocks spread over `duration` months with a **linear decay kernel**: month `k` of a duration `d` receives `(d − k) ÷ (d(d+1)/2)` of the realized shock, `k = 0 … d−1`, which sums to 1 and uses only `+ − × ÷`. The realized size is `N(mean, sd)` bounded at ±3 sd, sign-flipped with probability `flip`. Forty percent of a shock lands in the month before the headline as "town chatter" (Explorer shows the chatter; Guided shows only the headline). Drift is not pre-corrected for events; calibration (section 14) adjusts `driftM` per asset if realized total return drifts more than 0.5 points from its parameter.

**Card kinds:** `shock` (company or sector price effect), `explain` (narrates an applied mood change, inflation or contribution), `decision` (stops time, needs a choice), `lab` (controlled comparison), `overlay` (Explorer-only annotation).

**Sign convention.** Effect on an asset = its weight × the realized magnitude. E01's `BAKE −0.25` with mean +8% gives the bakery −2% in a heat wave. Every shock card carries `expectedDirection` per asset (`up`, `down`), and a content test checks that `sign(weight × mean)` matches it.

| ID | Kind | Headline | Chapter min | Assets and weight | Mean | SD | Flip | Duration | Cooldown | Season | Prerequisite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E01 | shock | Hot days bring thirsty customers | 2 | LEMN 1.0 up, BAKE −0.25 down | +8% | 6% | 0.20 | 2 | 12 | Jun to Aug | none |
| E02 | shock | Lemon deliveries arrive late | 2 | LEMN 1.0 down | −6% | 4% | 0.10 | 2 | 18 | any | none |
| E03 | shock | Flour costs more this season | 2 | BAKE 1.0 down | −6% | 4% | 0.15 | 3 | 18 | any | none |
| E04 | shock | A new oven saves energy | 2 | BAKE 1.0 up | +5% | 4% | 0.15 | 3 | 24 | any | none |
| E05 | shock | A toy trend brings new shoppers | 2 | TOYS 1.0 up | +10% | 7% | 0.25 | 3 | 18 | Oct to Dec | none |
| E06 | shock | Toy deliveries cost more | 2 | TOYS 1.0 down | −6% | 4% | 0.15 | 3 | 18 | any | none |
| E07 | shock | A new bike path opens | 2 | BIKE 1.0 up | +7% | 5% | 0.20 | 4 | 36 | Mar to Jun | none |
| E08 | shock | Rain changes weekend plans | 2 | **BIKE 1.0 down, LEMN 0.5 down, TOYS −0.3 up** | −5% | 3% | 0.10 | 1 | 12 | any | none |
| E09 | shock | Pet care bookings fill up | 2 | PAWS 1.0 up | +6% | 4% | 0.15 | 3 | 18 | any | none |
| E10 | shock | Pet care needs more helpers | 2 | PAWS 1.0 down | −4% | 3% | 0.15 | 3 | 18 | any | none |
| E11 | shock | Robo Lab announces an invention | 2 | ROBO 1.0 up | +15% | 12% | 0.30 | 3 | 24 | any | none |
| E12 | shock | Robo Lab repairs a product problem | 5 | ROBO 1.0 down | −18% | 8% | 0.00 | 6 | 36 | any | not within 12 months of E11 |
| E13 | explain | Many families spend less | 5 | all | none |  |  |  |  |  | fires at a Slump start |
| E14 | shock | Deliveries slow across town | 5 | all 1.0 down | −4% | 2% | 0.00 | 2 | 36 | any | mood is S; once per slump |
| E15 | explain | Deliveries return to their routes | 5 | all | none |  |  |  |  |  | fires at a Slump end |
| E16 | shock | Businesses share an encouraging update | 2 | one seeded shop, up | +4% | 6% | 0.35 | 2 | 12 | any | none |
| E17 | overlay | Some prices already expected the news | 2 | the card it annotates | none |  |  |  |  |  | Explorer only; attaches to any shock card |
| E18 | decision | A shop changes its payment plan | 4 | one seeded dividend payer | yield × 0.5 or 0 for 12 months |  |  | 12 | 48 | any | dividends on |
| E19 | decision | A shop closes this chapter | 5 | TOYS or ROBO | liquidation 25% to 50% of prior price |  |  |  | once per run | any | authored seed variant; see section 4 |
| E20 | decision | (variant headline, below) | 3 | none | cost from the chapter range |  |  |  | per chapter table | any | Buffer introduced |
| E21 | decision | Your goal day has arrived | 1 | none | goal amount (indexed in ch. 6) |  |  |  |  |  | at the goal's due month |
| E22 | explain | A practice contribution arrives | 4 | none | +10 coins to wallet |  |  |  | monthly |  | contributions on; ledger entry already made |
| E23 | explain | Familiar things cost a little more | 6 | none | reports the index change |  |  |  | yearly |  | inflation on; never applies it again |
| E24 | lab | Two baskets charge different fees | 6 | BASKET_A, BASKET_B | 0.2% vs 1.5% yearly |  |  |  | once |  | chapter 6 month 0 |

**E20 variants** (same mechanics, headline chosen per chapter so the cost never contradicts the goal): `backpack` "Your backpack strap broke" (chapter 3, whose goal is a bicycle); `bike` "Your bike needs a small repair" (chapter 5); `book` "A library book went missing" (chapter 6); free play rotates the three by the `|events` stream.

**Pool A** (seeded chapter slots in chapters 2 to 6): E01 to E11 and E16. Negative set for the "at least one negative" rule: E02, E03, E06, E08, E10.

**Scheduling.** Chapters use authored slots (section 3); the events stream picks one eligible card per slot, honoring season, cooldown and prerequisites, and only one `shock` card is live in any month. Free play uses a 15% monthly chance of a Pool A card plus the mood-triggered E13/E15, E12 with its cooldown, E20 at 25% a year, and E19 only when enabled. Early chapters allow at most one `decision` card per yearly step; collisions go into an ordered queue with time stopped.

**Honesty rules for cards.** A headline describes a plausible force, never a tip. Because normal monthly noise (about 8% for Lemon Lane) usually exceeds a card's effect, good news can coincide with a price fall. The Gazette shows "what the news suggested" beside "what actually happened" with the line "Lots of things move prices at once." No card has a guaranteed direction except E12, E14 and E19, which are the authored setback, common shock and permanent impairment.

**Every card also feeds the town.** `visualCue` names the activity overlay the shop shows during the year show (section 8), and `keeperLine` is the one sentence the affected shopkeeper says when tapped that year (section 9). Neither says anything about prices or the child's money.

**Card schema** (all fields required; use `null` explicitly for a field that does not apply):

```js
{ id:'E01', kind:'shock', chapterMin:2,
  headline:'Hot days bring thirsty customers',
  shortExplanation:'Thirsty people buy more lemonade. Some shoppers already expected a hot summer.',
  visualCue:'lemon-queue', accessibilityText:'A long line forms at Lemon Lane under bright sun.',
  keeperLine:{ LEMN:'Busiest week all year. I ran out of cups twice.' },
  learningPoint:'Demand can help sales. Prices may already expect it.',
  eligibleAssets:{ LEMN:1.0, BAKE:-0.25 }, expectedDirection:{ LEMN:'up', BAKE:'down' },
  season:[6,7,8], cooldownMonths:12,
  prerequisites:{ mood:['N','B'], notWithin:null, requires:null },
  regimeEffect:null, companyEffect:{ mean:0.08, sd:0.06, flip:0.20 },
  durationMonths:2, informationTiming:{ pricedIn:0.4, leadMonths:1 },
  decisionRequired:false, variants:null }
```

## 7. Plan Practice score

The score measures process at decision time, never outcomes. A child who follows a sound plan into a bad market scores the same as one who follows it into a good market. The child's main view is five stamps in the scrapbook, each with one sentence of evidence; the 0 to 100 number sits behind "Show details". It is a scenario rubric, not a rating of the child, and there is no leaderboard. Neighbors never affect it. Rubric version `PLAN1`.

### Dimensions

| Dimension | Weight | Introduced | Evidence counted | Never deducted for |
| --- | --- | --- | --- | --- |
| Goal fit | 25 | Ch 1 | At a goal-fit checkpoint, the goal money due within 12 months sits in the Soon band, or the child revised the goal (amount or date) before committing | A disappointing return afterwards |
| Readiness | 20 | Ch 3 | At the readiness checkpoint, Buffer holds at least the published minimum of the cost range | Spending the Buffer on the cost it was for |
| Spread | 20 | Ch 2 | After an intentional allocation at a spread checkpoint, look-through exposure of the invested sleeve is at most 40% in one company and 60% in one sector | Holding only cash (not applicable, not zero) |
| Follow-through | 20 | Ch 1 | At a drop or cost checkpoint, the child opens My Plan (or the Gazette's plan panel) before committing the stop | Selling, buying, or keeping the plan; any specific choice |
| Cost awareness | 15 | Ch 6 | In the fee lab, both cost cards were opened before a basket was chosen | Choosing the higher-fee basket |

The 40% and 60% bands are game teaching thresholds, stored as editable scenario constants, and never described as real-world advice. **An intentional allocation** is any `BUY`, `SELL`, `ROUTE` or `REINVEST` action committed in that stop's decision window; a stop with none is not applicable for Spread.

### Opportunity table

Every opportunity has an ID, fires at most once, and is declared in `CONTENT.chapters[n].opportunities`. Extra taps, repeated screens or more trades never add points.

| Chapter | Goal fit | Readiness | Spread | Follow-through | Cost awareness |
| --- | --- | --- | --- | --- | --- |
| 1 | GF1a month 0: Soon ≥ 30. GF1b month 9: Soon ≥ 30 or goal revised | not introduced | not introduced | FT1 month 6 scripted drop | not introduced |
| 2 | GF2 month 24 | not introduced | SP2a, SP2b, SP2c at months 0, 12, 24 | FT2x at any yearly stop after a sleeve fall of 10% or more (0 to 2 per run) | not introduced |
| 3 | GF3 month 24 | RD3 month 12: Buffer ≥ 15 | SP3a to SP3c | FT3a at the E20 cost decision; FT3x drop stops | not introduced |
| 4 | GF4 month 48 | not applicable | SP4a to SP4e yearly | FT4a at E18; FT4x drop stops | not introduced |
| 5 | GF5 month 48 | RD5 month 12: Buffer ≥ 20 | SP5a to SP5e yearly | FT5a at the slump start; FT5b at E20 if present; FT5c at E12 or E19 if present | not introduced |
| 6 | GF6 month 108 (indexed amount) | RD6 month 12: Buffer ≥ 25 | SP6a to SP6e at months 0, 24, 48, 72, 96 | FT6x drop stops | CA6 month 0 fee lab |
| Free play | yearly when due ≤ 12 months | yearly | yearly | drop stops, costs | none |

"Drop stop" means a yearly stop where the invested sleeve's value fell 10% or more since the previous stop. If a chapter produces no drop and no cost, Follow-through is not applicable and is excluded from the average.

### Computation

1. For each introduced dimension with at least one applicable opportunity, `credit = passed ÷ applicable`.
2. Score = weighted average of those credits × 100, rounded to the nearest integer. Weights renormalize over the dimensions that count.
3. Evidence is evaluated when the stop is committed, before the next tick. Future prices, unannounced costs and mood changes are never inputs.
4. Until a chapter ends, the stamps say "so far". Opportunities not yet offered are excluded, not zero. Dimensions not yet introduced show "Coming later".
5. If nothing applies yet, show "Exploring" and no number.
6. If a shock makes a goal unaffordable, revising the goal is itself a passing Goal-fit action. Poverty is never graded.
7. Market drift alone never removes Spread credit. Spread is checked only after an intentional allocation at a checkpoint.
8. Scores from different chapters, presets or presentation modes are never compared or summed. Exports carry `rubricVersion`, `scenarioId`, `presentation`.

### Stamps and badges

The five stamps read as plain observations, each with one sentence of evidence: "Goal fit: you kept 30 coins ready for your art supplies." They are drawn as paper stamps on the chapter's scrapbook page. Badges are earned once per chapter and are never required for story progress: **Checked my plan**, **Compared costs**, **Prepared for a cost**, **Explored a basket**, **Used money for my goal**.

### Abuse tests (must pass in the harness)

- Choosing any reason text or button label never changes the score.
- Opening a cost card 100 times earns the same credit as once.
- Basket plus Bakery counts Bakery exposure once at look-through weight, not as seven holdings.
- A planned withdrawal for the goal never erases earlier Readiness or Goal-fit credit.
- Two identical action sequences on two different seeds earn identical scores.
- A random-clicker bot scores lower than Ada on the same seed set, and Bo in chapter 3 can score 100.
- Neighbors' results, decorations and album completion never change the score.

## 8. Screens, states and interactions

Three primary destinations (Town, My Plan, Scrapbook) plus Home, Settings and a Grown-ups page. No login, store, friends tab, premium control or leaderboard exists, not even as an empty placeholder. Time is always stopped while any decision screen is open, while the page is hidden, and while a sheet is up. The Home screen's root element is `id="s-title"` (the fleet's title-screen id) and carries the build stamp.

### Screen table

| Screen | Above the fold | Main action | Also present |
| --- | --- | --- | --- |
| Home | Continue (chapter, year, town name), New town | Continue | Chapter list with completion marks and stamps, album count ("31 of 40 town cards"), Settings, offline-ready line, build stamp, "← All Sky Wolf games" |
| Town | Goal chip with fill bar, wallet, Jar with three bands, **net worth and this year's change**, current year and season, two rows of storefronts | Next season / Next year | Plus and minus on every shop card, the plan tray, Gazette badge, My Plan, neighbors' houses along the bottom row (tap for their plan) |
| Shop detail | Name, keeper portrait with a line, what you own, present price with ▲▼, calm or wild temperament text, sparkline | Plus / minus, More | Story so far, dividend policy, sector, cost card for funds, "collected" mark in the album |
| Trade sheet ("More") | Amount presets (1 share, 5 coins, 10 coins, half, all), resulting shares, cash before and after | Add to plan | Cancel, Explorer typed amount, reserve warning |
| Plan tray | Every queued action with its cash effect, wallet and Jar after | Next year (opens the confirm sheet) | Undo per item, Clear |
| Confirm sheet | "Your plan for this year", the queued list, wallet and Jar after, any reserve warning | **Go to year 4** | Back to town |
| Year show | The town through twelve months | Skip | ×2 speed, Watch again (after), reduced-motion strip |
| My Plan | Goal (picture, amount, due), wallet, Soon, Buffer, Saved, invested total | Set or review plan | Contribution routing (ch. 4+), Reinvest toggle, Keep my plan |
| Decision | The card, the choice, the amounts | Fund it / Change amount / Review plan / Continue | Time frozen notice, what Bo did (ch. 3+) |
| Gazette (year recap) | Headline, weather strip, busiest shop, your money story, your neighbors, one observation | Continue | Chart with table view, the year's cards, plan panel, Watch again |
| Results (chapter end) | Goal story, five stamps, money story, neighbors' notes | Save and stop | Time machine, Replay chapter, Next chapter, Show details, Choose a decoration, pick a discovery sentence |
| Time machine | Two gardens side by side, one changed control, year slider with buttons | Try one change | Labeled assumptions, Save to scrapbook |
| Scrapbook | Chapter pages (decoration, discovery, year strip, stamps, neighbors' notes) | Open a page | Album (40 town cards), Decoder, saved experiments |
| Settings | Sound, motion, text size, read-aloud, presentation level | | Export save, Import save, Grown-ups, Reset (two steps) |
| Grown-ups | What the game teaches and does not, privacy facts, omissions list, the Crypto Parrot origin in one line | | Version strings, offline status, iPhone install note |
| Debug (`?debug` or 3-second logo press) | Seed or town name, jump to month, speed ×10, mood ribbon | Run 1,000 sims | Event log with expected vs realized, force a card, toggles, neighbor ledgers, export JSON |

### Guided and Explorer

| Shows | Guided | Explorer |
| --- | --- | --- |
| Money | Whole coins ("about 24 coins") | Two decimals |
| Shares | "2 shares", "part of a share" | Exact milli-shares in details |
| Town chatter (the 40% that lands early) | Hidden | Shown as a small speech bubble the month before |
| E17 overlays ("prices already expected the news") | Hidden | Shown |
| Trade amounts | Presets and steppers | Plus typed amounts |
| Plan Practice number | Behind "Show details" | On the Results page |
| Neighbors | Coins now and this year's change | Plus percent and their three-number panel |
| Gazette chart | Linear, zero-based, with table view | Plus the "what it can buy" toggle from chapter 6 |

Nothing else differs. Neither level changes luck, honesty or scoring.

### The first 60 seconds (chapter 1 opening)

An interaction order, not a deadline. Text stays on screen until the child moves on. The market is the fixed script from section 3. The opening teaches the one trade model the whole game uses.

| Step | What happens | Copy |
| --- | --- | --- |
| 1 | Town appears with the Bakery lit and Bram the badger in the doorway; one button | "These are pretend coins. Let's see what owning a share means." → **Start exploring** |
| 2 | The goal appears: art supplies, 30 coins, due next spring; 100 coins drop into the wallet | "Some for soon. Some to try growing." |
| 3 | One button: **Put 30 in my Jar**; the Soon band fills | "Your art supplies cost 30. They stay ready in the Jar." |
| 4 | Tap the Bakery; the owner ledger divides into many tiny shares, one lights up; the plus button glows | "A share is one tiny piece of this business." |
| 5 | Tap plus once; the tray appears | "Buy 1 share for 10 coins. You keep 60 in your wallet." |
| 6 | Tap **Next season**; the confirm sheet shows the plan | "Your plan: buy 1 Bakery share for 10 coins." → **Go to summer** |
| 7 | Quiet receipt, then the season show (three months) | "You own 1 share." No confetti, no jackpot sound |
| 8 | Price 11 on the share card | "Same share. A different price." |
| 9 | Next season; price 9; My Plan offered | "Prices fell. Check when you need this money." (FT1) |

Success check for this opening: the child can point to what they own, what they spent, and what remains.

### Trade interaction (R04)

1. While time is stopped, every shop card and the Basket stall show **−** and **+** (48 px each) beside "You own". One tap queues one share at the frozen quote. The card's "You own" and the tray update at once from the draft (section 5). Explorer has a ×5 toggle on the steppers.
2. **More** opens the trade sheet for amounts in coins (5, 10, half, all) or, in Explorer, a typed number. It adds to the tray like the steppers do.
3. The **plan tray** sits above the Next button: "+2 Bakery (−20) · −1 Robo Lab (+19) · Wallet after 41 · Jar untouched". Each line has Undo; the tray has Clear. A buy that would need Jar money shows the reserve warning inline: "This would use 15 coins you set aside for your goal." Buttons: Change amount, Review plan, Continue.
4. **Next year** opens the confirm sheet: the plan in words, wallet and Jar after, and one big button with the concrete label ("Go to year 4"). Back returns to Town with the tray intact.
5. Confirm commits and ticks (section 5). Nothing executes before it. After the year show, the tray is empty and Undo is gone; the Gazette shows what happened.
6. Experiments in the time machine never touch the real run.

**During a drop:** Buy and Sell equally visible. One neutral line at the top of Town: "Prices fell. Check when you need this money." No emotion quiz, no reason prompt, no confirmation maze.

**Why this is safe:** an accidental tap changes the tray, not the ledger. One deliberate review per stop replaces six reflex confirms. The release blocker "an accidental trade" is tested against the confirm sheet, not against the steppers.

### The year show

The signature moment. It is a playback of months the engine has already committed, so it can never change a number. About 6 seconds at normal speed, ×2 available, skippable at any time with the Gazette appearing at once.

| Beat | What the child sees |
| --- | --- |
| Season | The weather overlay crossfades by month: sun, rain, snow, sun. The season label and month count tick |
| Activity | Each storefront swaps its activity overlay per month from that month's factor: busy when `G ≥ 1.02`, quiet when `G ≤ 0.98`, normal between, special when a card's `visualCue` names it. Queues form and thin. This is the business layer and says nothing about the child's money |
| News | A card slides in at its headline month and the touched shop plays its cue (the lemonade queue, the bikes in the rain, the robot mis-sorting muffins). One line, no price |
| Share cards | The pinned ledger card beside each shop ticks its price each month, ▲ blue or ▼ orange with the number. The child's share count does not move |
| Neighbors | Along the bottom, each neighbor's house shows a small coin bar that follows their net worth month by month. No order change, no faces reacting |
| Closing | The Gazette masthead drops in with the year's headline |

Reduced motion: the same twelve months as a strip of still frames, stepped by tap or at 0.4 seconds each, no pans, no weather loops. Sound, when on: soft paper rustle per month, one quiet chime at the Gazette. **Watch again** replays the show with no effect on anything.

### The Gazette (year recap)

Five short panels on one page, in this order:

1. **Masthead and headline.** "The Mainstreet Gazette, Year 3." The year's biggest card as the headline, the weather strip, and "Busiest shop this year" measured by months in the busy state, never by price.
2. **Your money.** Start of year + money added + investment result − spending = now, as a small stacked bar and as words. The goal chip's progress. Fees disclosed beneath when a fund is held.
3. **Your neighbors.** One house per introduced neighbor in fixed order: portrait, plan in five words, coins now, this year's change with ▲▼. One plain sentence each when something happened: "Cass moved her money to Robo Lab after the invention news. Robo Lab had a quiet year." Never a rank, never "beat", never a face that reacts to money.
4. **One observation.** When a card fired: "The Gazette said heat wave. Lemon Lane still had a quiet year. Lots of things move prices at once." Otherwise one of the discovery cards if due, or the plan panel.
5. **Continue**, with the chart (zero-based, linear, table view) and the year's cards behind "Show more".

### Neighbors on screen

- Introduced one per chapter (section 3). Before a neighbor is introduced, their house is not on the street.
- Fixed order everywhere: Ada, Bo, Cass, Dev. Never sorted by wealth. Never highlighted for having the most.
- Tap a house on Town: the neighbor's card with their plan in their own words, what they hold now, and "Ask Ada what she did this year" (the same plain sentence as the Gazette).
- At chapter end, Results shows one line per neighbor: what they did and what they have now. The time machine can "Try Ada's plan" or "Try Dev's plan" on the same town, labeled as another path.
- Guided shows coins and the change. Explorer adds the percent and the three-number panel.

### Time controls

`Next season` (chapter 1) commits 3 months; `Next year` commits 12. Both open the confirm sheet first. A decision card stops the advance with the month shown and "Continue year" afterwards. Speed and reduced-motion settings never change any number.

### Scrapbook and album

- **Chapter page**, made at Results: the chosen decoration, a discovery sentence (the child picks one of three offered observations about their run), the year strip (one square per year, blue up or orange down, the share-card idea from v1 kept as a picture), the five stamps, and the neighbors' closing notes.
- **Album**: 40 town cards, collected by playing. Six shop cards (first time the child owns the shop), 24 news cards (first time the card appears in a Gazette), four neighbor cards (first time met), six goal cards (first time a goal day is funded). Unseen cards show as grey outlines with their number. Some news cards appear only in some towns (E12, E19, E14), and the album says so: "Some stories only happen in some towns." No rarity, no chance in what is collectible, no deadline, no reward for completion beyond the full page.
- **Decoder** (section 9) and **saved experiments** from the time machine.

### Free play and town names

- Free play unlocks after chapter 6 (flag for chapter 3, section 2). Home shows **New town**, **Replay this town** and **Type a town name**.
- Every town has a name that is also its seed: two words from the lists in section 9 plus an optional number ("Maple Hollow 7"). Typing a friend's town name reproduces their market exactly; no data leaves the device and nothing is sent anywhere. Names are normalized (trim, single spaces, title case) before seeding.
- Presets (section 3) are chosen on the New town page; the preset page names what it changes.

### States that must exist

| State | Behavior |
| --- | --- |
| No holdings, tap minus | Minus disabled with "You do not own shares here"; plus available |
| No cash, tap plus | Tray shows Jar balance with "Use Jar money?" (reserve warning) or Continue without buying |
| Tray not empty, refresh | Tray restored from `pending`; nothing committed |
| Tray not empty, tap Gazette or Scrapbook | Allowed; the tray waits. Only Next year commits |
| Closed shop | Card shows the closing story and liquidation received; steppers absent |
| Cost cannot be funded | Options: use Jar, sell holdings (pro-rata preview), postpone goal. If nothing covers it: "Goal postponed" is recorded; no debt, no failure screen |
| Zero or near-zero wealth | Gazette and chart render; chapter still ends; future contributions still arrive |
| Neighbor's expense unmet | Their house shows "could not pay the cost" plainly; the comparison is flagged |
| Album card not yet seen | Grey outline with its number; tapping says "Not in your town yet" |
| Typed town name invalid | Characters outside letters, spaces and digits are removed; an empty result draws a random name |
| Save failed | Banner: "Playing without saving on this device." Offer Export now. Never a false "Saved" |
| Corrupt or incompatible save | Keep it in `ms:save:bad`; offer Export, Try backup, Start new. Reset is two taps apart |
| Second tab opens the same run | Read-only view with "This town is open in another tab" and a Take over button |
| Update ready | Shown on Home only, standalone only: "A new version is ready. Restart when you like." Never mid-advance, never when embedded |
| Page hidden | Time stops; on return, nothing has advanced |
| Read-aloud voice missing | Button hidden; text and icons are complete without it |
| Offline first visit (uncached) | Browser error is unavoidable; the arcade card text says "loads once online, then works offline" |
| Embedded in the portal (`SWS_EMBED`) | No service worker, no update banner, no fullscreen request; "← All Sky Wolf games" posts close |

### Accessibility targets

Controls 48 CSS px with 8 px spacing, visible focus, semantic buttons, body text about 18 px. At 200% zoom and 320 px width no money label or confirm action disappears. The fleet check widths are 412 by 915, 375 and 320, measured after the first tap, with no horizontal page overflow. A labeled vertical list is an alternative to the town scene. Up and down use blue (#0072B2) and orange (#E69F00) plus a signed number and a word. Charts have a plain-language summary and a table view. Sliders have buttons and keyboard support. `aria-live="polite"` announces decision cards and the Gazette only, never monthly prices or the year show. Sound starts off. Reduced motion replaces the year show with the still strip.

## 9. Child-facing copy

Plain financial words in labels, one visual metaphor at a time, grade 2 to 4 reading level, headlines of 12 words or fewer, explanations of two sentences or fewer. All strings live in one `STRINGS` object so they can be edited and later localized without touching logic. No sentence anywhere promises growth, calls cash lazy, treats a loss as the market taking something, or ranks a neighbor. **No dashes anywhere a player reads. Exclamation marks only on goal day and chapter end.**

### Core wording

| Topic | Say | Never say |
| --- | --- | --- |
| Share | "A share is a tiny piece of a business." | That 10 coins buys a slice of the whole shop |
| Dividend | "Some businesses share money with their owners. These payments can change or stop." | Guaranteed payouts; "harvest" as the only name |
| Price | "This is what someone would pay for a share right now." | A busy shop must have a rising price |
| Investing | "Your money might grow. It can also shrink." | Guaranteed growth; a reward for waiting |
| Spreading out | "Spread your money so one problem matters less. Outcomes are still uncertain." | Six shops remove risk; "the Basket usually wins" |
| Time | "More time gives a plan more room to grow and recover. It is not a promise." | Every drop reverses before your deadline |
| Cash | "Money for soon needs to be ready when you need it." | Cash is lazy or shameful |
| Rising prices | "The same coins may buy less when prices rise." | The bank removes coins |
| Fees | "A cost leaves less money growing for you." | All fees are the same; all fees are a trick |
| Reinvesting | "Use a payment to buy more shares." | Compounding only comes from dividends |
| Selling | "Check your goal and what changed before you decide." | Selling creates the loss; holding erases it |
| Outcomes | "A careful plan can still have a disappointing result." | Wealth proves skill |
| Spending | "Money is also for things you need and enjoy." | Never spend; reinvest every coin |
| Basket | "Six shops in one town. Spread out, but still one town." | A whole-market fund |
| Slump | "Many families are spending less this year. Most shops feel it." | Crash, panic, danger |
| Closure | "This shop is closing. Owners get 4 coins a share back. Ottilie is starting a new project." | A sad or angry shopkeeper |
| Neighbors | "Here are your neighbors' plans on the same town. Plans can grow or shrink in different years." | Winner, loser, beat, smart, silly |
| Payment plan change (E18) | "Rise & Shine is sharing less money with owners this year. The business is the same business." | The shop is failing |

### Button and label set

`Start exploring` · `Next season` · `Next year` · `Continue year` · `Go to year 4` · `Go to summer` · `More` · `Add to plan` · `Undo` · `Clear plan` · `Back to town` · `Keep my plan` · `Change my plan` · `Review my plan` · `Put 30 in my Jar` · `Fund it from my Buffer` · `Change amount` · `Postpone my goal` · `Continue` · `Skip` · `Watch again` · `Show numbers` · `Show details` · `Show more` · `Try one change` · `Try Ada's plan` · `Save and stop` · `Choose a decoration` · `Pick a discovery` · `New town` · `Replay this town` · `Type a town name` · `Grown-ups` · `← All Sky Wolf games`

No label uses "win", "beat", "profit", "streak", "bonus" or "jackpot".

### Opening, chapter and recap lines

- Chapter 1 start: "This first year is a practice run. Prices here follow a story, not a real market."
- Any drop stop: "Prices fell. Check when you need this money."
- Reserve warning: "This would use 15 coins you set aside for your goal."
- Goal day, funded: "Your art supplies are here. You planned for this!"
- Goal day, short: "Not enough yet. You can move the date, change the amount, or sell some shares. All three are allowed."
- Chapter end: "Your town is saved! Pick one decoration for the square."
- Discovery card A, once, free play: "Your investments have now earned as much as you added."
- Discovery card B, once, chapters 4 to 6: "Your investments have now earned more than a whole year of practice coins."
- Results, money panel: "You added 120. Your investments added 34. Your goal used 40."
- Gazette observation: "The Gazette said heat wave. Lemon Lane still had a quiet year. Lots of things move prices at once."
- Gazette, busiest shop: "Busiest shop this year: Toy Box, with nine busy months."
- Neighbor sentence shapes: "Ada kept her basket all year. It grew a little." · "Bo kept his jar. It stayed the same." · "Cass moved her money to Robo Lab after the invention news. Robo Lab had a quiet year." · "Dev's shop had a big year." · "Bo paid the surprise cost from his jar." · "Ada sold part of her basket to pay the cost."
- Neighbor introductions (shown once, on their first chapter): "This is Ada. She spreads her money out and leaves it alone." · "This is Bo. He keeps his money in his jar." · "This is Cass. She follows the news and moves her money when a story lands." · "This is Dev. He picks one shop he believes in and holds on."
- Discovery sentences offered at Results (the child picks one for the scrapbook; generated from the run, three at a time): "My Jar paid for the surprise." · "One shop had a bigger year than my basket." · "My basket had a bigger year than one shop." · "I checked my plan when prices fell." · "The news did not tell me what the price would do." · "I reached my goal on the day I planned." · "I moved my goal date and that was fine." · "Cass changed her mind four times this chapter." · "Bo's jar stayed exactly the same."

### Shopkeeper voices

Six keepers, each with a temperament that shows in posture and words, never in money cues. Each has three idle lines (chosen by activity state: busy, normal, quiet) and one line per card that touches their shop (`keeperLine`). Keepers talk about weather, customers, deliveries and their own work. They never mention prices, shares, the child's money, or what to buy. Starter set; extend in `STRINGS.keepers`.

| Keeper | Temperament | Busy | Normal | Quiet |
| --- | --- | --- | --- | --- |
| Bram, badger, Rise & Shine Bakery | Calm, proverbs | "Every tray gone by ten. Good day for bread." | "Slow and steady. The ovens do not hurry." | "Quiet morning. More time to get the crust right." |
| Lou, lemur, Lemon Lane | Excitable, weather watcher | "Did you SEE the sun today? Three lines out the door." | "Lemons are in. Sky is so-so. We will see." | "Rainy week. I squeezed a lot of lemons for nobody." |
| Ottilie, otter, Toy Box | Trend spotter | "Everyone wants the spinning thing this month. I cannot keep them on the shelf." | "Kids like what they like. This week it is kites." | "The spinning thing is so last month. Quiet aisles." |
| Hop, hare, Spoke Bikes | Energetic | "Bells ringing all day! Fixed eleven flats." | "Nice day for a ride. A few tune-ups." | "Rain means no rides. I oiled every chain in the shop twice." |
| Hazel, hedgehog, Paws Pet Care | Gentle | "Full house today. Eight dogs, one very grumpy cat." | "A calm day. Two baths and a nail trim." | "Only one booking. I read to the rabbit." |
| Fen, fox, Robo Lab | Dreamer | "The new gadget works! Mostly. It sorted the muffins by color." | "Tinkering. Next year is the year, you will see." | "Back to the drawing board. The robot folded itself." |

`keeperLine` examples (one per card, on the affected keeper): E01 Lou: "Busiest week all year. I ran out of cups twice." · E03 Bram: "Flour costs more this season. Same bread, thinner margins." · E07 Hop: "A new path! Riders I have never met before." · E08 Hop: "Rain all weekend. Everyone stayed in." · E11 Fen: "I invented a thing! It does a thing!" · E12 Fen: "We are fixing every one of them. Properly, this time." · E13 (all): "Folks are spending less. I understand." · E18 Bram: "We are keeping more money in the business this year. New ovens." · E19 Ottilie: "The Toy Box is closing. I am starting a puppet theater. Come see it."

### Town names

Two word lists in `CONTENT.townNames`. A name is one adjective, one noun, and an optional number 2 to 99. The random draw uses the `|cosmetic` stream of a fresh seed; the chosen name then becomes the seed. Starter lists, 24 each; extend freely, never remove (a removed word would orphan a typed town).

- Adjectives: Maple, Pebble, Willow, Sunny, Cedar, Harbor, Meadow, Clover, Brook, Lantern, Orchard, Bramble, Sparrow, Copper, Fern, Thistle, Juniper, Marigold, Heron, Birch, Hazel, Ember, Wren, Tumble
- Nouns: Hollow, Creek, Bend, Crossing, Green, Lane, Hill, Landing, Corner, Field, Ridge, Row, Square, Walk, Point, Glen, Yard, Market, Mill, Ford, Grove, Gate, Harbor, Common

### Decoder (Scrapbook)

| Game word | Real word | One line |
| --- | --- | --- |
| Share | Share (stock) | One tiny piece of a business |
| Town Basket Fund | Fund | A bundle that holds many shares at once |
| Payment | Dividend | Money a business shares with its owners |
| Reinvest | Reinvest | Use a payment to buy more shares |
| Savings Jar | Savings | Money kept ready, not invested |
| Soon | Goal savings | Money set aside for one planned thing |
| Buffer | Emergency fund | Money kept for surprise costs |
| Rising prices | Inflation | When the same things cost more over time |
| Cost card | Expense ratio | What a fund charges each year |
| Spread out | Diversify | Own different things so one problem matters less |
| Slump | Downturn | A time when many prices fall together |
| Neighbor's plan | Strategy | A rule someone follows for their money |
| Town name | Seed | The code that makes this town's years happen the same way every time |

### Grown-ups page (summary of required content)

What the game teaches and what it leaves out (no taxes, debt, bonds, leverage, real prices). The market is a simplified toy. Neighbors are computed plans, not other players, and no plan is "the right one". The score measures planning habits in this game, not real-life skill. One line of origin: "Someone asked for a game like Crypto Parrot, a paper-trading app. This is the version we would hand a child: pretend money, a pretend market, real decisions, no real risk." Privacy facts: no accounts, no data collection, no studio currency, saves only on this device, export is a file the grown-up controls. On iPhone, installing to the home screen starts a separate save; export first. Version strings for engine, content and rubric.

## 10. Art inventory and style brief

A hand-built paper town: folded cardstock storefronts, readable silhouettes, warm cream ground, ink outlines, visible paper grain, small expressive animal shopkeepers and four neighbor characters with their houses. The look is original. Do not borrow characters, faces, icon shapes, sounds or trade dress from Animal Crossing or any other game. **Stephen produces the art** (R02) following `docs/ART-BRIEF.md`; this section is the inventory, the constraints and the contract with the code.

### Three layers that must stay visually distinct

1. **Activity** (the business): customers, crates, signs, weather. Changes with the month's factor and with story cards. Says nothing about the child's money.
2. **Market value** (the share card): what the holding is worth now. A pinned ledger card beside each shop, never a pie over the building.
3. **Ownership** (the child's shares): changes only when the child commits a plan or reinvests.

A shopkeeper never looks disappointed at a sale. A closing shop shows a repurposed storefront and a keeper with a new project, not a sad character. Neighbors' faces never react to money. Decorations are chapter rewards and are visually separate from the shops, so no one reads "bigger town" as "richer".

### What is a sprite and what stays live

| Rendered sprite (WebP in `art/`) | Live (SVG, DOM, canvas) |
| --- | --- |
| Storefronts and their activity overlays, closed states | Share cards, prices, ▲▼, all numbers and text |
| Shopkeeper portraits (3 states each) | Jar with its three bands, wallet, goal chip and fill bar |
| Basket stall (normal, A and B tags) | Plan tray, confirm sheet, buttons, about 24 icons |
| Neighbor portraits and houses | Sparklines, the Gazette chart, the year strip |
| Weather overlays (3), ground and sky plates | Time machine slider and labels |
| Goal pictures (6), decorations (18), scrapbook frames (6), stamps (5) | Album grid chrome (the card faces are sprites) |
| Garden: 2 tree kinds × 5 stages, ground tile | Everything that changes with data |

### Inventory

| Asset group | Count | States or variants | Notes |
| --- | --- | --- | --- |
| Storefronts | 6 bases + 6 closed | 3 activity overlays each (busy, quiet, special) = 18 | Two rows on the Town screen; three visible per row on a 360 px phone with an obvious next row. Overlays are transparent sprites composited over the base |
| Shopkeepers | 6 portraits | neutral, talking, busy | Bram badger, Lou lemur, Ottilie otter, Hop hare, Hazel hedgehog, Fen fox. Temperament in posture, never in money cues |
| Neighbors | 4 portraits + 4 houses | portrait: neutral, talking; house: one | Ada, Bo, Cass, Dev. Four different animals from the keepers' six. Houses share one footprint so the bottom row aligns |
| Basket stall | 1 | normal, chapter 6 shows A and B tags | Displays six small shop tiles |
| Weather overlays | 3 | sun, rain, snow | Full-width transparent plates; still frames under reduced motion |
| Ground and sky | 2 | paper ground plate, sky plate | The street's backdrop |
| Goal pictures | 6 | art supplies, nature trip, bicycle, project kit, camp week, big project | Neutral, no family-income implications |
| Decoration families | 6 × 3 = 18 | plants, bunting, murals, benches, paths, pinwheels | Deterministic choices, no rarity. Pinwheels and wind-blown bunting are the Lucid Winds nod |
| Scrapbook frames | 6 | one per chapter | Text stays HTML, never baked in |
| Stamps | 5 | one per rubric dimension | Paper stamp look, used as earned marks |
| Album card backs | 1 | | The 40 card faces reuse existing sprites at small size |
| Time machine garden | 2 tree kinds × 5 stages + ground | | The only garden imagery in the product |
| Icons | about 24 | buy, sell, next, plan, scrapbook, settings, grown-ups, undo, up (▲), down (▼), jar, wallet, basket, gazette, voice, skip, replay, album, etc. | Inline SVG symbols in one `<svg><defs>` sprite. Up/down always paired with a signed number |
| PWA icons | 192 and 512 PNG, maskable | | |
| Portal thumbnail | 1 source image | | Resized by the fleet to ≤ 480 px, ≤ 150 KB |

Total rendered sprites: about 100 files. At 512 px WebP, 15 to 40 KB each, 1.5 to 2.0 MB.

### Constraints

- Sprites are WebP with alpha, 512 px on the long side, quality 80, named by slot (`art/shop-bake-open.webp`, `art/shop-bake-busy.webp`, `art/keeper-bram-talking.webp`, `art/neighbor-ada.webp`, `art/house-ada.webp`, `art/goal-bicycle.webp`, `art/deco-pinwheels-2.webp`, `art/tree-oak-3.webp`). Masters never enter the repo.
- `art/manifest.json` lists every file with its byte size and is generated by `tools/art_manifest.mjs`. `STATUS.md` reports the total. Any slot missing from the manifest renders as its labeled placeholder block, so no screen ever waits on art.
- Everything with text, numbers or state is live markup, never baked into an image. Every sprite has a text alternative; every storefront state has a one-line `accessibilityText`.
- Animation: CSS crossfades between state sprites and overlay plates, a few looping states at most, all off under `prefers-reduced-motion`, never used to convey a number.
- Colors meet 4.5:1 for text and 3:1 for essential graphics. The up/down pair is #0072B2 and #E69F00, never red/green alone.
- No CSS filters or large shadows at runtime; lighting is baked into the renders.
- Sounds are optional, start off, carry no unique information, and are short paper ticks plus a soft chapter-end chime. Nothing that sounds like a slot machine or a cash register payout.
- One Blender master scene is the style (camera, lights, paper material override, ink line). Every sprite renders through it, so the six shops and all four neighbors match. Human check per asset against "resembles a known character or brand".

### Delivery keyed to milestones

| Needed by | Assets |
| --- | --- |
| M2 first playable | Bakery base, busy and quiet overlays; Bram in three states; art-supplies goal; ground and sky plates; sun overlay |
| M3 town loop | Remaining five storefronts with busy and quiet overlays; five keepers; Basket stall; Ada, Bo and Dev portraits and houses; nature-trip and bicycle goals; one decoration family; rain overlay |
| M4 time and uncertainty | Closed storefronts for Toy Box and Robo Lab; special overlays for the shops with cued cards; Cass; snow overlay; the garden set; remaining goals; stall with A and B tags |
| M5 finish | Remaining decorations, six frames, five stamps, album card back, PWA icons, portal thumbnail source |

Opus builds against labeled placeholder blocks until each batch lands; `art/manifest.json` drives the swap.

## 11. Technical delivery

One authored `index.html` with three script sections and no build step, plus the small companion files a PWA needs and the `art/` folder. Development tools live in `tools/` and never ship. No framework, bundler, CDN, analytics, backend, remote font, studio SDK or AI service.

### Repository layout

```
index.html               <style>, <svg id="sprite">, <script id="content">, <script id="engine">, <script id="app">  (content before engine: the engine captures PARAMS and CONTENT at load)
sw.js                    cache-first service worker, versioned cache name, skipped when embedded
manifest.webmanifest     name, start_url ".", display standalone, icons
icons/icon-192.png  icons/icon-512.png
art/*.webp  art/manifest.json
HANDOFF.md  STATUS.md  README.md
docs/  (WORKLOG.md, decisions.md, FLEET.md, ART-BRIEF.md, playtest.md, calibration.md, the relay inputs)
tools/test.mjs           ledger, scoring, neighbor and fixture tests (Node, no dependencies)
tools/harness.mjs        strategy bots over many seeds; prints percentile tables; writes docs/calibration.md with --report
tools/calibrate-v1.js    the v1 script, kept for reference
tools/fixtures/*.json    golden markets and ledgers
tools/replay.html        runs the fixtures in a browser and prints PASS/FAIL per fixture
tools/replay.spec.mjs    Playwright driver for replay.html
tools/setup.sh           installs Playwright and browsers (dev only)
tools/art_manifest.mjs   regenerates art/manifest.json
tools/render_sprites.py  Blender starter for the art lane (Stephen's)
package.json             dev dependencies only (playwright); nothing here ships
```

### Inside `index.html`

- `<script id="engine">`: pure. Exposes `globalThis.ENGINE = { createMarket, createRun, validateAction, applyAction, replayPending, advanceMonth, summarizeRun, scorePlanPractice, replaySave, comparePlan, neighborLedgers, VERSION }`. No DOM, timers, `Date`, `Math.random`, `fetch` or `localStorage` references. `tools/test.mjs` greps for the banned list in section 5 and fails if any appear.
- `<script id="content">`: `PARAMS` (assets, funds, moods, neighbors), `CONTENT` (chapters, cards, presets, opportunities, townNames, flags), `STRINGS`. Data only.
- `<script id="app">`: store (`state`, `dispatch` → reducer → debounced save → render), screens, the year show player, chart renderer, persistence, PWA registration with the embed guard, the fleet embed block, settings, speech.

```js
createMarket({ engineVersion, contentVersion, scenarioId, seed })      // -> market: prices, moods, index, scheduled cards, Dev's pick
createRun({ scenarioId, marketId, presentation, initialPlan })         // -> state (checkpoint)
validateAction(draft, action)   // -> { ok:true, preview } | { ok:false, code, detail }; never mutates
applyAction(state, action)      // -> new state; pure
replayPending(checkpoint, pending) // -> draft
advanceMonth(state, market)     // -> { state, stopped:boolean, queue:[cards], show:[monthFrames] }  one tick, section 5 order
summarizeRun(state)             // -> ledger totals, Gazette panels, chart series, year strip
scorePlanPractice(state, rubric) // -> { stamps, total|null, opportunities }
replaySave(save)                // -> state rebuilt from checkpoint + committed actions
comparePlan(save, policy)       // -> a neighbor's ledger, or a one-change path, on the same market
neighborLedgers(save)           // -> the introduced neighbors' month-by-month net worth for the show and the Gazette
```

Actions are plain objects with a `seq` number: `{ seq, t, type:'BUY'|'SELL'|'JAR_IN'|'JAR_OUT'|'EARMARK'|'ROUTE'|'REINVEST'|'GOAL_REVISE'|'FUND_COST'|'POSTPONE'|'ADVANCE'|'CHOOSE_BASKET'|'DECORATE'|'DISCOVERY'|'UNDO'|'CLEAR', ... }`. A repeated `seq` is ignored.

### Save design

Versioned, with a validated checkpoint plus the pending tray. Replay from month 0 is a test tool, not the load path. Neighbors are never saved; they are recomputed from the market and their policy.

```js
{ schemaVersion:1, engineVersion:'MS1', contentVersion:'DECK3', rubricVersion:'PLAN1',
  runId:'r_8f3k2', scenarioId:'ch3', seed:'Maple Hollow 7', tick:18, lastSeq:32,
  checkpoint:{ tick:12, wallet:4120, jar:{soon:8000, buffer:1500, saved:0}, positions:[{id:'BAKE', msh:3000}], funds:{...},
               goal:{...}, totals:{...}, opportunities:[...], moodState:..., index:1.0, history:[...] },
  pending:[ {seq:31, t:12, type:'BUY', id:'BASKET', cc:1000}, ... ],
  options:{ presentation:'guided', reducedMotion:false, sound:false, textSize:1, voice:null, speed:1 },
  progress:{ completedChapters:['ch1','ch2'], decorations:{ch1:'plants-2'}, discoveries:{ch1:'...'}, scrapbook:[...],
             album:{ shops:['BAKE'], cards:['E01','E03'], neighbors:['ada','dev'], goals:['art-supplies'] },
             experiments:[...], towns:['Maple Hollow 7'] } }
```

- Keys: `ms:save` (current), `ms:save:bak` (last known good, rotated on every successful save), `ms:save:bad` (first corrupt copy, never overwritten by later failures), `ms:settings`, `ms:owner` (tab lock: random tab id plus timestamp, refreshed every 5 seconds; a stamp older than 20 seconds is stale and may be taken over; plus a `BroadcastChannel('mainstreet')` message on takeover).
- Save after every tray change, every commit and every chapter transition. Wrap every storage call in try/catch. On failure show the banner from section 8 and offer Export.
- `runId` is random, local, never transmitted, and carries no device information.
- Migrations: `while (save.schemaVersion < CURRENT) save = MIGRATE[save.schemaVersion](save)`. If `engineVersion` cannot be replayed, offer a read-only Results view and Export; never silently recompute history with a different engine.
- Export/Import: a JSON file via `<a download>` and `<input type="file">`, following the shape of the studio's shared backup module (`SWS-apps/design/backup.js`: declared keys only, a stamped file, refuses another app's file). Import validates schema, size (under 256 KB), numeric ranges and versions, and treats content strictly as data (no HTML insertion, no `eval`, no prototype keys). Import never overwrites the current save without a confirm; it lands in a new slot first.
- Browser storage can be evicted. The Grown-ups page says so and points to Export.

### PWA and service worker

- `sw.js`: cache name `mainstreet-${CONTENT_VERSION}-${ENGINE_VERSION}-${ART_VERSION}`. Precache `./`, `./index.html`, `./manifest.webmanifest`, both icons, and every file in `art/manifest.json`. Cache-first for those; everything else is not requested. On activate, delete only caches whose name starts with `mainstreet-`. The fleet's `sw_cache_scope_check.mjs` must pass.
- Registration is skipped when `window.SWS_EMBED` is true (`docs/FLEET.md`). A vendored copy has the file removed by the fleet; the root worker owns caching there.
- Serve `sw.js` with `Cache-Control: no-cache` where the host allows. The new worker waits; the page shows "A new version is ready" on Home only, standalone only, and calls `skipWaiting` on the user's tap after a save. Never reload mid-advance; never on `controllerchange` while embedded.
- The first visit needs a connection. After the install event completes, the full game must work in airplane mode; this is a release test on the Pages URL. On lucidwinds.com the same test runs against the root worker and the Grown-ups wording follows what passed.
- No `blob:` service worker or `data:` manifest.

### Privacy boundaries

Gameplay issues no API, telemetry, ad, font, image or speech requests, and no studio SDK loads. The only cross-document traffic is `postMessage` to the portal frame (`ready`, `close`), which carries no game data. Read-aloud uses `speechSynthesis` only with voices where `localService === true`; otherwise the button is hidden. Hosting logs belong to the host and are outside the game; the Grown-ups page says "this game sends nothing" and does not claim the host collects nothing.

### Performance budgets

| Measure | Target | How measured |
| --- | --- | --- |
| `index.html` size | under 250 KB uncompressed | `wc -c`, reported in `STATUS.md` |
| Total precached package | under 2 MB, art included | sum of precache files, from `art/manifest.json` |
| Market precompute, 240 months, with four neighbors | under 150 ms on the reference device | `performance.now()` in the debug panel |
| Control response | under 100 ms tap to visible change | manual with DevTools performance on the reference device |
| Year show | no frame longer than 50 ms; skippable at any frame | DevTools |
| Idle | no animation loop while the page is static | `requestAnimationFrame` only during the show |

Prices in a `Float64Array` per asset; quotes in an `Int32Array`. Canvas for the chart with `devicePixelRatio` capped at 2 and a table fallback; DOM for everything interactive; sprites as `<img>` with explicit width and height and `decoding="async"`.

### Browser support

Chrome and Edge on Android and desktop (last two major versions), Safari on iOS 16 and later, Firefox desktop current, Amazon Silk current. BigInt, `BroadcastChannel`, WebP, `speechSynthesis` and service workers are present in all of these.

## 12. Joining the Sky Wolf fleet

`docs/FLEET.md` is the full checklist; this is the contract.

- **Embed protocol, verbatim** (from `incoming/PORTAL-CONTRACT.md` in lucid-winds): post `{sws:'ready'}` at parse time and on `load`; `window.SWS_EXIT` posts `{sws:'close'}` when framed, else uses `document.referrer` and `history.back()`, else `location.replace('https://lucidwinds.com/portal/')`. A "← All Sky Wolf games" button on Home calls it.
- **Exempt by ruling R01:** no `sunbeam-sdk.js`, no `_sbCapEarn`, no `sws:'earn'` messages, no `/music-unlocks.js`. The fleet handoff lists "earn moments: none, by design" and cites the ruling. If MAINSTREET is carded as a native (non-vendored) satellite, `scripts/music_include.mjs --check` needs an allow-list entry; if vendored, it already expects none.
- **When embedded** (`?embed=1` or framed): no service worker, no update banner, no fullscreen request, no `history.back()` on any in-game control. In-game back is always an internal screen switch.
- **Deploy:** GitHub Pages from this repo (`main`, root, legacy build); the live URL is `https://stephenuffugus.github.io/Mainstreet/`. Then the fleet vendors it into `lucid-winds/satellites/mainstreet/` with `VENDORED.json`; fixes go upstream here and are re-vendored. The portal card is `beta:true` until M6 passes, with a `?v=` stamp, a thumbnail under 150 KB, and copy that says the game earns no sunbeams.
- **Fleet checks to pass before vendoring:** no horizontal overflow at 412, 375 and 320 after the first tap; `sw_cache_scope_check.mjs`; no dashes in player copy; a build stamp on `#s-title`; `{sws:'ready'}` observed in a frame.

## 13. Milestones

Seven milestones, each ending in a committed, usable artifact, an updated `STATUS.md` and ticked boxes in `docs/WORKLOG.md`. Do not start the next one until the exit conditions pass and are recorded. Commit messages name the milestone (`M1: ledger conservation tests`). Tag each pass (`m1` … `m6`, then `v1.0.0-rc1`). Ask Stephen before any step that changes a locked contract (sections 4 to 7).

| Milestone | Deliverable | Exit conditions | Commands |
| --- | --- | --- | --- |
| **M0 Reconcile** | This packet and the docs committed; repo skeleton (`index.html` with the three script sections stubbed, `sw.js`, manifest, `icons/`, `art/`, `tools/`); `tools/setup.sh` run; GitHub Pages enabled on `main`, root; `docs/calibration.md` holds the v1 table under "v1 toy model (reference only)" | Files present; `node tools/calibrate-v1.js` reproduces the v1 table; `npx playwright --version` answers; the Pages URL serves the stub | `node tools/calibrate-v1.js` · `bash tools/setup.sh` |
| **M1 Trustworthy core** | `<script id="engine">` and `<script id="content">` complete, neighbors included; `tools/test.mjs` with conservation, dividend, fund, closure, neighbor, scoring and abuse tests; golden fixtures for 8 seeds; `tools/replay.html` | All tests pass in Node; `replay.html` prints PASS in two browser engines (name them); purity grep passes; harness runs 10,000 seeds with four neighbors in under 90 s | `node tools/test.mjs` · `node tools/harness.mjs --seeds 10000` · `npx playwright test tools/replay.spec.mjs` |
| **M2 First playable** | Chapter 1 end to end: Home, Town with the Bakery, steppers and tray, confirm sheet, season show, Gazette, My Plan, Results with stamps, save and restore; placeholders where art is missing | A tester can describe what they own, what they spent and what remains without being told; refresh mid-chapter resumes exactly, tray included; the opening order in section 8 is followed | manual checklist in `docs/playtest.md` |
| **Fun gate** (R12) | Penny plays chapter 1 on the reference device, then is shown the six-shop street with Ada and Dev (built or a paper mock) and asked whether she wants to keep going | Recorded in `docs/playtest.md`: did she finish chapter 1 without a hint, what did she tap first on the street, did she ask to continue. If she does not want to continue, M3 waits while the town is fixed | observation, no recording |
| **M3 Town loop** | Chapters 2 and 3; six shops and Basket stall with look-through; keeper lines; the year show with activity overlays; Gazette with neighbors Ada, Bo and Dev; cost decision; Spread and Readiness scoring; album collecting shops and cards | Chapter 2's ending shows the child, Ada and Dev honestly on the same market; cost decision has all funding paths; Bo pays the cost from his jar in every fixture; no screen requires trading to continue | `node tools/test.mjs` · fixtures extended to chapters 2 and 3 |
| **M4 Time and uncertainty** | Chapters 4 to 6; dividends and Reinvest; contributions and routing; authored slump; Cass; E12/E19 variants; inflation index and "what it can buy"; fee lab; time machine with two gardens and the per-chapter experiments | Results panel reconciles to the cent on every fixture; every neighbor finishes lower than at least one other neighbor on at least one fixture seed; Cass makes at least one move in every chapter 5 fixture; the fee lab cannot be won by the high-fee basket on identical holdings | `node tools/test.mjs` · `node tools/harness.mjs --chapter 5 --seeds 2000` |
| **M5 Finish and access** | Scrapbook pages, decorations, discovery sentences, album complete, decoder, free play with presets and town names, Settings, Grown-ups, read-aloud with local voices, PWA install and offline, export/import, two-tab lock, recovery states, debug panel, the fleet embed block and guards, build stamp | Airplane-mode run passes after install on the Pages URL; keyboard and TalkBack complete chapter 1 and a trade; all states in section 8 reachable and tested; no overflow at 412, 375, 320 after a tap; performance budgets measured on the reference device and recorded; `art/manifest.json` total recorded | manual checklists · Lighthouse PWA audit · fleet overflow probe |
| **M6 Playtest and release candidate** | Calibration report `docs/calibration.md` from the finished engine with neighbors; playtest notes from five to eight children; fixes; known limitations; tagged `v1.0.0-rc1`; fleet handoff written per `docs/FLEET.md`; portal card as `beta:true` | No release blocker from section 15 open; calibration report complete with held-out seeds; `STATUS.md` says what shipped and what did not; the fleet handoff lists every localStorage key, the nav map, the thumbnail, and "earn moments: none" | `node tools/harness.mjs --seeds 10000 --report docs/calibration.md` |

**Order inside a milestone:** data and tests first, then logic, then screens, then art hookup, then copy pass, then `STATUS.md` and `WORKLOG.md`.

**Working rules for Opus**

- One commit per coherent step; never squash a working state into a broken one. Keep `index.html` runnable at every commit; a half-built screen hides behind a flag in `CONTENT.flags`, not behind a broken page.
- When a test fails, fix the engine or the test with a reason in `docs/decisions.md`; never loosen a tolerance to pass.
- If a locked number proves unworkable, stop, write the finding in `STATUS.md`, propose the change, and wait for Stephen.
- Art arrives in batches from Stephen. Never block on it; never draw a placeholder that could be mistaken for final art (a labeled flat block with the slot name is correct).
- No estimate of calendar time or cost appears anywhere; progress is reported as milestones passed.

## 14. Acceptance tests

Every test below is automated in `tools/test.mjs` unless marked manual. A milestone passes only when its tests pass and `STATUS.md` records the run.

### Financial correctness

| Test | Required result |
| --- | --- |
| Cash law and share law (section 5) | Hold exactly, to the cc and the msh, at every tick on every fixture and across 10,000 harness seeds |
| Buy then sell at an unchanged quote | Buy is lossless; the sell loses under 1 cc; 1,000 repeated cycles lose under 1,000 cc and never gain, at quotes of 8, 50 and 112 coins |
| Total-return convention (R06) | With noise off and events off, price compounds at the drift and price plus reinvested dividends compounds at drift plus yield, each within 0.1 points over 240 months, for every asset |
| Dividend with G = 1 | Position value after plus cash paid equals position value before, within 1 cc per holder |
| Dividend suspended (G < 0.7, or E18) | No cash paid; `P_next = P × G`; holder value equals the no-suspension total-return path within 1 cc |
| Reinvest on | Cash paid converts to shares once at the ex-dividend quote; `contributionsIn` unchanged |
| Basket internal dividends | Basket NAV path with dividends equals the sum of its holdings' total-return paths times the fee factor between rebalances; no double count |
| Fund plus stock look-through | Basket plus Bakery exposure equals Bakery weight in the fund plus the direct holding, computed once; works for BASKET_A and BASKET_B |
| Matched fee lab | Identical holdings and flows; Basket B never finishes above Basket A; the difference equals the compounded fee gap within 1 cc |
| Wallet and Jar transfers | Net worth and `contributionsIn` unchanged |
| Goal purchase | Cash falls once, `goalSpending` rises once, score unchanged by the purchase |
| Contribution month | Net worth rises by exactly the contribution before market change; the Gazette labels it as money added |
| Overspend, oversell, zero quote, negative amount | `validateAction` returns an error; draft untouched; no NaN, Infinity or negative balance |
| Pending tray | `replayPending` of N valid actions equals N sequential `applyAction`s; UNDO restores the exact prior draft; ADVANCE with one invalid pending action commits nothing |
| Closure | Trading suspended at announcement; liquidation paid once next month; holding removed; every fund redistributes without fee; no positive price floor keeps the shop alive |
| Neighbors | Each policy pays the same costs in the stated order; an unmet cost is reported, never dropped; Ada's and Bo's ledgers satisfy the cash and share laws; Dev's pick is the same for the same market id; Cass makes at most one move per stop and her moves are reproducible from the market alone; no neighbor reads the child's state (test by running them with a different child action log) |
| Zero or near-zero wealth | Results, chart and score render; no division by zero |
| Undo | Restores the exact prior draft; Undo after a commit is impossible |

### Content

- Every shock card's `sign(weight × mean)` matches its `expectedDirection` for every listed asset (E08 is the regression case).
- Every card has every schema field; `null` is explicit.
- Every E20 variant headline avoids the chapter's goal noun.
- Every keeper has three idle lines; every card touching a shop has a `keeperLine`; no keeper line contains "price", "share", "buy", "sell" or a number of coins.
- Every player-facing string in `STRINGS` contains no em or en dash; exclamation marks appear only in the goal-day and chapter-end strings.
- Both town-name lists have at least 24 entries; a name round-trips through normalization unchanged.

### Determinism

- Eight golden fixtures: chapter 1 script; chapters 2 to 6 with one seed each; free play Standard 240 months; free play Shops Can Close. Each stores the full quote series hash, the mood path, the scheduled cards, Dev's pick, and the final ledger totals for the child's fixture plan and for all four neighbors.
- `tools/replay.html` loads the same engine script and prints PASS/FAIL per fixture. Run in Node and two browser engines via Playwright. Any mismatch fails M1.
- Purity grep: the engine script contains none of `Math.random`, `Date`, `document`, `window`, `localStorage`, `fetch`, `setTimeout`, `**`, `Math.pow`, `Math.exp`, `Math.log`, `Math.sqrt`, `Math.sin`, `Math.cos`, `toFixed`, `toLocale`, `Intl`, `parseFloat`, `requestAnimationFrame`, `navigator`, `performance`, `async`, `Promise`.
- Replaying the same action log twice yields byte-identical saves.
- Animation speed, reduced motion, skipping the year show, screen switching and reading time never change any ledger value (test by driving the store with and without rendering).

### Interaction and recovery (manual, recorded in `docs/playtest.md`)

- Refresh mid-chapter with a non-empty tray, app kill, airplane mode after install, blocked storage (private mode), corrupt import file, duplicate tap on the confirm button, two tabs on one run, update arriving mid-run: each follows its section 8 state and loses no committed action.
- No market advance while the page is hidden or closed; no repeated dividend on reopen.
- Keyboard only and TalkBack: complete chapter 1, queue and clear a trade, confirm a year, open and leave every screen.
- Network panel during a full chapter after install: zero requests. In the portal frame: `{sws:'ready'}` posted on load, `{sws:'close'}` on the exit button, nothing else.
- Import of a crafted JSON with HTML strings, `__proto__` keys and oversized numbers: rejected or sanitized; nothing renders as markup.

### Calibration report (`docs/calibration.md`, M6)

Run the finished engine, with cards, contributions, neighbors and the final scoring, over at least 10,000 seeds per scenario family. Tune on one seed set; report on a held-out set. Report the engine, content and rubric versions, the seed rule, sample sizes, and execution time on the reference device. For each policy (Ada, Bo, Cass, Dev, a random clicker, a plan follower who also keeps the Buffer rules) report nominal and real ending wealth at p10, p50 and p90, the share of runs that finished below Ada, maximum drawdown, goal fulfillment rate, and the Plan Practice distribution. Keep no-contribution runs separate from contribution runs, and report investment gain from the ledger rather than final divided by initial wealth.

The report describes the toy world. It is not forced to hit v1's targets. It must show: Dev beating Ada in a meaningful share of runs and losing badly in others; Ada losing money in real terms in some runs; Bo succeeding at the chapter 3 goal in every run and trailing over 20 years in most; Cass sometimes ahead and usually behind, with her move count; the high-fee basket never beating the low-fee basket on identical holdings; and playable, understandable results under each stress preset. If any asset's realized total return is more than 0.5 points from drift plus yield after events, adjust `driftM`, record it, and rerun.

## 15. Playtest checklist and release blockers

Penny is the first tester, not the proof. The fun gate after M2 is hers alone. Follow with five to eight children across the reading range at M6, with a grown-up's permission, no recordings and no analytics. Observe first; explain nothing until you have seen where the game fails. Write anonymous notes about actions and misconceptions only. This is formative usability work, not an education study, and no public copy should claim learning outcomes from it.

### The fun gate (after M2)

| Watch for | Record |
| --- | --- |
| Finishes chapter 1 | With how many hints (target: at most one) |
| The season show | Does she watch it or skip it; does she ask to watch again |
| The six-shop street (built, or a paper mock with Ada and Dev) | What she taps first; whether she asks what Ada and Dev are doing |
| "Do you want to keep going?" | Her answer, and what she says she wants to do next |
| Unprompted | Anything she laughs at, anything she ignores |

If she does not want to continue, M3 waits while the town, the show or the keepers are fixed. Record what changed.

### Prompts and what success looks like (M6)

| Prompt or moment | Success |
| --- | --- |
| "What did you buy?" | A small piece or a share, not the whole shop or its muffins |
| "What money can you use soon?" | Points to the wallet or Jar, not the shares |
| A price drop appears | Does not tap faster, hunt for a button to hold, or sell by reflex |
| "What if this shop closes?" | Knows the Basket still holds the others and can still lose |
| A practice contribution arrives | Can say the money was added, not earned by the shares |
| Dividend screen | Describes a payment or buying more shares, not a tapping bonus |
| "What if you need your goal money now?" | Names the Jar or a planned sale as reasonable |
| Fee lab | Can say costs leave less, without calling fees a trick |
| "Who is Ada?" | A neighbor with a plan, not "the winner" or "the smart one" |
| "Whose plan was best?" | Hesitates, says it depends on the year or the goal, or names a plan with a reason; does not say "Dev, because he got the most" |
| The tray and confirm sheet | Changes her mind at least once with Undo; never surprised by what the confirm commits |
| A disappointing chapter ends | Names one decision they would keep and stops satisfied |
| Leave and come back | Finds the same saved decision and knows how to continue |
| "What would you change next time?" | Suggests a plan change, not a prediction of a winning shop |
| Town names | Understands a typed name makes the same town, and that nothing is sent anywhere |

### Release blockers

Any of these observed in two or more testers blocks release until fixed:

- [ ] Belief that losses always recover
- [ ] Belief that cash is always foolish, or that every sale is bad
- [ ] Belief that decorations, album cards or chapter progress improve returns
- [ ] Belief that more trading earns more reward
- [ ] Belief that a share buys the whole shop
- [ ] Belief that one neighbor is "the one to copy" because they had the most coins
- [ ] Any mention of real crypto, real stocks or "the game says I should buy"
- [ ] An accidental commit (the confirm sheet confirmed without intent)
- [ ] A control unreachable by keyboard or TalkBack on the main path
- [ ] A total on Results that does not reconcile with the chart or the ledger
- [ ] A routine save failure that loses a committed action or a tray

### Product gates (report counts, not conclusions)

- Most first-time testers finish the chapter 1 opening with at most one navigation hint.
- Most testers can explain ownership and the purpose of the Jar after chapter 3.
- Most testers can describe at least two neighbors' plans in their own words after chapter 5.
- Several testers voluntarily try a second chapter, a time machine experiment, or a new town.
- A delayed retest on a new town checks transfer, not memory of a button sequence.

## 16. Backlog and known limitations

Nothing here is authorized for the v1.0 build. Each item carries a hypothesis so it can be tested, not just shipped.

### Backlog, ranked

| Priority | Idea | Hypothesis and constraint |
| --- | --- | --- |
| High | Goal variety pack | More concrete goals change the stakes without new systems. Neutral goals only |
| High | Family Night | Two local households on one named town, pass-and-play, side-by-side results beside the neighbors. No account, no network |
| High | Hype Detective | Stephen's safe crypto literacy angle. An older-reader scenario that asks what gives an asset value and what information is missing. No real tokens, no predictable spike cycle, no richer visual reward for the hype asset |
| High | Beyond Town fund | Makes town concentration visible by contrast. Needs its own exposure model |
| High | Saved experiment notebook | Compare one changed assumption at a time; local only. The scrapbook's saved experiments are the seed of it |
| High | Teacher projection mode | Large text, pause anywhere, printable reflection; no roster |
| Medium | More neighbors | One or two more plans (a rebalancer, a late starter) once testers read the first four as plans, not people |
| Medium | Share card | A generic result card (town name, chapter, discovery, versions). Not player communication; needs copy and download fallbacks |
| Medium | Calendar town | A town name suggested by date; no lockout, streak or notification |
| Medium | Lending and bonds chapter | Issuer risk, repayment, rate sensitivity; never "the safe slow creature" |
| Medium | Flexible contribution schedules | Irregular income and pauses without moralizing |
| Medium | Spending, saving and giving goals | Each a legitimate use; giving never buys score |
| Medium | Orchard visual skin | Same ledger, different skin; never a second finance model |
| Medium | Localization | Centralized strings already; add number formats and text expansion |
| Low | History of shares chapter (from TRADEWIND) | Museum-style voyage story; avoid betting loops and colonial framing |
| Low | Cosmetic town styles | Paper, garden, night; never sold, random or performance-linked |
| Low | Play Store packaging | Separate policy and data-safety review first; the SWS-apps TWA pipeline is the starting point |

**Never:** sunbeams or any studio currency, music unlocks, catch-up gifts, energy meters, login bonuses, spin mechanics, prediction contests, premium signals, real-crypto funnels, purchasable cosmetics, paid parent reports, public leaderboards, a live-ticking market, neighbors ranked by wealth.

### Known limitations (to appear in the Grown-ups page and release notes)

- The market is a toy. Bounded noise, three moods and six companies cannot reproduce real market behavior; stress presets stand in for rare events.
- The Town Basket is six shops in one town, not a broad index.
- Neighbors follow fixed rules. They are not other players and not advice.
- No taxes, debt, bonds, leverage, limit orders, spreads, liquidity or real prices.
- The score measures planning habits inside this game. It does not validate real-world financial behavior.
- Browser storage can be cleared or evicted; Export is the backup. On iPhone, installing to the home screen starts a separate save.
- The first visit needs a connection; everything after that works offline.
- Read-aloud depends on voices installed on the device.

## 17. Status note, worklog and session prompt

`STATUS.md` is how a new coding session picks up where the last one stopped. Update it at the end of every session and every milestone, before the final commit. Keep it under one screen. `docs/WORKLOG.md` holds one checkbox per exit condition; tick a box only with the command and result pasted beside it.

```markdown
# STATUS, MAINSTREET
Updated: YYYY-MM-DD  ·  Current milestone: M3 Town loop  ·  Engine MS1 · Content DECK1 · Rubric PLAN1 · Art ART3

## Done since last note
- Six storefronts wired to activity overlays; Gazette with Ada, Bo and Dev; Spread scoring with look-through (tests green)

## In progress
- E20 cost decision: funding paths built, "postpone goal" path not yet saving the ledger entry

## Next three steps
1. Finish postpone path and its fixture
2. Chapter 2 ending with the three columns
3. Extend golden fixtures to chapters 2 and 3

## Tests
- node tools/test.mjs: 84 pass / 0 fail   ·  replay.html: PASS (Chromium, WebKit)   ·  harness 10,000 seeds: 61 s

## Measurements
- index.html 182 KB · precache 1.3 MB (art 1.1 MB, 61 files) · market precompute 52 ms on [reference device]

## Decisions made this session (also in docs/decisions.md)
- Pro-rata sale preview rounds shares down so the sale never exceeds the cost

## Open questions for Stephen
- none

## Known issues
- Sparkline misaligns at 320 px width
```

### Session start prompt for Opus

> Read `HANDOFF.md` fully, then `STATUS.md`, then `docs/WORKLOG.md` and find the first unticked box. Read `docs/FLEET.md` before any screen work. Work only on the current milestone. Keep the engine pure and verify the ledger before any screen work. Follow the tick order, the units and the trade model in section 5 exactly. Record every choice the packet leaves open in `docs/decisions.md`. Never mark a test passed that did not run. Art arrives from Stephen in batches; build against labeled placeholders and never wait. Update `STATUS.md` and `WORKLOG.md` before you stop.

### Relay record

| Round | Who | Output |
| --- | --- | --- |
| 1 | Claude (research team) | Concept Packet v1: landscape, seven concepts, first engine and calibration |
| 2 | Fable | Review and framing (folded into round 3 after Stephen chose to send v1 straight to Astra) |
| 3 | Astra (ChatGPT) | UI/UX, fun, scoring and accounting critique with 22 proposed changes |
| 4 | Fable | Handoff v1 (2026-10-10): reconciliation, locked contracts, milestones |
| 4½ | Fable, with Stephen's rulings | Review of v1 (six verified defects, eighteen gaps, fleet integration, art pipeline), the fun pass, this packet |
| 5 | Opus in a GitHub Codespace | The build, by milestone |
