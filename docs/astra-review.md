# Kids Investing Game: Astra review and Fable build handoff

**Date:** October 10, 2026  
**Prepared for:** Jessie, Stephen, and the Fable design team  
**Input:** Kids Investing Game — Concept Packet v1 (for Fable).md  
**Next step:** Fable reconciles this review with the source packet and writes the final `HANDOFF.md` for the Opus coding agent.

**Status:** Research and design review, not a built or playtested game. The original engine, calibration code, raw simulation output, Reddit request, and playable prototype were not supplied. Numerical targets below are proposed implementation requirements, not measured product results. This document is a separate review; it preserves the original packet.

## 1. Recommendation

Build **one cozy town investing game**, with short story chapters, a living street, meaningful goals, and a time machine that lets children compare plans. Keep MAINSTREET as the internal working title until name clearance. Describe the experience as: **“Own little pieces of a town. Make a plan. See what time changes.”**

The strongest opportunity is the combination of a readable physical world and a fair comparison tool. Offline access alone is not a unique selling point. The child should understand what they own and why a choice mattered without needing a brokerage screen or a quiz between every action.

Keep the original commitments: free; no ads, purchases, real money, real crypto, player communication, accounts, or login; a fictional market; local saves; offline gameplay; vanilla HTML/CSS/JS with the necessary PWA companions. Preserve the anti-gambling restrictions. Do not introduce monetization or social infrastructure to solve engagement.

**The central correction:** teach “match your money to your goal and understand uncertainty,” not “always stay invested.” Spending on a planned goal, holding cash for soon, and selling a damaged business can all be sensible. A pleasant game can acknowledge this without frightening children. Investor.gov explicitly connects risk choices to time horizon and says diversification does not eliminate losses. [S4, S5]

### Launch recommendation

| Decision | Recommended default | Reason |
| --- | --- | --- |
| Product structure | One MAINSTREET game | Avoid fragmented onboarding, save formats, art, and testing |
| First prototype | One playable MAINSTREET chapter with an embedded Orchard comparison | Tests the actual product loop; reuse Orchard as a visual, not another launch |
| Primary audience | Ages 8 to 11; supported play for ages 7+ | A manageable reading and number range; validate with children rather than age assumptions |
| Presentation levels | Guided and Explorer | Change information density, not luck or honesty; no birth date collection |
| Launch modes | Six short chapters, then free play | Clear onboarding and an end worth reaching |
| Simulation time | Monthly internally; yearly decisions in most chapters | Preserve dividends and compounding without 240 decisions |
| Long run | Optional 20-year free play/time machine | Not the required first session |
| Daily mode | Later, optional scenario shelf with permanent archive | No daily obligation or limited attempts |
| Family mode | Later; informal co-play already works | Do not double the launch save and interaction complexity |
| First platform | Lucid Winds arcade PWA | Validate play before adding store packaging work |
| Distribution promise | Offline after successful initial download/cache | A first visit to an uncached website cannot work without connectivity |

The packet has conflicting session descriptions: one year in five minutes, versus twenty years with monthly animation and many pauses. Replace these with explicit chapter lengths. Target 4 to 7 minutes for early chapters and 8 to 12 minutes for the full 20-year run, measured in playtests. These are pacing goals, never timers.

## 2. What changes, and why

P0 means resolve before implementation of the affected mechanic. P1 means needed for the intended public launch. P2 means later experimentation.

| ID | Priority | Source proposal | Review decision and reason |
| --- | --- | --- | --- |
| C01 | P0 | Holding through crashes earns virtue points | Score plan review and goal fit. Recovery is not assured; selling can be appropriate |
| C02 | P0 | Keep a thumb on a rope; lifting sells | Cut. Accidental movement must not cause a trade; endurance is not investing judgment |
| C03 | P0 | Patience = percentage invested | Replace. This punishes emergency reserves and near-term goals |
| C04 | P0 | Inflation and drawdown contribute 20 points | Remove outcome points from the habit total; show them separately |
| C05 | P0 | Portfolio doubling triggers celebration | Do not celebrate raw return thresholds. Deposits can double balances without investment growth |
| C06 | P0 | Town Fund represents broad diversification | Explain that six local shops remain a concentrated stock basket; not a whole-market fund |
| C07 | P0 | Pro Picker vs Town Fund teaches fees | Separate fees from stock selection using identical holdings and different expenses |
| C08 | P0 | Every trade costs at least one coin | Remove default trade fees. A five-coin trade otherwise pays 20%; use an explicit fee lab later |
| C09 | P0 | Dividends appear as profit coins | Account for distributions once, with matching price/NAV adjustments; no free-money exploit |
| C10 | P0 | Guaranteed piggy rate below inflation | Use scenario-specific saving and inflation rates; do not make cash lose every lesson |
| C11 | P0 | Fad has shrinking fundamentals and predictable collapse | Defer from the youngest mode; avoid a repeatable pump-then-crash timing game |
| C12 | P0 | “10,000 seeds” and “under 2 ms” asserted | Treat as unverified until code, parameters, logs, and device measurements exist |
| C13 | P0 | Arithmetic restrictions guarantee identical browsers | Require explicit rounding, PRNG fixtures, stable ordering, and cross-browser replay tests |
| C14 | P0 | Every news item interrupts play | Batch background events into a digest; reserve interruptions for planned decisions |
| C15 | P0 | Ghost proves holding was better | Compare symmetric alternatives, including cases where holding loses |
| C16 | P0 | Offline TTS assumed | Use only verified local voices; text and icons remain complete without speech |
| C17 | P0 | Corrupt save means start fresh | Preserve recoverable data and offer backup recovery/export before reset |
| C18 | P1 | Four rival bots | Launch with two neutral strategy comparisons; no shaming character names |
| C19 | P1 | Growth through town upgrades | Separate cosmetic chapter progress from portfolio returns and business performance |
| C20 | P1 | Many metaphors per concept | Introduce plain financial words beside one consistent visual metaphor |
| C21 | P1 | 40 event cards | Begin with 24 authored cards and controlled chapter schedules |
| C22 | P2 | Standalone Orchard, daily mode, family mode | Reuse the core engine after the main loop passes playtests |

These changes preserve the intent of the non-negotiables. The packet also embeds claims such as a spread-out fund “usually wins over 20 years.” Fable should ask Stephen to approve replacing that literal wording with: **“Diversification reduces dependence on one investment; outcomes remain uncertain.”** Do not silently treat the original numerical win rate as a law of investing.

## 3. Evidence and competitor corrections

This is a focused desk review of primary pages, not a hands-on audit of every competitor. Do not publish the packet’s “nothing else exists” or “only close competitor” claims.

| Reference | Verified finding | Design implication |
| --- | --- | --- |
| Crypto Parrot | Official pages describe simulated crypto trading with $100,000 and rewards, including real crypto. [S1] | Retain pretend-money decisions and consequences; omit the adult speculative ecosystem |
| InvestQuest, Chad Arnett | Current App Store description says ages 6 to 12, lessons, quizzes, and eight **real** companies. Version notes advertise offline play, private leagues, cloud backup, and an index fund. These are publisher claims, not independently tested features. [S2] | Correct “eight fictional companies.” Differentiate through embodied play, goals, and fair experiments |
| NGPF STAX | Official teaching material describes twenty years of decisions in twenty minutes and a competitive group option. [S3] | Compressed time is established; our differentiation must be age-appropriate agency and clarity |
| CFPB framework | Middle childhood includes developing financial habits alongside executive function and basic knowledge. [S6] | Use planning, comparing, waiting, and reflection inside play; do not conclude younger children cannot learn concepts |
| FCA experiment | An adult experiment with over 9,000 people found that some engagement features increased trading frequency/risk. [S7] | Supports caution around trading rewards; does not prove that all animation or all children's game rewards are harmful |

