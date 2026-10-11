# Plan: phase A, the moves layer and the stake (R15, R16), 2026-10-11

Stephen, 19:30 UTC: "we shouldn't need those [visuals] to make a good game ... If the foundation sucks ... the game still won't be good. We need the core mechanics and everything to feel good and play like an actual game and have it be fun." So: no art dependency in this phase. The brief this builds from is `docs/plans/TEACHING-FRAMEWORK-BRIEF-2026-10-11.md`; read its sections 1, 3, 4 and 5 first.

Two things change the game. The **stake**: chapter goals move above what saving alone can reach, so the moves are needed. The **moves layer**: every stop asks the player to make a move, the missing move (pull money toward the goal) gets its screen, and a narrator carries each chapter as an episode in text. Engine code does not change. Content numbers do change (goals only), with a DECK bump and fixtures rewritten in the same commit.

## Part 1. The stake (content block, `CONTENT.chapters`)

Rule: in chapters 2 to 6 the goal amount is the **35th percentile of Ada's net worth at the due month** across the harness seeds, rounded to a friendly number (nearest 10 below 500, nearest 50 above), and always above what saving alone yields (start coins plus every contribution, plus Jar interest where the chapter pays it). Ada's plan is already in the engine: all start coins into the Basket at month 0, contributions routed the way the neighbors route them. Use `node tools/harness.mjs` (see its flags; `--family all --heldout` with at least 2,000 seeds is enough) to read Ada's distribution per chapter at the due month. Write the percentile, the saving only total and the chosen goal into `docs/decisions.md` so the numbers are reproducible.

- Chapter 1 does not change (a practice year; the story carries it).
- Chapter 3 keeps its surprise cost; the goal rule applies to the goal alone.
- Chapter 6's goal is indexed; set the month 0 purchasing power figure by the same rule using Ada's real (deflated) net worth if the harness reports it, else nominal divided by the mean index.
- Free play goals are not touched.
- Bump the content version to `DECK3`; run `node tools/test.mjs --write-fixtures`; the engine tests must pass after. The eight fixtures change only because goals changed; say so in the decision entry.
- Check copy that hard codes a goal amount (`ST.chapterIntro`, HANDOFF quotes in tests, `tools/ui.spec.mjs` assertions like "60 coins") and update it.

If a chapter's goal cannot be met by Ada's plan in at least 60 percent of seeds under this rule, say so in the report instead of forcing it.

## Part 2. The narrator (text only)

A new voice, the **Town Clerk** (no name yet; Stephen names them; no art slot yet: render as a card with the eyebrow "The Town Clerk" in the existing `.hint` style with a distinct left border, no portrait). The Clerk may talk about money. The keepers still never do.

The Clerk speaks at four moments per chapter:

1. **Cold open** on the chapter intro screen (`chapterIntroScreen`), computed from the scenario: "Your {goal noun} costs {goal} and is due in {months} months. You have {start}{, and {contrib} coins arrive each month}. Saving alone gets you {savingOnly}. The rest has to grow." Then the chapter's move in one line (table below).
2. **The check-in** at every stop on Town (replaces the one line `hint` for chapters 2 to 6 and free play; chapter 1 keeps its rc4 guide). See Part 3.
3. **The pull card** at the goal fit checkpoints. See Part 4.
4. **The closing card** on Results: one sentence naming the move the player made, built from the stamps (goal fit passed: "You pulled money toward your goal in time."; spread passed: "You spread your money out."; both: both sentences; neither: "You kept everything where it was. Next town, try one move.").

Chapter move lines for the cold open:

| Chapter | The move, in the Clerk's words |
| --- | --- |
| 2 | "This year, try spreading out. Ada puts her coins in the Town Basket, a little of every shop. Dev picks one shop. Watch both." |
| 3 | "This year a surprise cost is coming, between {lo} and {hi} coins. Keep a buffer in the Jar so a surprise does not sell your shares." |
| 4 | "Practice coins arrive every month now, and some shops share payments with owners. Try reinvesting a payment: use it to buy more shares." |
| 5 | "A slump is somewhere in these five years. When prices fall, check your goal date before you decide. Holding and selling are both allowed." |
| 6 | "Two baskets, two costs, and prices rise a little every year. Read both cost cards before you choose." |

## Part 3. The check-in (every stop, chapters 2 to 6 and free play)

