# Plan: the connective tissue (chapter 1 first, every chapter after), 2026-10-11

Written by the lead after playing chapter 1 screen by screen (their `tools/shots.mjs`, 412 by 915) against Stephen's first-play notes (`docs/notes/stephen-2026-10-11-first-play.md`, R14: it must explain itself).

## What the player actually gets today (the diagnosis)

Chapter 1 is built exactly as HANDOFF section 8 drew it, and that drawing is the problem. One shop, one share for 10 of 100 coins, four taps of Next season, and each tap is: a confirm sheet, a 1.5 second flash of three month frames (500 ms each), then the same Town with one sentence changed in the blue box and a number that moved by 1. Nothing says what is about to happen, nothing says what just happened or why, and the stake is one coin. A grown-up read it as "nothing to it". That is a fair reading.

Sorted against his notes:

| His words | What it is |
| --- | --- |
| everything skips really fast | fault: the show is 500 ms a month, so a season is a 1.5 s flash; no beat holds |
| no tutorial, it doesn't explain anything | fault: the guide is one sentence per stop with no why, no what next |
| can't understand what's going to happen | fault: the confirm sheet lists the plan but never the two futures |
| can't understand what is happening | fault: after the show the game lands on Town with no account of the season |
| only the bakery | by their design (chapter 1 is one shop, a practice year); stays, but the one shop must carry a real decision |
| put some into the art supplies | by design: that is the 30 coins into the Jar for the goal; the guide must say so plainly |
| next season next season, nothing to it | fault: four stops with one share at stake and no question asked at any of them |
| needs a new name | R13, Stephen with Astra; not in this plan |

The engine is right and stays untouched. Every change below is in the app block (screens, strings, timing) and in the tests. Money numbers, the chapter 1 script, fixtures and the content block do not change.

## The shape of the fix

Every stop becomes cause, choice, consequence, reflection:

1. **Before** (the confirm sheet): what could happen, in the player's own numbers.
2. **During** (the show): slow enough to read, with a caption per month that says what the shop was doing.
3. **After** (a new recap sheet): what happened, why, and what is still yours. One tap to continue. This is the connective tissue he named; it runs in every chapter, not only chapter 1.
4. **The guide** at every chapter 1 stop: two to four sentences, a reason, and the next thing to do.
5. **Chapter 1 intro and results** that tell the whole year as one story.

## A. The show: pace and captions

In `showScreen()`:

- Frame length at ×1: **1100 ms** when the scenario stops every 3 months (chapter 1), **800 ms** otherwise. ×2 halves it. The `showSpeed === 10` debug case stays at 50 ms. The end hold goes from 600 to 900 ms. The receipt hold (1100 ms) stays.
- Under the weather line, add a caption `p.show-cap` per frame: for a single-shop scenario the keeper's idle line for that month's activity (`ST.keepers[k].busy|normal|quiet`, the same source `keeperLineFor` uses), and when a card fires that month its headline is already shown in `.show-cards` (leave that). For multi-shop scenarios the caption is the busiest shop of the month by activity, "Busy at {shop}" or "A quiet month on the street" when none is busy.
- Reduced motion is unchanged (tap stepped). Skip is unchanged.

## B. The recap sheet, after every advance

New screen `recap`, rendered by `recapScreen()`. `finishShow()` calls `go('recap')` instead of `arrive()`; the recap's one button calls `arrive()`. Reduced motion follows the same path. If `S.ui.lastShow` is empty (nothing advanced) skip straight to `arrive()` as today.

Data: everything comes from the committed state `S.draft` and the market. Before values are at `S.draft.lastStopT`, after values at `S.draft.t`. Use `quoteAtStop(id)` for the two quotes. For net worth before, use `S.draft.history[lastStopT].nw` if history carries it; otherwise take a snapshot in `commitAndAdvance()` before `E.advance` into `S.ui.before = { nw, wallet, jar, pos }` and read that. Do not add `before` to `serializeRun`; on a reload mid recap, fall through to `arrive()`.

Layout (one `main.screen.recap`, same card style as the Gazette):

- `h2`: "{Period} is done" where period is the season just finished in chapter 1 ("Winter is done", season of `lastStopT + 1` month) or "Year {n} is done" otherwise.
- Card "Prices": one row per shop the player holds, plus the Basket when held. Row: "{Shop}: {q0} to {q} a share" with the blue or orange change in the existing `.chg` style. When nothing is held, show the single shop (chapter 1) or the two biggest movers, with the lead line "You hold no shares yet, so this did not change your money."
- Card "Your shares" (only when something is held): per holding "Your {n} shares of {Shop}: {v0} to {v} coins". Then "Still yours: {n} shares." The share count never changes in a show; say so when a price fell.
- Card "Why": from `S.ui.lastShow` frames, count busy and quiet months for the held shop (single shop: the bakery): "{busy} busy and {quiet} quiet months at the bakery." Then the keeper's idle line for the dominant state. If a shock card fired in the period, add its headline and `shortExplanation` as a second sentence. Never say a busy shop must rise; the spec forbids it. When the price fell with busy months, say "Busy months do not always mean a higher price. Lots of things move prices at once." (that sentence is already the Gazette's observation style).
- Card "Your money": "{nw0} to {nw}. Wallet {wallet} · Jar {jar}{goal word} · Shares {shares value}." The goal word is " for your art supplies" in chapter 1 (use `CT.goalNoun`).
- Teaching line at the bottom, by case: price rose: `ST.core.price` ("This is what someone would pay for a share right now."). Price fell: `ST.lines.dropStop` then "You still own the same {n} shares." Flat: "Prices barely moved. That happens too."
- Button `btn primary big`, id `recap-go`: "Back to town" when the next screen is Town, "Continue" when the Gazette, a decision or Results comes next (check the same conditions `arrive()` checks, in the same order).