InvestQuest is also used by other products, including SIFMA's SMG InvestQuest. Always identify the developer and exact listing. No review counts, download figures, age suitability claims, or supposed gaps should be inferred from a name alone.

The Reddit request is useful evidence of interest in a simulator, not yet evidence that the requester wants a children's learning game. Later ask the requester what they enjoyed: experiments, changing prices, competition, or learning. Do not reposition the children's game as crypto practice solely because of that request.

## 4. Learning promises and language

| Topic | Child-facing wording | Guard against |
| --- | --- | --- |
| Share | “A share is a tiny piece of a business.” | A literal fraction of an entire shop sold for ten coins |
| Dividends | “Some businesses share money with owners. These payments can change or stop.” | All profit is distributed; payouts are guaranteed |
| Price | “This is what someone would pay for a share now.” | A busy shop must have a rising share price |
| Investing | “You might grow your money. You can also lose some.” | Guaranteed growth or a fixed reward for waiting |
| Diversification | “Spread your money so one problem matters less.” | Six shops eliminate risk |
| Time | “More time gives a plan more room to grow and recover. It is not a promise.” | Every crash reverses before your deadline |
| Cash | “Money for soon needs to be ready when you need it.” | Cash is lazy or shameful |
| Inflation | “The same coins may buy less when prices rise.” | The bank literally removes coins because of inflation |
| Fees | “A cost can leave less money growing for you.” | All trading services charge the same commission |
| Reinvestment | “Use a payment to buy more shares.” | Compound growth only comes from dividends |
| Selling | “Check your goal and what changed before deciding.” | Realizing a loss creates the loss or holding erases it |
| Outcomes | “A careful plan can have a disappointing result.” | Wealth proves skill or moral worth |
| Spending | “Money is also for things you need and enjoy.” | Never spend; reinvest every coin forever |

Use “share” in the action label and introduce “slice” once as a visual explanation. Use “dividend” with a short explanation rather than permanently renaming it “harvest.” Reserve Orchard imagery for the time machine. Avoid pretending bonds are simply slower stocks; bonds need their own later lesson on lending, repayment, interest, and risk.

No chapter assumes an allowance, a two-parent household, home ownership, or inherited wealth. Say “practice coins added by the game.” Offer art supplies, a bicycle, a nature trip, or an invented future project as goals; none implies family income or worth. Do not ask children to enter real savings, age, school, name, or family finances.

## 5. Make the town worth visiting

### World and art direction

Use a hand-built paper town: folded storefronts, readable silhouettes, warm cream ground, ink outlines, gentle texture, and small expressive animal shopkeepers. This supports an original identity and cheap inline SVG assets. Avoid copying Animal Crossing characters, faces, icons, sounds, or distinctive trade dress.

Begin with a two-row street of large tappable shops, not an isometric map that requires precision panning. On narrow phones show three storefronts plus an obvious next row/list. The Town Basket Fund appears as a market stall displaying six shop tiles. The child's ownership appears as a small ledger card pinned beside each shop, not a giant pie claiming ownership of the whole business.

Business activity, market price, and the child's ownership are different layers:

1. **Activity:** customers, supply crates, service signs, or weather change with story events.
2. **Market value:** the share card shows what the holding is worth now.
3. **Ownership:** the number of shares changes only when the child trades or reinvests.

A shopkeeper never looks disappointed because the child sells. A storefront can close without an animal character suffering; the character can explain a new job or project. Town decorations are earned through chapter completion and exploration regardless of returns.

### Fun between decisions

| Interaction | Why children might enjoy it | Financial effect |
| --- | --- | --- |
| Tap a shopkeeper | A short visual joke or explanation, such as a bakery robot mis-sorting muffins | None |
| Inspect a delivery | See a supply story unfold with clear before/after pictures | None; reveals public story context |
| Decorate a completed chapter's town square | Choose plants, bunting, murals, benches, or paths | None; deterministic choices, no rarity |
| Assemble a scrapbook spread | Choose a chapter picture and a sentence about a discovery | None; local progress only |
| Compare two plans in the time machine | Discover a surprising difference with one changed choice | Separate experiment; never overwrites the run |
| Choose a personal goal | See something concrete become possible | Spending recorded honestly, not treated as failure |

No tapping for coins, servicing shops for dividends, collection deadlines, idle earnings while absent, or character happiness tied to purchase volume. Those would turn passive ownership into chores and change the learning claim.

Give every session a satisfying stopping point: a completed chapter page, one earned decoration choice, and “Your town is saved.” No return countdown or daily streak. A child who leaves for a month returns to the same decision.

## 6. The first 60 seconds

This is an interaction order, not a deadline. All text can remain on screen indefinitely. The opening scenario is clearly marked **practice**, with a scripted market path; do not disguise its favorable outcome as random market evidence.

| Approximate moment | Screen and action | Copy/feedback |
| --- | --- | --- |
| 0 to 8 seconds | Town appears; one “Start exploring” button | “These are pretend coins. Let's see what owning a share means.” |
| 8 to 18 | Child chooses a picture goal; game shows 100 practice coins | “Some for soon. Some to try growing.” |
| 18 to 30 | Tap Bakery; an owner ledger divides into many tiny shares, one highlighted | “A share is one tiny piece of this business.” |
| 30 to 42 | Buy preview: spend 10; receive one share; 90 stays in wallet | “Buy 1 share for 10 coins.” |
| 42 to 50 | Quiet receipt; ownership card stays visible | “You own 1 share.” No trade confetti or jackpot sound |
| 50 to 60 | Tap “See next season”; observe activity and a scripted price change | “Same share. A different price.” |

Then demonstrate a price fall before asking for another investment. Allow children to replay the explanation or continue. The first full chapter introduces the savings jar and a small goal before adding multiple shops. Do not front-load funds, dividends, inflation, fees, and a storm.

Success criterion for this opening: a child can point to what they own, what they spent, and what remains. If they think they bought the whole shop or must keep tapping to earn, revise the visuals.

## 7. UI specification

### Navigation and screen hierarchy

Three primary destinations: **Town**, **My Plan**, **Scrapbook**. A labeled settings button includes sound, motion, text, local read-aloud availability, and grown-up information. No login screen, store, friends tab, premium controls, or empty leaderboard.

| Screen | Above the fold | Main action | Secondary information |
| --- | --- | --- | --- |
| Home | Continue with chapter/year; new exploration | Continue | Chapters, settings, brief offline readiness status |
| Town | Goal chip, wallet amount, current year, storefronts | Next season/year | Tap shop; compact digest; pause is implicit at decisions |
| My Plan | Goal/deadline; wallet/jar/investments shown separately | Set or review plan | Upcoming known costs; planned contributions |
| Shop detail | Name, ownership, present price, risk description | Buy shares / Sell shares | Story, dividend policy, sector, optional history |
| Trade sheet | Amount, fees, resulting balance and ownership | Confirm exact action | Cancel; details; reserve warning |
| Year recap | What changed, money added, growth/loss, goal progress | Continue | One explanation, chart, optional comparison |
| Results | Goal story, habit cards, actual financial outcome | Save chapter and stop | Time machine, replay, next chapter |
| Scrapbook | Chapters and chosen decorations | Open discovery | Decoder and local strategy comparisons |