On Town, where the hint bar is, a Clerk card with up to three move rows, each a 48 px button with a one line reason computed from the state. Show only the rows whose reason is true; if none, show "Nothing needs doing this year. Keep going." with no button.

- **Spread out** (shown when the player holds one shop and nothing else, or holds nothing and has more than 40 coins in the wallet): reason "You hold {one shop | no shares}. One shop's bad year would be your whole year." Tap: queues BUY Basket with half the wallet (`{ type: 'BUY', id: 'BASKET', cc: floor(wallet / 2) }`, validated; if invalid, with 10 coins) into the tray, opens the Basket panel, and the tray's Show opens so the player sees the queued line. Undo stays available.
- **Pull toward my goal** (shown when the goal is due within 24 months, the Jar's Soon band is below the goal's nominal amount, and shares are held): reason "Your {goal noun} is {n} months away. Your Jar holds {soon} of {goal}. Prices could fall before then." Tap: opens the pull card (Part 4).
- **Keep a buffer** (chapter 3 and later, when the scenario has a life cost, the Buffer band is below the published low end, and the wallet has at least 10 coins): reason "A surprise cost could be {lo} to {hi}. Your Buffer holds {buffer}." Tap: queues `JAR_IN` to the buffer band for the smaller of the shortfall and the wallet, opens the tray.
- The existing drop line ("Prices fell. Check when you need this money.") and the card stop lines (slump, E12, closure, E18) stay above the move rows when they fire.

## Part 4. The pull card (the missing move)

A new sheet, `kind: 'pull'`, opened from the check-in, and opened automatically once at each goal fit checkpoint month of the scenario (`checkpoints.goalFit` or however the content names it; chapter 1 excluded) when shares are held and Soon is below the goal: the Clerk says "Your {goal noun} is due in {n} months. You need {need} more in the Jar. Selling shares now turns today's price into coins; keeping them means waiting to see." Three buttons:

- **Move {need} to my Jar now**: queues SELL actions pro rata across holdings at today's quotes to raise `need` (round up to whole shares per holding, never oversell), then `JAR_IN` soon for `need` (or for the sale proceeds if those are less). Everything lands in the tray, visible, undoable; nothing commits until Next year.
- **Move half of it**: same with `ceil(need / 2)`.
- **Keep growing, ask me next stop**: closes; the card returns at the next stop while the condition holds.

The recap after the advance already shows what the sale did. Add one line to the recap when a pull was committed in that period: "You moved {x} to your Jar for your {goal noun}."

## Part 5. Stamps as moves (labels only, PLAN1 unchanged)

Results and scrapbook labels: Goal fit → "Pulled money to the goal in time"; Readiness → "Kept a buffer"; Spread → "Spread out"; Follow-through → "Checked the plan when prices fell"; Cost awareness → "Read the cost card". The art slot names and the rubric keys do not change.

## Part 6. Tests, evidence, versions

- `BUILD` to `1.0.0-rc5`; sw.js `VERSION` bumped; content version `DECK3` (goals), engine `MS1` and rubric `PLAN1` unchanged.
- `node tools/test.mjs --write-fixtures` once after the goal change, then `node tools/test.mjs` green. `node tools/join.mjs --check` clean.
- `tools/ui.spec.mjs`: update goal amounts in assertions; add journeys: (1) chapter 2 cold open names the stake with the new goal and the saving only total; (2) the check-in shows Spread out when one shop is held and queues a Basket buy into the tray on tap; (3) the pull card opens at chapter 2's goal fit checkpoint for a player holding shares with an empty Jar, "Move ... to my Jar now" queues sells and a Jar in, the confirm sheet lists them, and after the advance the Jar's Soon holds the amount; (4) Results names the move. Run `npx playwright test --project=chromium`.
- `node tools/shots.mjs /tmp/ms-build/shots3 412 915`, then LOOK at the chapter 2 intro, the Town check-in, the pull card, the confirm sheet and Results. Name three wrong things and fix them.
- `docs/decisions.md` entries (the stake rule with the numbers per chapter; the Clerk; the check-in; the pull card), `docs/WORKLOG.md` box, `STATUS.md` one line. One commit on main, test counts in the message, do not push.

## Out of scope

Art, music, the rename, the narrator's name, chapter 1 beyond its rc4 guide, free play goals, any engine change.
