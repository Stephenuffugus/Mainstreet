# Plan: how am I doing, and the game reacts (rc10), 2026-10-11

Stephen's sixth note, chapter 1 at rc9: "It's honestly still pretty dry. The tutorial I couldn't hit my goal of thirty in a year. It says nothing about how well I'm really doing and it still just feels clunky and boring." Three faults, all fixable tonight without art or numbers: goal day can strand a short player; nothing on Town says how the plan is going; the game is silent and never reacts to what the player did. No engine change, no content numbers.

## 1. Goal day never strands the player

In the E21 decision (`decisionScreen`), when Soon plus wallet is short:

- If `validateAction(FUND_GOAL)` is ok through sells, the primary button reads **Sell {n} shares and buy it**, and a Clerk card above it says: "Your {goal noun} costs {need}. Your Jar holds {soon} and your wallet {wallet}. Your shares are worth {value}. Selling {n} shares at today's prices pays the rest and leaves you {m} shares." Numbers from the engine's preview steps, never recomputed in the UI.
- If even the sells cannot cover it, the Clerk says so plainly: "Your shares are worth {value}, not enough with your Jar and wallet. You can move the date, or change the amount to what you have. Both are allowed." The two options follow.
- Chapter 1 joins the pull card: at month 9 (its goal fit checkpoint), when shares are held and Soon is below 30, the pull card opens once with the chapter 1 numbers so a player who skipped the walk can fix it before goal day.
- Journey: chapter 1 with Skip the walk, buy 7 shares, no Jar, advance to goal day: the Sell button is offered with the right count, tapping it funds the goal, Results says the art supplies were bought.

## 2. "How you're doing", on Town, every chapter

A compact strip `section.doing` directly under the goal chip, three rows:

- **Goal:** "{soon} of {goal} ready · due in {duration}". Green check mark glyph (text "ready") when Soon ≥ goal.
- **Shares:** "{value} now · {signed change} since you bought" where the change is value minus net cost (sum of BUY spends minus SELL proceeds, from the engine's ledger or history; if neither carries it, keep a deterministic UI tally in the run that replays from the committed queue; never from pending). No shares: "No shares yet."
- **Moves:** the five stamps as 28 px icons (the `stamp-*` art) in a row, lit when the rubric credits them so far (`E.summarizeRun(s, m).score.stamps` on the current state; if a stamp cannot be credited mid run, show it dim with "later"). Tapping a stamp shows its one line (the labels from rc7: Pulled money to the goal in time, Kept a buffer, Spread out, Checked the plan when prices fell, Read the cost card) in a small popover that closes on the next tap. Chapter 1 shows only the stamps the chapter can earn (goal fit, follow through).
- The Clerk's one line at every stop, under the strip, computed from state, chosen in this order: Soon short with the goal due within 12 months: "Watch the Jar: {soon} of {goal} ready with {duration} to go." · One shop held and the chapter has more: "One shop carries your whole plan. Spreading out is a move." · Shares up since bought: "On track: your Jar is {ready|filling} and your shares are up {change}." · Shares down: "Your shares are down {change}. You still own them, and your Jar did not move." · Otherwise: "Steady. Nothing needs doing this stop."

## 3. The game reacts

- **After a queued move**, the Clerk card on Town replaces its text for that render with a reaction, specific to the move, then returns to the step or check-in text on the next stop. Reactions: Jar in: "{amount} in the Jar. That money is out of the market now." · Buy: "{n} shares of {shop}. {Most of|Some of|A little of} your free coins are at work; if the price dips, they dip. Your Jar is safe." (most: over two thirds of the wallet before the buy; some: over one third; otherwise a little) · Sell: "{n} shares sold at {q}. The coins are back in your wallet." · Basket buy: "The Basket holds a little of every shop. One shop's bad year matters less now."
- **When a stamp lights mid chapter** (the rubric credits it at a stop), a toast at the top of Town for 2.5 seconds, `role="status"`: the stamp art and "Stamp: {label}". Never on Results (the stamps are there already). Reduced motion: the toast appears and disappears with no animation.
- **Sound on by default** for a fresh device (`S.options.sound` default true; Settings toggle unchanged; the saved option wins on devices that chose). The audio context is still created only on the first tap, so nothing plays before interaction (the existing music journey asserts that). Add two sounds to the synthesized set: a soft paper tick when a move is queued, a two-note rise when a stamp lights. Keep the month rustle and the Gazette chime.
- **The chapter 1 stop guides** name what the player did: at month 3 begin with "You bought {n} shares last stop." (or "You bought no shares last stop. The price moved anyway."), then the existing lines, shortened by a third. The Clerk's eyebrow and border stay.

## 4. Tests, evidence, versions

- `BUILD` to `1.0.0-rc10`, sw.js `VERSION` bumped. No fixtures rewrite.
- Journeys: (1) the goal day sell path (section 1); (2) the doing strip shows "30 of 30 ready" after the walk's Jar step and the goal fit stamp lights with its toast; (3) the shares row shows the change after the first season; (4) a queued buy shows the reaction line; (5) sound defaults on for a fresh device and nothing plays before a tap (extend the music journey); (6) the Clerk's state line picks "Watch the Jar" for a short Jar with the goal due within a year.
- `node tools/test.mjs`, `npx playwright test --project=chromium`, one at a time.
- Serve over http; shoot at 412 by 915 viewport: Town after the Jar step (strip plus toast), Town after a 7 share buy (reaction), the goal day screen when short (Sell button and Clerk card), a chapter 2 Town with the doing strip. LOOK at them. Name three things wrong and fix them.
- decisions.md entries, WORKLOG box, one STATUS line. One commit on main, test counts in the message, do not push.

## Out of scope

Art, music tracks, the rename, chapter numbers, the engine.