Wallet and savings jar are separate balances but both are cash for net-worth accounting. Rename “Piggy Bank” to **Savings Jar** and use earmarks inside it for “Soon” and “Buffer”; avoid four nearly identical cash containers.

### Trade interaction

1. Open a shop or fund detail card while simulation time is stopped.
2. Choose Buy or Sell, then a coin amount through presets and plus/minus. Explorer also permits direct numeric entry. Never require a drag.
3. Preview cash spent/received, fee if any, shares, and balances afterward.
4. Confirm with a concrete button: “Buy 2 shares for 20 coins,” or “Sell shares for about 20 coins.” Final execution uses the displayed frozen quote.
5. Show a quiet receipt and an Undo action until the next time advance. Undo reverts the entire transaction and its dependent same-tick changes; it cannot reveal the future and rewind a real run.

A fractional share is available when a whole share is unaffordable. The guided label can say “part of a share”; the details show the exact stored quantity. Rounding must never permit a purchase larger than available cash.

**During a drop:** keep Buy and Sell equally available. A neutral line may say, “Prices fell. Check when you need this money.” An optional “Review my plan” opens the goal and reserve. Do not require children to explain their emotions, answer a quiz, hold a button, or pass a confirmation labyrinth. No score benefit for selecting “I'm calm.”

**Reserve warning:** “This would use 15 coins you set aside for your goal.” Offer “Change amount,” “Review plan,” and “Continue.” It is informative, not a prohibition. The game cannot know whether the child's priorities changed.

**Empty/edge states:** no holdings means Sell explains “You do not own shares here.” No cash offers view jar or continue without buying. A closed company cannot be bought. A depleted account still reaches the chapter recap and receives future scheduled practice coins; no permanent bankruptcy screen.

### Readability and access

Target 48 CSS px controls with spacing, visible keyboard focus, semantic buttons, and approximately 18 px body text. At 200% zoom and 320 px width, no money label or confirmation action may disappear. Use a labeled vertical list as an alternative to the town scene.

Use blue/orange changes plus signed values and words. Do not assume those colors alone solve color-vision differences. Normal text should reach 4.5:1 contrast; controls and essential graphics need suitable non-text contrast. A chart has a plain-language summary and a table equivalent. A slider has buttons and keyboard support. These are product targets; WCAG's minimum target-size rule is 24 CSS px with exceptions, not the proposed 48 px house standard. [S12, S13]

Read-aloud is optional, user-triggered, and limited to local voices verified on target devices. Never silently fall back to a remote voice. If none exists, retain complete text and pictorial instructions. Test with TalkBack; do not announce 240 changing monthly values through `aria-live`. [S9]

Reduced motion replaces pans, weather loops, and fast-forward animation with still steps. Sound begins off or follows an explicit setting, never conveys unique information, and can be muted independently of read-aloud. Time stops when the page is hidden, a modal opens, focus is lost during a decision, or narration needs a pause.

## 8. Chapters, progression, and replay

### Recommended six-chapter launch

Each chapter introduces at most one major new financial distinction. Once an explanation has been seen, replay lets the child skip it. Illustrative comparisons are labeled separately from variable scenarios.

| Chapter | Length in game | Main question | New interaction | Required ending |
| --- | --- | --- | --- | --- |
| 1. A Little Piece | 1 year, four season stops | What do I own when I buy? | Bakery share, wallet, small soon-goal, Savings Jar | Show same share at two prices and a planned purchase |
| 2. Different Shops | 3 years, annual stops | What if one shop has trouble? | Six shops and Town Basket Fund | Compare equal starting sums, a single shop and basket; either can finish higher |
| 3. Ready for Rain | 3 years | Which money needs to stay ready? | Buffer earmark and a modest unexpected cost | Cash can serve a successful purpose, including in a weak market |
| 4. Payments Can Grow | 5 years | What changes when payments are reinvested? | Dividends, optional reinvestment, regular practice contributions | Separate contributions, distributions, and market changes |
| 5. A Bumpy Journey | 5 years | What changed: price, business, or my goal? | Market downturn and distinct business-damage story | Compare choices without guaranteeing recovery or condemning a sale |
| 6. Two Futures | 10 years | What can a plan buy, after costs and price changes? | Purchasing-power view and matched fee experiment | Reach a goal, reflect, then unlock 20-year free play |

Guided chapters use authored event slots with multiple eligible seeded outcomes. Chapter 1 alone uses a fixed demonstration. Later chapters must include good and bad outcomes across a documented test seed set. Do not stealth-select a recovery seed after a child loses.

### Three connected loops

- **Decision loop:** notice a change, inspect a holding or goal, optionally adjust, then advance time. “Keep my plan” is always a valid action.
- **Chapter loop:** set a purpose, encounter a few changes, review the result, choose a decoration and discovery page.
- **Replay loop:** change one plan element in a labeled experiment or begin a new town. Replays do not produce prestige ranks or farmable currency.

Optional free play enables all six shops, the basket, savings, contribution settings, and inflation. Keep Glow Slime, bonds, leverage, crypto names, real prices, and active-fund selection out of this launch surface.

### Goals without coercion

Every goal stores an amount, a deadline, and whether that amount grows with the scenario's price index. A goal has a concrete illustration, not just “get richer.” A goal purchase reduces cash and increases the recorded fulfilled-goal ledger; it is not subtracted from a habit score or hidden as poor returns.

Use a small authored expense with a published possible range for each relevant scenario. Reveal the specific event only when it occurs. Do not tie its size to the child's balance, punish reserve owners with bigger bills, or introduce an unavoidable crisis solely to enforce a moral. An unfunded cost opens explicit funding choices. If it cannot be funded, record “goal postponed” and continue without debt or humiliation.

A cash-only child can complete a short-horizon scenario well. A heavily invested child may finish wealthier but miss a near-term goal. Both results need to be visible without assigning the child a permanent identity.

## 9. A fair habit score

Keep a 0 to 100 **Plan Practice** score to honor the original request for process scoring, but make the child's primary view five descriptive cards. It is a scenario rubric, not a financial aptitude rating, investment recommendation, or measurement of bravery. Display the numeric total in details only; never create a leaderboard.

### Proposed rubric for Fable to lock

| Dimension | Weight | Evidence measured | Explicit exclusion |
| --- | --- | --- | --- |
| Goal fit | 25 | At scheduled decisions, child allocates money needed by the scenario deadline to the scenario's suitable pool or revises the goal before committing | No deduction merely because subsequent returns disappoint |
| Readiness | 20 | Child reviews the disclosed cost range and makes an affordable buffer plan at the designated checkpoint | No deduction for using that buffer for its intended purpose |
| Spread | 20 | For the amount intentionally invested, look-through exposure stays within the chapter's disclosed company/sector concentration bands after a decision | Saving-only appropriate scenarios are not treated as undiversified investments |
| Follow-through | 20 | Child reviews the existing plan and confirms or revises it at scheduled checkpoints | No requirement to buy, avoid all sales, or select a favored reason |
| Cost awareness | 15 | Child compares the displayed costs and sees the net amount before committing in the cost chapter | No reward for choosing a branded “good” fund without examining costs |

