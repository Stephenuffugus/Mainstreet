# Plan: the proud pass (chapters 3 and 5, the Clerk in every chapter, the duplicate Gazette, Home art, the small faults), 2026-10-11

Stephen, 20:05 UTC: "So what are you waiting for. I want it be able to bring this game to the person who asked for it and be proud of it." No more questions to him. This pass makes the game whole with the art that exists. Read `docs/plans/PHASE-A-MOVES-AND-STAKE-2026-10-11.md` and `docs/decisions.md` (top entries) first; rc6 is the base.

## 1. Chapters 3 and 5 get a real stake (content, DECK4)

The 35th percentile rule could not set these two (see decisions.md, phase A). The lead's numbers, by Stephen's "the two numbers are mine then":

- Chapter 3 goal: **80 → 190** (Ada funds about 50 percent of towns; a pure saver who draws a large surprise cost can miss it; the buffer move is the lesson).
- Chapter 5 goal: **150 → 800** (Ada funds about 63 percent through the authored slump; saving alone reaches 963, so holding everything in shares into the due date is the risk the pull move protects against).

Bump the content version to `DECK4`, `node tools/test.mjs --write-fixtures` once, then green. Decision entry with the harness numbers (rerun `node tools/harness.mjs --seeds 2000 --family all --heldout --due --policies ada,bo` and record Ada's funding rate at the new goals). Update the chapter 3 and 5 rows of the table in HANDOFF.md section 3 (and the DECK mention in section 5) the way the lead did for 2, 4 and 6. Fix any test or string that names 80 or 150 as the goal.

## 2. The Town Clerk in every chapter, including chapter 1

- Chapter 1's intro gets the Clerk card too, above the existing practice lines: "This first year is practice. Your art supplies cost 30 and are due in a year. You have 100 coins. We will keep 30 in the Jar for the art supplies and try growing the rest with one bakery. Prices here follow a story, not a real market." Then "Start exploring".
- Home: no Clerk.
- The Clerk card keeps its purple left border everywhere. Its eyebrow reads "The Town Clerk" until Stephen names them.

## 3. The Gazette no longer repeats the recap

In chapters with yearly stops the recap already shows prices, shares, why and your money, and the Gazette follows it at once with the same "Your money" panel. Remove the Gazette's "Your money" panel whenever a recap was shown for that advance (every advance in chapters 2 to 6 and free play). Keep the masthead and headline, the weather strip, the busiest shop, "Your neighbors" and "One thing to notice". Chapter 1's year end Gazette (after four seasons) keeps its money panel, since its recaps were seasonal.

## 4. Home gets the town

Under the hook line on Home, a strip of the six storefronts (`shop-lemn-open`, `shop-bake-open`, `shop-toys-open`, `shop-bike-open`, `shop-paws-open`, `shop-robo-open`), object fit contain, about 56 px tall each at 412 wide, wrapping to two rows at 320. Decorative: `aria-hidden`, no text. Below the chapter list nothing changes. The build stamp stays.

## 5. The small faults, all of them

- Durations: wherever the UI prints "in N months" and N is a multiple of 12 and at least 12, print "in 1 year" or "in N years"; the same in the Clerk's cold open ("due in 3 years"). One helper, used by the goal chip, the intro goal line and the cold open.
- "Your investments added −0": `signed()` prints "0" for anything that rounds to zero, never "−0".
- Results, "Pick a discovery": the offered sentence "This is what someone would pay for a share right now." becomes "A share's price is what someone would pay for it right now."
- `.btn.small` becomes 48 px tall (min-height 48). Check the overflow sweep at 412, 375 and 320 still passes; the tray head may wrap its buttons to a second line at 320, which is fine.
- Orange text: add `--down-text` (a darker orange, at least 4.5 to 1 on the cream, for example #9A4F00) and use it for text (`.down`, `.chg.down`, the Gazette and recap change lines); keep `--down` for fills, pills and strips. Dark theme is not a concern here (the game is single theme).
- Chapter 1's lone Scrapbook button: when the Town links row would hold a single link, render that link in the Town header beside Home instead of as a row of its own.
- The show caption at the first frame of a season show in chapter 1 ("Busy at the bakery. Bram says ...") is fine; leave it.

## 6. Versions, tests, evidence

- `BUILD` to `1.0.0-rc7`, sw.js `VERSION` bumped, content `DECK4`.
- `node tools/test.mjs` green after the one fixtures rewrite; `node tools/join.mjs --check` clean; `npx playwright test --project=chromium` green, with journeys added for: the duration helper ("in 3 years" on the chapter 2 intro and goal chip), the Gazette after a recap has no "Your money" heading in chapter 2 and still has it in chapter 1, Home shows six storefront images, chapter 3's cold open names 190 and chapter 5's names 800.
- Serve the folder over http (`python3 -m http.server`) for the look, since `file://` skips the art. Shoot Home, chapter 1 intro, chapter 3 intro, a chapter 2 Gazette, a Town at 320 wide with the tray open, and look at them. Name three things wrong and fix them.
- One commit on main, test counts in the message, decisions entries, the WORKLOG box, one STATUS line. Do not push.

## Out of scope

The rename, Clerk art, music, free play goals, any engine change.