Copy rules apply: no dashes, no exclamation marks, "from 10 to 11" in words, never an arrow glyph in text (read aloud must work).

## C. "What could happen", on the confirm sheet

In `sheet()`, `kind === 'confirm'`, after the plan words and before the Go button, add a `p.futures`:

- Holdings after the plan (from `S.draft`, which already reflects the tray): if any shares are held, "If prices rise 10 percent, your shares would be worth {v×1.1}. If they fall 10 percent, {v×0.9}. Either way you still own {n} shares{, and your Jar keeps {soon} for your {goal}}." Chapter 1 names the bakery: "If the bakery's price goes from 10 to 11, your 3 shares would be worth 33. If it goes to 9, they would be worth 27." Use the live quote, not hard coded numbers.
- No holdings: "You hold no shares, so prices will not change your money this {season|year}."
- Then one line: "Nobody knows which way prices go. That is why the money you need soon stays in the Jar." Only when the Jar has money.

## D. The chapter 1 guide

`hintBar()` stays one card, but it may now hold two to four sentences and a small eyebrow "Practice year" when `S.run.scenarioId === 'ch1'`. Add these keys to `ST.lines` and use them in `townScreen()` (tutorial steps) and `arrive()` (t = 3, 6, 9):

- step 1 (`someSoon`): "Some for soon. Some to try growing. Your art supplies cost 30, so 30 coins go in the Jar first. That money stays out of the market." Button stays "Put 30 in my Jar".
- step 3 (`jar30`): "30 coins are in the Jar for your art supplies. The other 70 are free to try growing. Tap the bakery to see what a share is."
- step 4 (`tinyPiece`): "A share is one tiny piece of this business. Each one costs 10 right now. Buy as many as you like with the plus button: 1, 3 or 7. More shares means more of your money moves with the price."
- step 5 (`buyOne`, now computed): "{n} shares for {spend} coins. {wallet} coins stay in your wallet. When you are ready, tap Next season and we will watch three months go by." Recompute on every render so the numbers follow the tray.
- t = 3 (`samePrice`): "Same share. A different price. The bakery's price went from 10 to 11, so each share you own is worth 11 now. You can buy more, sell some, or keep them. In a practice year there is no wrong choice. Try one, then tap Next season."
- t = 6 (`dropStop` for chapter 1, new key `ch1Drop`): "Prices fell, from 11 to 9. Your shares are worth less today, but you still own every one of them. Selling now turns 9 into coins. Keeping them means waiting to see. Your art supplies money is safe in the Jar either way. Check when you need this money." Button "Review my plan" stays.
- t = 9 (new key `ch1Autumn`): "Prices came part way back, from 9 to 10.5. Next stop is goal day. Your 30 coins for art supplies have waited in the Jar all year. Tap Next season to reach it."

The existing `dropStop` line stays for every other chapter.

## E. Chapter 1 intro and results

- `introScreen()`: add a third paragraph: "You will put money aside for one goal, buy a few shares of one bakery, and watch four seasons change the price. One year, one shop, no tricks."
- `resultsScreen()`, chapter 1 only: a card "Your year in prices" before "How you planned": "You bought {n} shares at 10. Spring 11, summer 9, autumn 10.5, winter 10.5. Your shares ended worth {v}. Your art supplies were bought from the Jar on goal day." Quotes from `E.quoteAt(m, 'BAKE', 3|6|9|12)`, shares and value from the ended state; if the goal was postponed, say "Your art supplies are still waiting." instead of the last sentence.

## F. Versions, tests, evidence

- `BUILD` at the top of the app block to `1.0.0-rc4`; `VERSION` in `sw.js` bumped. MS1, DECK2, PLAN1 do not change (no number changed). Fixtures must replay identically: `node tools/test.mjs` passes with no `--write-fixtures`.
- Tests: update `skipShow`, `advanceOnce`, `settle`, `playThrough` and the inline loops (around lines 118, 358, 524, 571 of `tools/ui.spec.mjs`) to tap `#recap-go` after Skip. Add journeys: (1) chapter 1 recap after the first season says "from 10 to 11" and "Still yours: 1 share."; (2) the confirm sheet shows the two futures with the live numbers; (3) the show caption exists and changes between frames; (4) the chapter 1 guide text at t = 3, 6 and 9 contains "from 10 to 11", "from 11 to 9", "from 9 to 10.5". The no-dashes and no-exclamation content tests must still pass.
- Run `npm test` and `npx playwright test --project=chromium` (WebKit is not installed on this box; CI runs it). Then `node tools/shots.mjs <dir> 412 915` and open 5-confirm, 6-show, the new recap, 7-town-spring, 8-town-drop, 11-results and LOOK at them.
- One commit on `main` of this repo, test counts in the message, a `docs/decisions.md` entry (R14 build), the WORKLOG box. Do not push; the lead reviews the pictures first, then pushes and re-vendors into the arcade.

## Out of scope today

The rename (R13), any art, any engine or content number, chapters 2 to 6 guide text beyond what the recap and confirm futures give them, the Spent box, music.