**Scoring implementation rules:**

1. Every chapter defines a finite set of criterion opportunities, declared in its content schema. Each opportunity has an ID and can count once. Extra taps, trades, or reason prompts never create more points.
2. Evaluate decision-time evidence before the next market tick. Do not grade knowledge of a future regime, unannounced bill, or future price.
3. For an introduced dimension, `dimensionCredit = passedApplicableOpportunities / applicableOpportunities`. Score is the weighted average of introduced, applicable dimensions, rounded to the nearest integer. If none apply, show “Exploring” and no numeric score.
4. Missing completed opportunities earn zero; opportunities not yet offered are excluded. Show “so far” until the chapter ends. Unintroduced dimensions appear as “Coming later,” never zero.
5. Goal-fit and buffer conditions use scenario parameters visible before the decision. Example: a 30-coin goal due within a year is covered by 30 in its savings earmark. If a plan becomes unaffordable after a shock, offer revising timing/amount as a valid opportunity; do not grade poverty.
6. For a long-term invested sleeve in chapters 2+, prototype concentration bands are no more than 40% in one company and 60% in one sector. These are **game teaching thresholds**, not real-world portfolio advice. Fable must test whether these bands are understandable and retain them as editable scenario constants.
7. Spread uses fund look-through, not wrapper count. Holding the basket plus Bakery increases Bakery exposure. Market drift alone does not remove earned credit or force trading; grade after intentional allocations at review points. Explain changes to concentration without creating constant rebalance chores.
8. Follow-through is deliberately modest evidence of engagement, not proof of good judgment. Do not claim the score validates real financial behavior. Learning transfer requires the separate playtest questions below.
9. No points depend on absolute wealth, beating inflation, the number of trades, maximum drawdown, holding a failing company, or always reinvesting.
10. Totals from different chapters/difficulties are not comparable. Include rubric version, scenario ID, and presentation mode in exports.

Badges become concrete observations: “Checked my plan,” “Compared costs,” “Prepared for a cost,” “Explored a basket,” and “Used money for my goal.” Each can be earned once per chapter and none is a prerequisite for story completion. Replace “Steady Oak: never sold” and “Slow & Steady: few trades.”

**Rubric abuse tests:** selecting a “good” reason cannot change the score; opening a cost card 100 times earns the same credit as once; fund plus underlying stock is not counted as seven independent investments; a planned withdrawal does not erase prior readiness; two equal decisions under different future returns earn equal process credit.

## 10. Results and the time machine

### The end-of-year screen

Use three short panels:

1. **Your goal:** ready, progressing, revised, or postponed, without red failure language.
2. **Your money:** starting value + added practice coins + investment result − spending = ending value. Fees are included in investment result and disclosed beneath it; never subtract them twice.
3. **One discovery:** an observation tied to this run, followed by an optional question: “Did you need this money soon?”

Show cash and investments together as net worth, but also expose each separately. Put exact figures behind “Show numbers” in Guided mode. Stock market loss is not described as money “stolen” by the market.

### Signature time-machine interaction

A scrapbook unfolds into two gardens representing **the same starting money, contributions, expenses, and market path**. Change one control: contribution start, contribution amount, reinvestment, reserve choice, or fee. Label any assumption that differs. The child can jump between years or use a slider with buttons. A short animation is optional and skippable.

The emotional moment is seeing where money came from and what it can do: “You added 120 coins. Your investments added 34. Your goal used 40.” The celebration belongs to finishing the chapter and understanding a comparison, not a profitable trade or doubling milestone.

Give “Start earlier” two explicitly different experiments:

- Same periodic contribution, earlier start: more time **and more contributed money**.
- Same total contributed, different timing: timing comparison with its own assumptions.

Never imply the first isolates time alone. Likewise, a reinvest-versus-spend comparison must show the value already spent or distributed; the spender did not simply make money disappear.

### Counterfactual policy

Launch benchmarks: a fixed-plan Town Basket strategy and a Savings Jar strategy. Show each as “Another plan,” not a rival whose personality predicts success. A plan can lose in some seeds.

Both benchmarks face the same external coin additions, costs, goal purchases, rates, and public information. Specify funding priority for benchmark expenses: available wallet, earmarked savings, then pro-rata liquidation if permitted. If a benchmark cannot fund an expense, show the unmet amount and flag the comparison as differing in goal completion; do not silently omit the bill.

A “change this past decision” branch freezes earlier actions and applies a declared policy after the divergence, such as hold existing assets, route contributions to cash, and keep original goal deadlines. It does not blindly replay later trades that have become unaffordable. Call it an alternative scenario, not a prediction of what definitely would have happened.

Use a zero-based linear money chart by default. Compare nominal value and purchasing power through a toggle, not multiple unexplained units on one axis. A future log-scale view must explain itself and handle zero; it is unnecessary for the launch child interface.

## 11. Market engine corrections and contract

### What was checked

The original packet's regime-transition table does produce stationary weights of approximately 67.56% normal, 27.95% boom, and 4.50% slump under the stated mutually exclusive monthly transitions. That agrees with the quoted long-run proportions. It does **not** verify the portfolio quantiles, “68% of runs have a slump,” or runtime claims.

A 30% monthly background headline probability gives an expected 72 background headlines over 240 months before regime-triggered exceptions. With annual stops too, the proposed session has far more interruptions than its animation-only two-minute estimate. Treat monthly events as data, not required modal dialogs.

“Geometric Brownian motion using simple returns” is ambiguous. The original correlation construction specifies market and sector loading coefficients; those coefficients are not automatically empirical CAPM betas. Document the chosen discrete approximation and units. Do not ship financially authoritative labels for arbitrary toy-model parameters.

### Required pure interfaces

```js
createMarket({ engineVersion, contentVersion, seed, scenarioId })
createRun({ scenarioId, marketId, presentationMode, initialPlan })
validateAction(state, action) // no mutation; structured error or valid preview
applyAction(state, action)   // pure; no DOM, wall clock, or network
advanceMonth(state, market) // deterministic ledger transition
summarizeRun(state)
scorePlanPractice(state, rubric)
replaySave(save)
comparePlan(save, alternativePolicy)
```

Market generation cannot depend on holdings, emotional-choice text, past profits, decorations, or how much the child trades. UI animation never advances the financial model by itself. A named time-advance action commits months, with rendering merely showing the result.

### Asset universe

Keep the six recognizable source businesses: Lemon Lane and Rise & Shine Bakery (Food), Toy Box (Fun), Spoke Bikes (Outdoor), Paws Pet Care (Care), Robo Lab (Tech). Do not simultaneously refer to an ice-cream shop or umbrella company unless Fable explicitly swaps names and content everywhere.

The **Town Basket Fund** owns all six in equal target weights and rebalances annually. State plainly that it still depends on one town and stocks. A later “Beyond Town” fund can introduce many regions and industries, but must have its own properly defined exposure model. Do not imply that decorative building count equals diversification.

Keep the packet's drift/volatility table only as an initial tuning candidate. Label whether drift includes or excludes distributions, and whether each percentage is annualized or per month. Do not lock advertised real-world return expectations to those numbers. Savings interest and inflation are scenario settings, not permanent 2% and 2.5% guarantees.

