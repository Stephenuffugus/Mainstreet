# Kids Investing Game — Concept Packet v1 (for Fable)

Oct 10, 2026 · @Stephen Furpahs

## How to use this packet

This is round one of a five-step design relay. The aim is a free, fun game that teaches kids how investing works without teaching them to gamble. The format isn't decided yet: one game, a game plus mini-modes, or a small family of apps are all on the table.

1. **Claude (this packet):** research, a multi-concept brainstorm, guardrails, and a recommended direction.
2. **Fable:** review it, cut weak ideas, strengthen the strongest, and turn it into a design packet for Astra.
3. **Astra (ChatGPT):** UI/UX and fun pass. Push back, add its best ideas, and tighten the player experience.
4. **Fable:** reconcile both rounds and write the final build plan and handoff (HANDOFF.md style).
5. **Opus in a GitHub Codespace:** build it.

**Every reviewer:** keep the Non-negotiables unless Stephen changes them. Mark what you changed and why, and answer or update the Open questions at the end. Concepts are written as options. Don't feel bound to the recommended one if a better hybrid shows up.

## Origin: what Crypto Parrot is, and what we take from it

Crypto Parrot is an adult paper-trading simulator, not a bartering game. Players get $100k in play money, trade real coins, and are scored on portfolio value against the market. There's no trading between players. A friend suggested it, and the useful core for us is: **play money, a market that moves, and decisions with consequences but no real risk.**

| Crypto Parrot feature | Keep, adapt or drop | Why |
| --- | --- | --- |
| Play-money portfolio scored on value | Keep | It's the core loop, and it works solo with no player communication |
| Simple buy/sell screen | Adapt | Rebuild for ages 7 to 13 as kid-scale shops and companies, not tickers |
| Live real-world crypto prices | Drop | Needs internet and an API, and in effect promotes crypto to kids. A fictional market is safer and can be designed for teaching |
| Leaderboard ranked on returns | Adapt | Return-only rankings reward reckless bets. Score good habits instead, and share results Wordle-style |
| Community chat and Telegram | Drop | Stephen's rule is no player communication |
| Copy trading and real-crypto rewards ("Get free Bitcoin") | Drop | Real-money hooks have no place in a kids' game |
| "Verified trader" badge for high returns | Adapt | Becomes badges for patience, diversification and holding through a crash |

