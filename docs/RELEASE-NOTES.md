# MAINSTREET release notes

## v1.0.0-rc1 (2026-10-11)

The first release candidate for the Lucid Winds arcade Test Lab (portal card `beta:true`). Engine MS1, content DECK2, rubric PLAN1.

**In this build**

- Six chapters, each one money idea and one neighbor: A Little Piece (practice year), Different Shops, Ready for Rain, Payments Can Grow, A Bumpy Journey, Two Futures.
- Free play: twenty years in a named town, seven presets (Standard, Early Storm, Late Storm, Long Quiet, Rising Prices, Savings Pay Well, Shops Can Close). Type a town's name to play the same years again.
- Six shops with voiced keepers, the Town Basket Fund (two baskets in chapter 6), a Savings Jar with Soon, Buffer and Saved bands, practice coins, dividends with Reinvest, surprise costs, one closure variant, rising prices with an indexed goal.
- Four neighbors (Ada, Bo, Cass, Dev) on the street, in the year show, in the Gazette and on Results; a fixed order, never ranked.
- Inline trading: plus and minus on every shop, a plan tray with Undo, one confirm sheet on the time advance.
- The year show, the Gazette, Results with five Plan Practice stamps, a scrapbook with chapter pages, a 40-card album, the decoder and saved experiments, the time machine with two gardens.
- Guided and Explorer presentations, text size, reduced motion, read-aloud with local voices only, export and import of saves, damaged-save recovery, a two-tab lock, offline after the first load, a debug panel (`?debug`).
- The Sky Wolf embed protocol. No sunbeams, no earn messages, no music unlocks (ruling R01).

**Not in this build** (backlog, HANDOFF section 16): the Glow Slime fad asset and any crypto-flavored content, Pro Picker Fund, share cards and replay links, a calendar scenario, Family Night, bonds, the standalone ORCHARD app, Play Store packaging.

**Calibration** (`docs/calibration.md`): six shops land within a few tenths of a point of their design total returns over 10,000 held-out free-play towns; chapter families carry their authored slumps; the four neighbors keep the intended order at the median (Ada, Cass, Dev, Bo in free play) with Bo safest and Dev widest.

**Known limitations** (also on the Grown-ups page)

- The market is a toy: six fictional shops, three moods, bounded noise. Stress presets stand in for rare events.
- The Town Basket is six shops in one town, not a broad index.
- Neighbors follow fixed rules. They are not other players and not advice.
- No taxes, debt, bonds, leverage, limit orders, spreads, liquidity or real prices.
- The score measures planning habits inside this game. It does not validate real-world financial behavior.
- Browser storage can be cleared or evicted; Export is the backup. On iPhone, installing to the home screen starts a separate save.
- The first visit needs a connection; everything after that works offline.
- Read-aloud depends on voices installed on the device.
- Art: this candidate ships with labeled placeholder blocks in every sprite slot; sprites land in batches per `docs/ART-BRIEF.md`.

**How to test it**

1. `node tools/test.mjs` (engine, 130 tests), `npx playwright test` (fixtures and journeys in Chromium and WebKit), `node tools/harness.mjs --seeds 10000 --family all --heldout`.
2. On a phone: open the Pages URL, play chapter 1, turn on airplane mode, reload, play on.
3. The playtest prompts and release blockers are in `docs/playtest.md` and HANDOFF section 15.