For launch, no leverage, short positions, debt, limit orders, spreads, taxes, or liquidity simulation. Explain these omissions briefly in grown-up information. Simplicity is acceptable when not presented as a complete replica of markets.

### Accounting order, one tick

Fable must lock this sequence and use it in UI, replay, ghosts, and tests:

1. Execute valid user actions at the frozen current quote; reject overspending and overselling.
2. Add that month's external practice coins and route the agreed contribution plan. Only currently available money can be routed; never create a negative wallet.
3. Snapshot holdings entitled to this tick's distributions.
4. Advance the seeded market, business events, savings interest, and inflation index to the new month.
5. Process distributions once; credit cash and adjust ex-distribution prices/NAV under the chosen convention.
6. Apply disclosed fund expenses exactly once, then reinvest elected distributions at the defined post-distribution/post-fee price.
7. Present any life cost requiring a choice before advancing again. Background events go to the digest.
8. Rebalance fund internal weights on its defined annual date; this is not a child trade and cannot multiply fees.
9. Commit an auditable ledger checkpoint and save; render the new month.

If Fable changes this order, update the examples and fixtures together. Do not allow the UI and bots to use different execution timing.

### Dividends and funds

Choose one coherent convention. Recommended: generate company economic total-return factors, then split each factor into ex-distribution price movement and the cash dividend. For opening price `P`, gross total-return factor `G`, and dividend per share `D`, use `P_next = P * G - D`, subject to an explicitly validated nonnegative constraint. With no other fees or flows, `P_next + D = P * G`. A fund aggregates its underlying holdings' price and cash flows and charges its own fee once. Never add underlying dividends again to a fund whose return already includes them.

Reinvested dividends buy additional shares and are **not external contributions**. Distributions may be reduced or suspended by authored company events. The UI need not teach ex-dates in launch, but the accounting must not reward buying just before payout and immediately selling. The simplified distribution mechanism reflects a real distinction between owning before an ex-date and buying afterward. [S8]

### Fees

Default individual trades cost zero in launch. Keep any fund expense visible. For the cost experiment, compare two otherwise identical basket paths, with illustrative 0.2% and 1.5% annual expense rates. Explain that the rates are chosen for the lesson, not quotes for an actual product. Expense effects compound; a fund's expense ratio is different from a transaction commission. [S14]

For a simple discrete toy model, explicitly choose `monthlyFee = openingOrSpecifiedNAV * annualFee / 12`, identifying the NAV timing in code and copy. Do not label this as an exact effective annual deduction. Do not round tiny monthly fees to a full coin; carry sub-cent precision or a residual accumulator and round only at the stated ledger boundary.

A future Pro Picker lesson can compare different stock selections, but must not use that comparison to isolate fees. Cost awareness is not “all active choices always lose.”

### Uncertainty, distress, and inflation

- Include company-specific setbacks and at least one authored permanent-impairment scenario. A temporary market slump and a permanently harmed company must look different in the explanation.
- If closure is supported, define suspended trading, final liquidation value, distribution, and removal from the basket. Do not clamp a failed asset to one coin forever or let players buy free shares at zero.
- No hard-coded inverse pair where buying the opposite weather stock always wins. Common risks can hurt several sectors together.
- Do not always end with recovery. Include a late slump and a long stagnation scenario in validation.
- An event and a regime cannot accidentally apply the same loss twice. Each event declares whether it changes a regime, adds a company shock, or only explains an already-applied move.
- Removing an arithmetic mean event shock from drift does not by itself preserve geometric growth. Calibrate the finished engine, including conditional event frequencies and reinvestment.
- Store a cumulative purchasing-power index. Real value is nominal value divided by that index, with both expressed in the same base month. A savings balance does not literally shrink just because purchasing power falls.

### Determinism and numeric policy

Use explicitly versioned PRNG code, seed encoding, unsigned integer behavior, stable asset/event order, and independent streams for market, events, expenses, and cosmetic variation. Never use `Math.random()` inside a seeded run. Avoid locale-dependent date parsing and sorting.

Define money as integer subunits, shares as fixed-scale quantities, and round at specified boundaries. If price generation uses floating point, quantize to documented price subunits before ledger use and verify across target engines. Define maximum values and safe-integer limits; cap invalid inputs rather than allowing overflow. Removing `Math.exp` and `Math.log` alone is not a cross-browser proof.

If using six uniform variables as a centered normal-like shock, normalize their variance: `(sum(U1..U6) - 3) / sqrt(0.5)`. This remains bounded approximate noise, not a true Gaussian tail. State that limitation; include authored stress scenarios rather than implying the bounded model captures rare real-world crashes.

Market identity must contain engine version, content version, scenario ID, and seed. A future calendar scenario also contains a fixed date identifier displayed to the user. The local date is sufficient for a suggested scenario, but is not “the same market everywhere at the same instant.” No wall-clock dependency is needed for launch.

## 12. Event deck: 24 launch cards

These are authored content proposals, not calibrated shock values. Fable must assign bounded magnitudes, durations, prerequisites, cooldowns, and eligibility in one versioned table before Opus implements them. A headline explains plausible forces, not a buy/sell tip. Good business news can coincide with a price fall because other information matters.

| ID | Headline | Visible town change | Lesson / eligible use |
| --- | --- | --- | --- |
| E01 | Hot days bring thirsty customers | Lemon queue and shade umbrellas | Demand may help sales; chapters 2+ |
| E02 | Lemon deliveries arrive late | Fewer crates at Lemon Lane | Supply limits can offset demand; 2+ |
| E03 | Flour costs more this season | Bakery cost board changes | Higher revenue is not necessarily higher profit; 2+ |
| E04 | A new oven saves energy | Bakery oven and meter | Lower costs may help; 2+ |
| E05 | A toy trend brings new shoppers | Toy Box window changes | Popularity can fade; 2+ |
| E06 | Toy deliveries cost more | Delivery cart takes a detour | Input costs matter; 2+ |
| E07 | A new bike path opens | Cyclists on a marked lane | Business demand can change; 2+ |
| E08 | Rain changes weekend plans | Outdoor customers move indoors | Shops share some risks and differ in others; 2+ |
| E09 | Pet care bookings fill up | Appointment board fills | Recurring services; 2+ |
| E10 | Pet care needs more helpers | Help sign appears | Growth also brings costs; 2+ |
| E11 | Robo Lab announces an invention | Window demonstration | Expectations and uncertainty; 2+ |
| E12 | Robo Lab repairs a product problem | Repair desk opens | Company-specific setback; 5+ |
| E13 | Many families spend less | Quieter activity across town | Broad market/business pressure; 5+ |
| E14 | Deliveries slow across town | Several carts queue | Common shock; do not duplicate regime losses; 5+ |
| E15 | Deliveries return to their routes | Routes clear | Improvement need not undo every loss; 5+ |
| E16 | Businesses share an encouraging update | Public noticeboard | Same news need not produce certain gains; 2+ |
| E17 | Some prices already expected the news | Earlier forecast and new board side by side | Expectations; Explorer overlay on eligible news, no second shock |
| E18 | A shop changes its payment plan | Dividend notice changes | Dividends can shrink or stop; 4+ |
| E19 | A shop closes this chapter | Repurposed storefront and shopkeeper's next plan | Permanent impairment, explicit liquidation; authored chapter 5 seed variant |
| E20 | Your bike needs a small repair | Repair picture beside goal | Buffer funding decision; 3+ |
| E21 | Your goal day has arrived | Chosen goal displayed | Planned spending is success; all relevant chapters |
| E22 | A practice contribution arrives | Quiet ledger entry | Money added is not investment growth; 4+ |
| E23 | Familiar things cost a little more | Goods price labels change | Purchasing power; 6+ |
| E24 | Two baskets charge different fees | Matched ledger cards | Controlled comparison, not random market news; chapter 6 lab |