Sources: [cryptoparrot.com](https://cryptoparrot.com), [CB Insights profile](https://www.cbinsights.com/compare/crypto-parrot-vs-vestly).

## Competitive landscape

Nothing for ages 7 to 13 is a hands-on toy that works offline with no accounts and rewards good habits. Most of the field is trivia with a money theme, adult brokerage screens, or school-classroom tools. **The one close competitor is InvestQuest** (solo dev, March 2026, ages 6 to 12): 13 lessons plus a $10k simulator with 8 fictional companies, bull and bear cycles, dividends, an index fund, offline play and private PIN leagues, free with no ads. Ours has to feel like a game, not a lesson app.

| Product | Ages | What it is | Gap it leaves |
| --- | --- | --- | --- |
| [InvestQuest](https://appshunter.io/ios/app/investquest/id6759941323) | 6 to 12 | Lessons plus a fictional-company simulator, offline | Lesson-app feel; no visible world or habit scoring |
| [SIFMA Stock Market Game](https://econed.org/about-stock-market-game/) | Grades 4 to 12 | Class teams invest $100k at real prices over weeks | Winning teams used leverage and penny stocks ([Zweig](https://jasonzweig.com/stock-market-101-teaching-the-wrong-lessons/)): rewards speculation |
| [NGPF Arcade (Build Your Stax)](https://www.ngpf.org/arcade/) | High school | 20 years of investing in 20 minutes | The best teaching device in the field, but no kid-friendly version |
| [Gimkit](https://tooldirectory.ai/tools/gimkit) / [Blooket](https://designbeep.com/2026/06/09/blooket-the-complete-guide-to-the-game-based-learning-platform/) | K to 12 | Quiz answers earn cash you reinvest or steal | Money is just a quiz score; chance-based reveals |
| [Greenlight Level Up](https://greenlight.com/learn) | Kids, teens | Real investing that parents approve, plus lessons | Paid, needs a bank account |
| [Zogo](https://zogo.com) | 13+ | Short lessons earn points for real rewards | No market; pays for quizzes |
| [Bankaroo](https://bankaroo.com) | 5 to 14 | Pretend allowance bank | No investing |
| [Wall Street Survivor](https://wallstreetsurvivor.com) | Teens, adults | Paper trading, delayed real prices | Ads, broker affiliate links, accounts |
| Animal Crossing turnips ([guide](https://engagedfamilygaming.com/?p=10097)) | All | Buy turnips Sunday, sell during the week before they rot | Proves kids love a fictional market, but it's pure timing |
| [TD Treat Island Tycoon](https://fintech.ca/2025/04/02/td-launches-roblox-game-to-help-kids-learn-financial-skills/) (Roblox) | 10 to 14 | Earn, save and borrow in a business sim | No investing; Roblox accounts and chat |

**Gaps we can own:**

1. A toy, not a quiz: the investing happens through play.
2. Offline, no accounts, no chat.
3. Time as the hero: compounding is the thrilling moment, made for young kids.
4. Scoring that rewards diversification, patience and holding through crashes, not raw returns.
5. A kid-sized fictional market with visible cause and effect (weather, fads, school starting).
6. Free parent-and-kid co-play on one device.
7. Safe crypto literacy. In a [2022 T. Rowe Price survey](https://blockworks.com/t-rowe-price-survey-40-of-kids-think-crypto-is-future-of-investing/), 40% of kids aged 8 to 14 called crypto "the future of investing." A fad asset that teaches hype could address this without promoting real coins.

## Non-negotiables

These hold through every round unless Stephen changes them. The anti-gambling rules come from research: in a randomized experiment, app features like confetti raised risk-taking, especially with volatile assets ([Chapkovski, Khapko and Zoican](https://www.advisor.ca/industry-news/industry/study-finds-gamified-apps-push-diy-traders-to-make-riskier-investments/)). Loot-box spending is linked to problem gambling in older teens ([UK Gambling Commission research summary](https://www.gamblingcommission.gov.uk/guidance/lootboxes-advice-to-the-gambling-commission-from-absg/annex-a-links-to-recent-research-with-abstract-summaries-on-key-conclusions)).

**Platform and privacy**

- Free. No ads, no in-app purchases, no real money or real crypto anywhere.
- No player communication: no chat, no trading or bartering between players, no accounts, no login.
- Works fully offline. No network calls at runtime.
- No personal data collected. Saves live only on the device.
- Single-file vanilla HTML/CSS/JS PWA, mobile-first, no build step (plus the small `sw.js` and manifest a PWA needs).

**Anti-gambling design**

- A fictional market. No real tickers or real-world prices.
- Never celebrate an individual trade. Celebrate milestones and habits (year-end, a portfolio doubling, holding through a storm).
- No loot boxes, spin wheels, random reward chests, rarity tiers or near-miss animations.
- No streak counters or daily-login pressure. Missing a day costs nothing.
- No leverage, short selling, timers or "act now" pressure.
- Raw returns are shown but are never the main score. The score rewards diversification, patience and calm.
- Calm presentation during crashes: no flashing red, no alarm sounds.

**Honesty**

- The market tells the truth about investing: a spread-out fund usually wins over 20 years, but not every time, and a single pick sometimes beats it.
- News causes real but noisy effects. It's never a guaranteed tip.
- Every game term maps to the real one (a "slice" is a share, a "harvest" is a dividend), shown on a decoder card.

## Learning goals

The game teaches rules of thumb and habits, not jargon. That matches the [CFPB building blocks](https://www.incharge.org/blog/how-to-teach-children-good-financial-habits-cfpb-releases-building-blocks/), which put habits and norms at ages 6 to 12 and formal knowledge at 13 and up. A kid who finishes should be able to say the rule in the right column in their own words.

| Concept | Rule of thumb the kid leaves with | How the game teaches it | Ages |
| --- | --- | --- | --- |
| Owning a share | "I own a slice of the shop, so I get a slice of its profits." | Buy slices of town shops; profit coins drop from them | 7+ |
| Compounding | "Money I plant grows money of its own." | Long fast-forward; the doubling bell; "start at 8 vs start at 18" split screen | 7+ |
| Starting early and staying in | "Time does most of the work." | Fast-forward ending; ghost of the version that held | 7+ |
| Diversification | "Don't put all your eggs in one basket." | Opposite-reacting shops (ice cream vs umbrellas); the Town Fund; the Spread score | 7+ |
| Crashes are normal | "Storms pass. Selling in a storm locks in the loss." | Storm events; panic-sell "Why?" prompt; ghost of the panic seller | 8+ |
| Emergency fund | "Keep a rainy-day jar so you never have to sell in a storm." | Surprise life events (broken bike) force a sale if the jar is empty | 8+ |
| Dividends and reinvesting | "Plant your harvest." | Tap coins to pocket or replant; Replant badge | 8+ |
| Fads and hype | "If everyone's talking about it, part of the rise is already in the price." | The Glow Slime fad asset rises fast and crashes when it's "so last year" | 9+ |
| Fees | "Little fees add up." | Fee jar; the high-fee Pro Picker Fund loses to the cheap Town Fund | 9+ |
| Inflation | "Cash under the mattress slowly shrinks." | Menu prices creep up; a "what it can buy" line on the chart | 9+ |
| Risk vs return | "Bigger possible gains come with bigger possible drops." | Each shop shows a calm or wild temperament before you buy | 10+ |
| Hindsight bias | "It's easy to know what to do after it happened." | Year-end recap reveals what the news was and what actually moved | 11+ |

## Concept options

The team generated seven distinct concepts, ranked below. Each one works solo with no player communication. Reviewers should feel free to merge, cut or replace them.

| Rank | Concept | One-line pitch | Build size | Biggest risk |
| --- | --- | --- | --- | --- |
| 1 | MAINSTREET | Own slices of the shops in a tiny town; news changes what happens on the street | Large | Overlaps InvestQuest unless the visible town sets it apart |
| 2 | ORCHARD | A 40-year orchard grows in 90 seconds; every fruit is eat it or plant it | Small | Low replay value |
| 3 | HOLDFAST | A storm hits the market and your only job is not to let go | Small | One idea; best as a mode |
| 4 | HEIRLOOM | A family fortune over three generations, passing the phone between parent and kid | Medium | Needs two players and era content |
| 5 | HATCHERY | Investments are creatures you raise, each species growing and getting sick its own way | Medium | Creature games pull toward gacha mechanics |
| 6 | ALMANAC | One market a day, same for everyone; share your strategy, not your profits | Small | Thin alone; daily scores drift toward chasing returns |
| 7 | TRADEWIND | Fund airship voyages; a storm can sink one ship but rarely a spread-out fleet | Medium | Hit-or-miss voyages are closest to betting |

### 1. MAINSTREET

- **Fantasy:** "I own part of the ice cream shop."
- **30-second loop:** A news card appears ("Heatwave next week!"). The ice cream line grows and the umbrella shop goes quiet. Collect profit coins, then pocket them or buy more slices.
- **Session:** One in-world year in about 5 minutes, ending with a fast-forward of the town and the habit score.
- **Wow moment:** A 30-year fast-forward. The dirt road becomes a tram line and the shops you own expand.
- **Feel:** Cozy angled town with animal shopkeepers (Animal Crossing warmth).

### 2. ORCHARD

- **Loop:** Drag a year slider. Fruit drops, and each one is eat (spend, get a sticker) or plant (reinvest). Oak is bonds, cherry is stocks, a wild meadow is an index fund.
- **Wow moment:** Two orchards from the same seed side by side. The planter's is a forest; the eater's has three trees.
- **Gambling guard:** No trading at all. Droughts shrink trees, but only cutting one down (selling) kills it.
- **Feel:** Watercolor, wind and seasons. A natural fit for Lucid Winds.

### 3. HOLDFAST

- **Loop:** Price waves crash in while scared townsfolk shout "SELL!" Keep your thumb on the rope; lifting it sells. Surprise bills come out of a rainy-day jar.
- **Wow moment:** The "if you'd let go" ghost line stays flat beneath your recovering line.
- **Shareable:** Named, seeded storms ("Weathered Storm Bertha").

### 4. HEIRLOOM

- **Loop:** Split this decade's money between the savings jar, the fund and shops. Fast-forward ten years of headlines, then pass the phone.
- **Session:** Parent plays generation 1, kid plays generation 2, both play generation 3.
- **Wow moment:** Great-grandma's $20 now pays for generation 3's college. A 5¢ candy bar now costs $2 (inflation).
- **Feel:** A scrapbook moving from sepia into color.

### 5. HATCHERY

- **Creatures:** Shelltoad (bonds, slow and steady), Sparkfox (one stock, fast but gets sick), Swarm (index fund, 100 tiny critters that keep growing even when a few get sick), Piggy (cash, slowly shrinks).
- **Loop:** Feed coins, collect shed feathers (dividends). In winter (a falling market) creatures hibernate and shrink, then grow in spring.
- **Gambling guard:** No random eggs or rarity tiers. Every species is chosen knowingly with its stats shown.

### 6. ALMANAC

- **Loop:** A 10-year market plays out year by year. Set your allocation at the start, with at most 3 changes.
- **Wow moment:** Everyone hits the same crash in year 6, and your result card shows whether you held.
- **Gambling guard:** One play a day removes the "one more spin" pull. A play calendar replaces streaks.
- **Feel:** Ink-printed newspaper almanac.

### 7. TRADEWIND

- **Loop:** Buy shares of airship voyages, follow them on a map, collect the cargo.
- **Wow moment:** A rival bot puts everything on one ship and loses it; your 10% slices of 10 ships still profit.
- **Teaches best:** Why shares were invented (spreading the risk of early sailing voyages).
- **Feel:** Parchment maps and brass. Fits Sky Walk and Lucid Winds, but voyages need careful handling so they don't feel like bets.

### Features that plug into any concept

1. **"What if you'd held" ghost:** your line replayed against a ghost that just held on.
2. **Rival bots:** Hasty Hal chases headlines, Mattress Mo keeps cash, Copycat Cleo buys whatever went up last week, Steady Sue holds the fund. Competition with no other players.
3. **Inflation shrink:** cash under the mattress visibly shrinks; menu prices creep from $1 to $3 cones.
4. **Fee termites:** each trade sends a termite to chew a coin.
5. **Dividend harvest:** coins you tap to pocket or replant; auto-replant earns a badge.
6. **Hedge umbrella:** a shield icon when a news event only hit part of your money.
7. **Rainy-day jar and life events:** a broken bike forces a sale at today's price if the jar is empty.
8. **Allowance autopilot:** auto-invest each month, and the game shows it bought more slices when prices were low.
9. **Doubling bell:** a soft chime and "Doubled ×3" counter each time the portfolio doubles (the rule of 72).
10. **Panic friction:** during a crash, Sell asks "Why?" ("I need the money", "I'm scared", "I found something better") and responds honestly to each.

## Recommended direction

**Build MAINSTREET as the main game, folding in the best mechanic from four other concepts, and ship ORCHARD first as a small test.** MAINSTREET covers the most gaps and maps most clearly to real investing. A visible, living town is what sets it apart from InvestQuest's lesson-app approach.

**Step 1: ORCHARD as a quick satellite.** A small standalone on lucidwinds.com that tests whether the time-slider compounding moment lands with Penny. Its slider, chart and fast-forward code carry straight into MAINSTREET.

**Step 2: MAINSTREET, with these folded in:**

- **From ORCHARD:** the Long Fast-Forward ends every session, plus the "start at 8 vs start at 18" split screen.
- **From HOLDFAST:** a storm (market slump) every few years, using the thumb-on-the-rope hold.
- **From HATCHERY:** shopkeepers with visible temperaments (a steady badger bakery, a jittery fox gadget lab). The Town Fund appears as a crowd of tiny shop icons.
- **From ALMANAC:** a seeded "Town of the Day" everyone plays identically, with a share card.
- **From HEIRLOOM:** a "Family Night" mode where parent and kid each run a household in the same seeded town, then compare side by side.

**What version 1 needs:**

- 6 shops, the Town Fund, a high-fee Pro Picker Fund, a piggy bank, a rainy-day jar and one fad asset (Glow Slime).
- About 40 news cards with set, noisy effects (see Market engine).
- One storm type, the fast-forward ending and 3 to 4 rival bots.
- Decoder cards that translate every game term into the real one.
- A habit score where returns are shown but don't drive the score.

TRADEWIND is the best fit for the Sky Walk / Lucid Winds brand. A good later expansion would be a "history of shares" chapter, if its voyages can be kept from feeling like bets.

## Market engine

The market is fictional, generated from a seed, and calibrated so it tells the truth about investing. A team agent built the model and ran it for 10,000 seeds over 20 in-game years. The numbers below come from that run. Rerun calibration once the news deck and allowance are added.

### Price model

- **Time step:** 1 tick = 1 in-game month. A daily run is 20 years (240 ticks). Auto-play runs about 0.5 seconds per tick and pauses at every headline and every January for a decision.
- **Model:** monthly geometric Brownian motion using simple returns, with three market moods (normal, boom, slump) and sector-correlated noise. Each shock is `z = β·z_market + s·z_sector + √(1−β²−s²)·z_own`.
- **Determinism:** use only `+ − × ÷ sqrt` in the engine (no `Math.exp` or `log`, which differ slightly across browsers), and Irwin-Hall noise (sum of six uniforms) instead of Box-Muller. Every device then gets the identical daily market.
- **Separate random streams** for moods, events, prices and the fad, so tuning one doesn't reshuffle the others. The whole 240-month market is generated at start in under 2 ms.

| Asset | Sector | Yearly drift | Volatility | Dividend | Market link β | Sector link s |
| --- | --- | --- | --- | --- | --- | --- |
| Lemon Lane | Food | 5% | 28% | 2% | 0.40 | 0.40 |
| Rise & Shine Bakery | Food | 4.5% | 14% | 3.5% | 0.45 | 0.35 |
| Toy Box | Fun | 6% | 24% | 1.5% | 0.55 | 0.40 |
| Spoke Bikes | Outdoor | 5.5% | 20% | 2.5% | 0.50 | 0.35 |
| Paws Pet Care | Care | 5% | 16% | 2.5% | 0.40 | 0.30 |
| Robo Lab | Tech | 9% | 36% | 0% | 0.55 | 0.35 |

- **Town Fund:** equal weight across all six, rebalanced monthly, 0.2% yearly fee.
- **Pro Picker Fund:** two random shops switched yearly, 1.5% yearly fee. It's the fees lesson.
- **Piggy Bank:** guaranteed 2% a year against 2.5% average inflation.
- **Glow Slime (the fad):** price = fundamental × hype. The fundamental shrinks 3% a year; hype pulls back toward normal, with a 2% monthly chance of a hype spike (×1.5 to ×1.9). No dividend.
- **Dividends** pay quarterly as coins, with a Replant toggle. **Trading fee:** 0.5% per trade, minimum 1 coin, dropped into a visible fee jar.

| Mood | Drift added | Volatility × | Inflation | Monthly chance of switching |
| --- | --- | --- | --- | --- |
| Normal | −1.15% | 1.0 | 2.5% | Boom 1%, Slump 0.5% |
| Boom | +6% | 0.8 | 3.5% | Normal 2.5%, Slump 0.4% |
| Slump | −20% | 1.5 | 1.5% | Normal 7%, Boom 3% |

Over time the market spends about 68% of months in Normal, 28% in Boom and 4.5% in Slump. Drift adjustments are scaled by each asset's β.

### Calibration results

Inflation-adjusted multiples of starting money after 20 years, across 10,000 seeds. The Town Fund usually wins, but a single shop beats it in about 38% of runs. A slump happens in 68% of runs.

| Strategy | Bad run (p10) | Typical (p50) | Good run (p90) | Lost to inflation | Town Fund beats it |
| --- | --- | --- | --- | --- | --- |
| Hold the Town Fund | 0.85× | 2.17× | 5.17× | 14% | — |
| Buy and hold one shop | 0.33× | 1.69× | 5.91× | 32% | 62% |
| Pro Picker Fund (1.5% fee) | 0.41× | 1.39× | 4.44× | 36% | 76% |
| Panic seller | 0.76× | 1.74× | 4.45× | 21% | 79% |
| Fad chaser | 0.07× | 0.28× | 1.14× | 88% | 98% |
| Piggy bank only | 0.82× | 0.87× | 0.91× | \~100% | 89% |

### News events

Events are scheduled when the market is generated. A mood change pulls a matching event so a slump always has a reason ("Big storm closes the bridge"). Otherwise each month has a 30% chance of one headline. Part of each effect lands *before* the headline as "town chatter" (priced in), and ordinary monthly noise is usually bigger than the event, so news is never a sure thing. The year-end recap shows the expected move against the real one.

```js
{ id:'heatwave', w:3, cooldown:12, season:[6,7,8], trigger:null,
  req:{ regime:['N','B'], minYear:1, notActive:['bigStorm'] },
  head:'Heat wave! Long lines at lemonade stands',
  explain:'Hot days mean thirsty people. But everyone saw the forecast, so part of it was already in the price.',
  fx:{ LEMN:1, BAKE:-0.25 }, mag:{ mean:0.08, sd:0.06 }, flip:0.2,
  flipHead:'Stands ran out of lemons!', pricedIn:[0.3,0.6], lead:1, dur:2, shape:'decay', infl:0 }
```

| Event | Effect |
| --- | --- |
| Heat wave | Lemon Lane +8%, Bakery −2%; 20% chance it flips |
| School starts | Bikes +5% over 3 months |
| Robo Lab wins the science fair | Robo Lab +15% (±12%); 30% chance it flips; 60% priced in |
| Robo Lab recall | Robo Lab −18% over 6 months; can't repeat for 3 years |
| Flour costs more | Bakery −6%; inflation +0.5% for 6 months |
| Everyone's talking about Glow Slime! | Glow Slime hype ×1.6 to ×2.2; Toy Box −3% |
| Glow Slime is "so last year" | Glow Slime −30% to −50% over 3 months; only after an 80%+ rise |
| Big storm closes the bridge | Starts a slump; everything −8% |
| Bridge reopens | Ends a slump; everything +4% |
| Shelter adoption day | Pets +6%; 15% chance it flips |

Events must not quietly change long-run returns: subtract each asset's expected yearly event shock from its drift.

### Daily market, sharing and ghosts

- **Seed:** `'CS1|' + localDate`. `CS1` is the engine version, so a balance change creates a new market instead of a broken one. Free play uses random seeds.
- **Share card** (copied to the clipboard, no personal data). Each square is 2 years; blue up, orange down (color-blind safe):

```
MAINSTREET Oct 10 · Score 86
🟦🟦🟧🟦🟦🟦🟧🟦🟦🟦
Grew 2.4× · beat price creep ✔  #K7QD
```

- **Check code:** a short hash of date, score, final value and badges. It deters casual editing; an optional replay link can verify a run with no server.
- **Ghosts:** because prices are pre-generated, the recap replays "if you'd held the Town Fund", "if you'd kept it all in the piggy bank" and "if you hadn't sold in the slump" on the same market.

### Scoring: the habit score (0 to 100)

| Part | Points | How it's measured |
| --- | --- | --- |
| Spread | 30 | Effective number of holdings (1 ÷ Herfindahl index, looking through the Town Fund), averaged over time |
| Patience | 25 | Average share of money invested rather than idle |
| Calm | 25 | Full marks if net selling during slumps is 10% or less of holdings; zero at 60% |
| Beat the price creep | 10 | Finished ahead of inflation |
| Smooth ride | 10 | Worst drop no more than 10 points worse than the Town Fund ghost |

Raw return is shown but isn't part of the score. **Badges:** Basket Weaver (4+ effective holdings), Steady Oak (didn't sell in a slump), Seed Replanter (Replant on 15+ years), Fee Detective (chose the Town Fund over Pro Picker), Slow & Steady (12 or fewer trades).

## Technical architecture

One `index.html` holds the whole game, with a pure engine script kept apart from the UI so it can be tested headlessly. A PWA can't be fully single-file, so it ships two tiny companion files.

**Files**

| File | Purpose |
| --- | --- |
| `index.html` | `<style>`, then `<script id="engine">` (pure functions, no DOM), then `<script id="app">` (store, screens, charts, persistence) |
| `sw.js` | About 20 lines, cache-first, versioned cache name. Serve with `Cache-Control: no-cache` |
| `manifest.webmanifest` + icons | Install prompt. Don't use blob or data URLs: browsers refuse blob service workers, and data manifests break install on Android and iOS |
| `tools/harness.mjs` | Balance harness, not deployed |

**Inside `index.html`**

- **Engine:** PRNG (cyrb128 + sfc32), parameters, the event deck, `genMarket(seed)`, `applyAction`, `score`, `ghost`. Exposed as `globalThis.ENGINE`.
- **App:** a store (`state` → `dispatch` → reducer → debounced save → redraw changed screens). Screens: Home, Town/Market, Trade sheet, News, Year-end recap, Results, Debug.

**Save format:** store the action log, not derived state, and rebuild by replay. It stays under 5 KB in `localStorage` (`cs:save`), wrapped in try/catch, with versioned migrations. A corrupt save is copied to `cs:bad` and the game starts fresh.

```js
{ v:2, eng:'CS1', mode:'daily', seed:'2026-10-10', t:137,
  log:[[12,'B','TOWN',250],[30,'S','GLOO',0],[31,'D',1]],
  opts:{drip:1, speed:1, tts:0},
  hist:[{d:'2026-10-09', s:86, x:2.41, b:'BCP'}] }
```

**Performance on old phones and tablets**

- Prices in a `Float64Array`. One `requestAnimationFrame` loop that redraws only when the tick changes.
- Canvas `devicePixelRatio` capped at 2. No CSS filters or shadows. System fonts. HTML under 150 KB.
- Respect `prefers-reduced-motion`.

**Charts (hand-drawn, no library)**

- Canvas line with event dots, a dashed "what it can buy" line adjusted for inflation, and ghost lines in the recap.
- A "Growth view" toggle with a log scale, so compounding shows as a steady climb.
- Small SVG sparklines in the shop list.

**Accessibility**

- Tap targets 48 px or larger. Up and down shown as ▲ blue / ▼ orange plus text ("+3%"), never color alone.
- Headlines 12 words or fewer; explanations two sentences at about a grade 2 to 4 reading level.
- Optional read-aloud with `speechSynthesis`; `aria-live` on news. No time pressure anywhere.

**Testing**

- **Headless harness:** extracts the engine script and runs it in Node's `vm` with bot strategies (fund holder, one-pick, Pro Picker, panic seller, fad chaser, piggy-only, rebalancer, random clicker) across 10,000 seeds. It fails if results drift out of bounds:
  - Town Fund median real multiple between 1.8× and 2.6×
  - Town Fund beats a single pick in 55% to 70% of runs, and the fad chaser in 90%+
  - At least one slump in 55%+ of runs
  - Piggy-only finishes behind inflation in 95%+ of runs
  - Each asset's realized drift within ±0.5% of target
- **Golden test:** hash `genMarket('CS1|2026-01-01')` to the cent so any accidental engine change is caught.
- **Debug panel** (`?debug` or a 3-second press on the logo): seed input, jump to month, ×10 speed, mood ribbon over the chart, event log with expected vs real shocks, force an event, toggle fees and inflation, run 1,000 sims in chunks, export the save as JSON.

## Open questions

Each reviewer should answer what they can, add new questions, and leave Stephen's decisions marked for him.

**For Stephen**

- [ ] Final title. MAINSTREET is a working title; the engine notes used "Coin Garden" as a placeholder.
- [ ] Ship ORCHARD first as a test, or go straight to MAINSTREET?
- [ ] Core age band: 7 to 10 (simpler, more toy-like) or 10 to 13 (more numbers, more choices)?
- [ ] Is the daily seeded "Town of the Day" in version 1, or added after launch?
- [ ] Is Family Night (parent and kid on one device) in version 1?
- [ ] Where it ships: the Lucid Winds arcade only, or also the Play Store?

**For Fable (review round)**

- [ ] Is the MAINSTREET hybrid the right call, or does a different concept or combination win?
- [ ] Is version 1 too big for one Opus build? Propose milestones if so.
- [ ] Does the habit score feel fair and understandable to a 9-year-old?
- [ ] Should a "history of shares" chapter (from TRADEWIND) or a hype and crypto-literacy chapter (built on Glow Slime) be planned for later?

**For Astra (UI/UX and fun round)**

- [ ] The first 60 seconds: how does a 7-year-old understand "buy a slice" with no reading wall?
- [ ] The town view: art direction, what moves, and how cause and effect is shown on the street.
- [ ] The trade sheet: simplest possible buy/sell flow, with the fee and panic-friction prompts.
- [ ] The year-end recap and fast-forward: how to make compounding the big emotional moment.
- [ ] Where does fun come from between decisions, so it doesn't feel like watching a chart?

**For the final Fable build plan**

- [ ] Lock the asset list, event deck size and scoring weights; rerun calibration with events and allowance included.
- [ ] Write the HANDOFF.md with milestones, acceptance tests (the harness bounds above) and a playtest checklist for Penny.