The 24-card count includes financial explanations and decision cards; it does not mean 24 independent price shocks. E17, E20, E21, E22, E23, and E24 have distinct event types. E23 reports inflation already applied by the model; it must not apply it again. E22 reports an external contribution already in the ledger.

Required fields: `id`, `kind`, `chapterMin`, `headline`, `shortExplanation`, `visualCue`, `eligibleAssets`, `season`, `cooldownMonths`, `prerequisites`, `regimeEffect`, `companyEffect`, `durationMonths`, `informationTiming`, `decisionRequired`, `accessibilityText`, and `learningPoint`. Explicitly set “none” for irrelevant financial effects.

At most one required story decision interrupts an annual step in the early chapters. If two expenses or goal deadlines would collide, use an ordered decision queue with time stopped. The year digest can show several background stories without forcing acknowledgement of each. Every card remains available in the scrapbook.

## 13. Technical delivery and saves

Retain one authored `index.html` with distinct engine, data, and UI sections, plus `sw.js`, `manifest.webmanifest`, and necessary icons. A headless harness and fixture files are development tools and need not ship. No React, remote fonts, CDN libraries, analytics, backend, or AI service is needed.

### Offline and privacy boundaries

Gameplay must issue no API, telemetry, ad, or remote asset requests. A PWA still needs initial file delivery and browser-controlled service-worker update checks; do not promise that an online browser performs literally zero network traffic. After caching completes, confirm that the entire game works in airplane mode. Service workers can cache resources for offline use, but the first uncached visit still needs delivery. [S10]

Cache by game-specific scope and version; never delete unrelated Lucid Winds caches. Precache all required files before declaring the new version ready. Do not activate an incompatible update mid-run or reload without saving. Store enough engine/content version information to resume correctly; if a past engine cannot be replayed, offer a preserved read-only result/export and an explicit migration choice.

No child identifiers, ad SDKs, tracking pixels, analytics SDKs, social buttons, email capture, or cloud speech. Host/server logging and any future store wrapper need their own review before claiming “no data collected.” The FTC's SDK guidance illustrates why the surrounding package matters, even when the game code itself appears simple. This document is not a compliance certification. [S15]

### Save design

Use a versioned save with an action log **and periodic validated snapshots**, rather than relying on an unbounded replay with an assumed 5 KB cap. Suggested fields:

```js
{
  schemaVersion: 1,
  engineVersion: 'MS1',
  contentVersion: 'DECK1',
  rubricVersion: 'PLAN1',
  runId: 'local-random-id',
  scenarioId: 'chapter-3',
  seed: 'explicit-seed-string',
  tick: 18,
  lastSequence: 32,
  checkpoint: { /* balances, quantities, goal state, ledger totals */ },
  actionsSinceCheckpoint: [],
  completedOpportunities: [],
  options: { presentation: 'guided', reducedMotion: false, sound: false },
  progress: { completedChapters: [], decorationChoices: [] }
}
```

The local run identifier is never transmitted and contains no device fingerprint. Sequence numbers make double taps/retried dispatches idempotent. Save after committed financial actions and chapter transitions, with a last-known-good backup. Keep the UI honest: a failed save displays “Playing without saving on this device” and offers a local export, not a false “Saved.”

Browser storage can be evicted or cleared and private sessions can be temporary. Do not promise permanent local storage. Add grown-up export/import from a user-selected JSON file, with strict schema, size, numeric, and version validation. Export is also useful for bug reports; sending a report is a separate explicit action. [S11]

Corrupt data stays recoverable until the user chooses a reset. Do not continuously overwrite the only bad-save copy with later failures. Two tabs cannot silently fork and overwrite the same run; use a local ownership/sequence check and show a read-only/resume choice in the second tab.

### Performance and art budget

Treat the source's 150 KB HTML target as a prototype budget, not a proven limit for the finished town. Prototype target: under 150 KB uncompressed core HTML where feasible, system fonts, inline SVG art, no heavy audio. Measure and report the complete cached package separately. If richer artwork needs a larger budget, Fable must document the change for Stephen rather than hiding it.

Budget six shops, six simple shopkeeper portraits, one fund stall, a savings jar, four goal pictures, three weather overlays, six reusable decoration families, and chapter scrapbook frames. Reuse shapes and limited animation states. Text stays HTML, never baked into images. No image-generation dependency is required to build the first playable version.

Use DOM/SVG for interactive controls and the town, with a chart rendering layer that has an accessible textual equivalent. Cap canvas density if canvas is used. Avoid a permanent animation loop when the page is static. The game must remain functional with all decorative animation disabled.

Benchmark on a named lower-end Android device as well as a desktop. Proposed targets: responsive controls within about 100 ms, no obvious freezes during year advances, and market precomputation below 100 ms on the chosen reference device. These are acceptance targets to measure, not claims of existing performance. Do not optimize for “under 2 ms” before the ledger is correct.

### Sharing

Defer share cards and replay links from launch. They are optional external exports, not player communication features. If added, use a child-safe generic card with chapter/scenario, discovery, and version; no names, balances from real life, or raw save data. Copy/download must work when Web Share or clipboard permissions are unavailable.

An offline hash can catch accidental corruption; it cannot prove an authentic score against a user who can modify the client. Call it a checksum, not anti-cheat verification. An offline public leaderboard would conflict with the architecture and is out of scope.

## 14. Expansion backlog, ranked by value

None of these authorizes adding scope to the initial build. Fable should preserve them in a backlog with a hypothesis and test, not deliver every mode at once.

| Priority after launch | Idea | Benefit and constraint |
| --- | --- | --- |
| High | Goal variety pack | Art studio, bike, trip, community garden; change stakes without new engine systems |
| High | Guided/Explorer refinement | Test with emerging readers and older children; neither mode gets favorable market luck |
| High | Two-person family comparison | Pass-and-play with separate local households and identical scenarios; no account or network |
| High | Teacher projection mode | Large text, pause-anywhere, anonymous group discussion, printable reflection; no student roster |
| High | Beyond Town basket | Make geographic/sector concentration visible; requires a defensible new exposure model |
| High | Saved experiment notebook | Compare one changed assumption at a time; local data only |
| Medium | Archive of named scenarios | Many paths such as slow recovery, high inflation, and a goal arriving during a downturn |
| Medium | Flexible contribution schedules | Show irregular income, pauses, and small amounts without moralizing |
| Medium | Goal date approaching | Visual transition from growth money toward money needed soon; no personalized advice |
| Medium | Spending, saving, and giving goals | Treat each as a legitimate use, without making donations buy a higher virtue score |
| Medium | Hype Detective | Ask what gives an asset value and what information is missing; no real token prices or purchase routes |
| Medium | Higher-volatility fictional collectible lab | Optional older-reader scenario; uncertain outcomes, no predictable spike cycle or richer visual reward |
| Medium | Lending and bonds chapter | Introduce issuer risk, repayment, and rate sensitivity; not “guaranteed safe creature” |
| Medium | Orchard visual skin | Reuse exactly the same ledger and comparison engine; do not create a second finance model |
| Medium | Accessibility narration pack | Locally bundled recordings only after budget approval; useful when device speech is absent |
| Medium | Localization | Centralized strings, number formats, and text expansion; avoid mixing locale with seed logic |
| Low | Family-history scrapbook | Optional imaginary households, not required grandparent inheritance or college funding promises |
| Low | History of shares | Museum-style voyage illustration; avoid exoticized colonial trade and success/failure betting loops |
| Low | Cosmetic town styles | Paper, garden, night town; never sold, random, or linked to investment performance |
| Low | Strategy postcards | Neutral plan explanations; no “winner trader” badges or wealth rankings |
| Low | Calendar suggestion | An archived scenario suggested by date; no lockout, streak, notification, or reset exploit concern |

Do not add catch-up gifts, energy meters, daily login bonuses, spin mechanics, stock prediction contests, premium signals, real-crypto literacy funnels, purchasable cosmetics, or paid parent reports. These contradict the agreed product.

## 15. Opus implementation milestones

Do not issue one enormous “build everything” request. Each milestone should leave a usable, versioned artifact and a short status note so work can resume after an interrupted coding session. Commits belong in the existing project repository once Fable identifies it; do not invent a repository or engine implementation.

| Milestone | Deliverable | Exit condition |
| --- | --- | --- |
| M0: Reconcile | Final `HANDOFF.md`, decision log, source corrections, numeric/config contracts | No unresolved accounting order, asset definition, or score semantics |
| M1: Trustworthy core | Pure engine, ledger, deterministic replay, fixed fixtures, headless harness | Accounting and replay tests pass before decorative UI |
| M2: First playable | Chapter 1, one shop, one goal, jar, buy/sell, recap, save | Child can describe ownership and use the goal without instruction wall |
| M3: Town loop | Six shops, basket look-through, chapters 2 and 3, event digest | No need for constant trading; meaningful cash and diversification choices |
| M4: Time and uncertainty | Chapters 4 to 6, dividends, inflation, matched fee lab, benchmarks | Reconciled totals; comparisons do not rig a preferred winner |
| M5: Finish and access | Scrapbook, chosen decorations, free play, read-aloud fallback, PWA, recovery | Offline, accessibility, interruption, save and low-end-device checks pass |
| M6: Playtest and release candidate | Structured observations and fixes; known limitations; build instructions | Misconception blockers resolved, exact release artifact identified |

No monetary launch estimate or coding-time promise is justified without the repository and prototype. The most expensive risks are trustworthy replay/accounting, clear child-facing feedback, and content pacing, not simply drawing storefronts.

## 16. Acceptance tests and evidence required

### Financial correctness

| Test | Required result |
| --- | --- |
| Buy/sell at an unchanged price, zero fees | Value is conserved within the explicit rounding tolerance; no repeated-cycle profit |
| Distribution at zero total return | Share value plus paid cash equals pre-distribution value |
| Reinvestment | Converts paid cash to shares once; never counts as an external deposit |
| Fund plus stock exposure | Underlying concentration is calculated once and correctly |
| Matched fee experiment | With identical holdings and external flows, added fees cannot create extra wealth; the no-fee path is not quietly different |
| Wallet/jar transfer | Net worth and contribution totals are unchanged |
| Goal purchase | Cash falls once; fulfilled-goal spending rises once; score does not punish it |
| Contribution | Balance growth is identified as added money, not market performance |
| Insufficient funds / zero price | Invalid actions rejected without negative cash, infinite shares, or NaN |
| Closure/liquidation | Trading and fund handling follow the published policy; no resurrection from a positive price floor |
| Benchmark cost funding | Same expenses applied; any unmet expense is visible |
| Zero ending wealth | Results and charts render without division by zero or invalid log scale |

### Determinism and interaction

- Golden fixtures cover several seeds, long runs, distributions, closure, and fee timing; store expected ledger values as well as a market checksum.
- Replay the same versioned action sequence in Node and supported browsers, including Chromium/Android and WebKit where supported. Match quantized values exactly under the agreed policy.
- Fast/slow animation, reduced motion, switching screens, and reading text never change the market or score.
- Undo before time advance restores the exact prior state. An experiment branch never changes the original save.
- Refresh, app termination, airplane mode, blocked storage, corrupt import, duplicate tap, two-tab contention, and interrupted update each have a tested recovery path.
- No market advancement while away. No repeated dividends on reopening.
- Save import treats content as data; no code execution, unsafe HTML, remote URL loading, or prototype pollution.
- Keyboard and TalkBack can complete the main chapter and execute/cancel a trade. Color and sound are never the only information.
- Network inspection distinguishes initial/update delivery from gameplay; no third-party request occurs during play, including read-aloud.

### Calibration, not a predetermined moral

Rerun at least 10,000 documented seeds for the finished engine with final events and declared strategy policies. Use a held-out seed set after tuning. Report engine/content versions, parameters, seed list or generation rule, sample size, external cash flows, median and tails of real/nominal outcomes, losses, drawdown, goal fulfillment, event frequencies, and execution timing on the named device.

Keep no-contribution calibration separate from periodic-contribution results. A final balance divided by initial wealth is misleading as a return when later deposits are present. Report ledger-derived net investment gain and cash-flow-aware measures with an explicit definition; do not silently call deposits compounding.

Do not force the Town Basket median into 1.8× to 2.6× or tune it to beat single stocks 55% to 70% merely because v1 says so. Instead require a range of plausible toy-world outcomes, sensitivity analysis for the chosen assumptions, some stock-basket losses, some single-stock outperformance, and meaningful short-horizon cash success. A calibration report describes the model; it does not validate real-world forecasting.

Stress scenarios are separate from frequency claims: immediate crash, late crash, long stagnation, strong single-stock performance, concentrated company failure, inflation above savings, savings above inflation, and a needed purchase during a downturn. All must remain understandable and playable. Do not infer a 20-year recovery guarantee from average performance.

## 17. Playtest plan for Penny and additional children

Penny is a useful first participant, not evidence that the game works for an entire age band. Follow with a small varied group of roughly five to eight children across the intended reading range, with appropriate grown-up permission and no embedded analytics. This is formative usability work, not a statistically representative educational study.

Observe first; do not explain the interface before seeing where it fails. Record anonymous notes about actions and misconceptions, not names, financial background, or automatic recordings.

| Prompt or observation | What success looks like |
| --- | --- |
| “What did you buy?” | Child says a small piece/share, not the whole shop or its products |
| “What money can you use soon?” | Distinguishes wallet/jar from money exposed to market changes |
| Show a price drop | Does not think they must tap faster, hold a button, or sell immediately |
| “What if this one shop closes?” | Understands a basket still has other holdings but can also lose |
| Add practice coins | Can distinguish the addition from investment gain |
| Dividend comparison | Understands a payment or reinvestment; not a magic bonus for tapping |
| “What if you need your goal money now?” | Recognizes a reasonable use of cash or a planned sale |
| Compare identical baskets with fees | Can say costs leave less, without calling all fees fraud |
| Finish a disappointing run | Still understands at least one useful decision and can stop satisfied |
| Leave and return | Finds the same saved decision and understands how to continue |
| “What would you change next time?” | Suggests a plan change rather than predicting an exact winning stock |

Release blockers: repeated belief that losses always recover; cash is always foolish; every sale is bad; decorations improve returns; more trading earns more rewards; a share buys the whole shop; or “the game says I should buy crypto.” Also block on accidental trades, inaccessible controls, misleading totals, or unrecoverable routine save failures.

Proposed product gates: most first-time participants complete the opening without more than one adult navigation hint; most explain ownership and the purpose of cash after chapter 3; several voluntarily try a second chapter or experiment. Report actual counts and observed limitations instead of presenting a small sample as proof of learning. Revisit with a delayed, new scenario to check transfer rather than memory of a button sequence.

## 18. Answers to the source handoff questions

| Source question | Review answer |
| --- | --- |
| Is MAINSTREET the right hybrid? | Yes: town core, Orchard comparison, optional later family play. Remove rope holding and launch daily mode |
| Is v1 too large for one build? | Yes. Use M0 to M6 and a first playable before full content |
| Is the habit score fair to a nine-year-old? | The original is not. It penalizes cash and reasonable selling and partly scores luck. Replace with the scenario rubric above and plain evidence cards |
| History or hype expansion? | Hype Detective first for older readers if testing supports it; history later |
| First sixty seconds? | One shop, one ten-coin share, a visible remaining balance, and a season change |
| Town art and cause/effect? | Paper town with separate activity, ownership, and price layers; no emotional pressure from characters |
| Simplest buy/sell sheet? | Frozen quote, amount buttons, preview, one concrete confirmation, pre-advance Undo |
| Compounding emotional moment? | Two comparable futures plus an honest contribution/result breakdown and achieved purpose |
| Fun between decisions? | Character moments, inspection, decoration choices, scrapbook, and controlled experiments; no earning by tapping |
| Final asset list? | Six source shops, Town Basket, wallet and Savings Jar earmarks; fee comparison is a lab, not a separate active fund |
| Event deck size? | 24 typed cards, as listed; fewer displayed per chapter |
| Scoring weights? | Proposed 25/20/20/20/15; final Fable contract must encode opportunity rules, not weights alone |
| Calibration and harness? | Reproduce from supplied or newly implemented code; original numerical results remain unverified |

### Stephen's decisions, with defaults so work can proceed

1. **Title:** retain MAINSTREET internally. No name, domain, or trademark availability is claimed.
2. **Orchard first:** prototype inside the MAINSTREET project; no separate public app by default.
3. **Age band:** primary 8 to 11, with Guided support for 7+; validate rather than changing the engine by age.
4. **Daily scenario:** after launch, optional archive; not a retention obligation.
5. **Family Night:** after launch; co-play on one run is supported immediately.
6. **Where it ships:** arcade PWA first; Play Store only after a separate packaging/policy pass.
7. **Honesty wording:** approve the corrected non-guarantee language noted in section 2.
8. **Art/performance budget:** begin with the source's lightweight inline approach; explicitly approve any larger final package.

### Fable must resolve before coding the affected feature

- Final numeric market/distribution convention and units; account and fund tick order.
- Final event parameters and permanent-impairment handling.
- Whether all six chapters ship together after validation or chapter 1 is a private prototype first; recommended prototype first.
- Exact scenario goal amounts, deadlines, reserves, contributions, and score opportunity table.
- Trade and price precision, rounding/residual policy, maximum values, and golden fixtures.
- Save migration and service-worker compatibility policy.
- Exact target repository, reference devices, browser support, and coding-agent identifier.

These are design/implementation decisions, not questions the child should ever see.

## 19. Instructions for Fable's final HANDOFF.md

Use this review as the Astra UI/UX and fun pass in the original relay. Reconcile it explicitly with v1; do not concatenate two contradictory specifications and make Opus guess.

Your final build packet should contain:

1. One-paragraph product definition, preserved non-negotiables, supported audience, and launch exclusions.
2. Accepted/rejected change IDs C01 to C22 with reasons; any Stephen-approved rule changes recorded.
3. Final chapter table, complete event data, exact asset definitions, and all child-facing core copy.
4. Screen/state table including empty, error, paused, and recovery states.
5. One numeric simulation and ledger specification, strategy policies, score opportunity schema, and save schema.
6. Art inventory with dimensions/format expectations and accessibility alternatives.
7. Ordered implementation milestones, concrete acceptance fixtures, commands to run them, and measured calibration results once implemented.
8. A playtest checklist, known limitations, deferred backlog, and a resumable status note.

**Instruction to Opus:** implement the approved milestone in the existing repository, keep the engine pure, verify the ledger before visual polish, preserve completed work in commits, and stop adding optional features once that milestone's acceptance conditions pass. Never invent missing research results or mark unrun tests as passed. No backend or monetization layer is authorized by this packet.

## 20. Sources and scope of evidence

Checked October 10, 2026. The design proposals are original recommendations. Sources support the factual statements beside their IDs; they do not establish that this proposed game improves financial outcomes. Competitor features are descriptions from their publishers. No external source verifies the original packet's simulation table.

- **S1:** [Crypto Parrot FAQ](https://cryptoparrot.com/faq). Product mechanics and reward framing.
- **S2:** [InvestQuest, Chad Arnett, App Store](https://apps.apple.com/us/app/investquest/id6759941323). Current developer description and version notes; not SMG InvestQuest.
- **S3:** [NGPF: Interactive, Invest With STAX](https://www.ngpf.org/blog/just-one-resource/just-one-resource-interactive-invest-with-stax/). Compressed investing decisions and classroom competition.
- **S4:** [Investor.gov: Asset Allocation and Diversification](https://www.investor.gov/introduction-investing/getting-started/asset-allocation). Goal horizon and risk.
- **S5:** [Investor.gov: Diversify Your Investments](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/diversify-your-investments). Diversification does not guarantee protection from market losses.
- **S6:** [CFPB: Building Blocks of Financial Capability](https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/). Developmental framework.
- **S7:** [FCA: Digital Engagement Practices, a Trading Apps Experiment](https://www.fca.org.uk/publications/fca-research/research-note-digital-engagement-practices-trading-apps-experiment). Adult experimental evidence and its limits.
- **S8:** [Investor.gov: Ex-Dividend Dates](https://www.investor.gov/introduction-investing/investing-basics/glossary/ex-dividend-dates-when-are-you-entitled-stock-and). Distribution eligibility and price-adjustment context.
- **S9:** [MDN: SpeechSynthesisVoice.localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService). Local versus remote speech voices.
- **S10:** [MDN: Offline and Background Operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation). Service-worker caching and offline operation.
- **S11:** [MDN: Storage Quotas and Eviction Criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). Local storage persistence limitations.
- **S12:** [W3C: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). Alternatives to required dragging.
- **S13:** [W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Minimum criterion and exceptions.
- **S14:** [Investor.gov: How Fees and Expenses Affect Your Investment Portfolio](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated). Ongoing fee effects.
- **S15:** [FTC: Third-party Software and COPPA](https://www.ftc.gov/business-guidance/blog/2025/09/using-third-partys-software-your-app-make-sure-youre-all-complying-coppa). Risk from SDK collection within children's products.

**Review verification performed:** read the supplied packet; checked the cited primary pages; independently calculated the original transition matrix's stationary proportions, expected background-headline count, and minimum-fee example; checked this handoff for coverage and conflicting defaults. No game was implemented, no cross-browser test was run, and no 10,000-seed calibration was reproduced in this review.
