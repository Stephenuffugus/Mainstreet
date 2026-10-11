# Calibration, MAINSTREET

## v1 toy model (reference only)

Output of `node tools/calibrate-v1.js` on 2026-10-11 (Node v24.21.0). This is the round-1 model: total return as drift plus yield, no events, no contributions, no neighbors, 10,000 seeds, 240 months, inflation-adjusted multiples. It is the starting tuning candidate, not a result of the finished engine. The real report replaces this section at M6 (HANDOFF section 14).

```
town      real x p10/p50/p90 0.85 / 2.17 / 5.17  P(real loss) 0.14 
pro       real x p10/p50/p90 0.41 / 1.39 / 4.44  P(real loss) 0.36  P(town wins) 0.76
pick1     real x p10/p50/p90 0.33 / 1.69 / 5.91  P(real loss) 0.32  P(town wins) 0.62
pick2     real x p10/p50/p90 0.61 / 1.90 / 5.52  P(real loss) 0.22  P(town wins) 0.59
panic     real x p10/p50/p90 0.76 / 1.74 / 4.45  P(real loss) 0.21  P(town wins) 0.79
fadchase  real x p10/p50/p90 0.07 / 0.28 / 1.14  P(real loss) 0.88  P(town wins) 0.98
piggy     real x p10/p50/p90 0.82 / 0.87 / 0.91  P(real loss) 1.00  P(town wins) 0.89
slump runs 0.6822 town maxDD p50/p90 0.33 0.53 pi [ '0.676', '0.279', '0.045' ]
```

Reading: `town` is the equal-weight basket at 0.2%; `pro` a two-pick fund at 1.5%; `pick1` one shop held; `pick2` two shops; `panic` sells at a 20% drawdown and re-enters 15% up; `fadchase` chases the hype asset (not in launch); `piggy` cash at 2% against 2.5% inflation. `pi` is the stationary mood mix (Normal, Boom, Slump).

## M6 reading (2026-10-11, content DECK2)

What the held-out run says, in the order HANDOFF section 14 asks for. Every number below is from the tables that follow; seeds are the held-out set, never the tuning set.

- **Shops land on their design totals.** In free play (standard, 10,000 towns, 240 months) the realized arithmetic mean total return sits within 0.2 points of the v1 design total for every shop (LEMN 6.83% for 7.0, BAKE 7.95% for 8.0, TOYS 7.60% for 7.5, BIKE 8.00% for 8.0, PAWS 7.47% for 7.5, ROBO 8.91% for 9.0). DECK1 had sat 0.1 to 0.9 points under; DECK2 moved each drift up by its measured gap (decision logged in `docs/decisions.md`). The gap between "drift + yield" and the design total is the average cost of the authored moods and events.
- **Volatility drag is visible and intended.** Median growth (geometric) runs below the arithmetic mean by about 1 point for the calm shops (BAKE, PAWS, BIKE) and by 3.5 to 6 points for the jumpy ones (LEMN, ROBO). Robo Lab's 9% headline becomes about 3% in the typical town. That is the chapter 2 lesson in numbers.
- **The neighbors keep their intended order at the median and in spread.** Free play: Ada 4,901, Cass 4,511, Dev 4,156, Bo 2,548 coins (random bot 3,440). Bo's p10 to p90 band is 2,428 to 2,656; Dev's is 1,569 to 10,986 with a 75% drawdown at p90. Cass trails Ada by about 8% at the median and makes 13 moves; her loss-stop sells after drops and re-enters higher. Every neighbor funds the goal in 100% of towns. The same order holds in chapters 2, 3, 4 and 6.
- **Chapter 5 is the exception, by design.** With the authored slump in every run, the jar wins at the median (Bo 792, random 756, Ada 746, Cass 737, Dev 713) and Ada's investment gain is about 13 coins over five years. HANDOFF section 2 asks for "no recovery promised, no sale condemned"; the numbers deliver that. Dev's p10 of 377 is the closure variant landing on his shop.
- **Presets stress what they say.** Early Storm and Late Storm cost each shop about 1 point a year over 20 years and leave the order intact. Long Quiet (no booms, two points slower) halves the shops' returns (3 to 4% arithmetic, Lemon Lane and Robo Lab negative at the median) and brings Bo within 8% of Ada: the world where a jar is nearly as good. Rising Prices leaves nominal totals alone and cuts real totals roughly in half (Ada real 1,669 against 2,858 standard); the jar's real p50 is 880. Savings Pay Well lifts Bo to 3,424 nominal, still a third below Ada. Shops Can Close has a closure in every town; Dev's drawdown p90 reaches 79% and Ada's basket absorbs it.
- **Plan Practice is sane.** The planner bot scores 100 everywhere and Ada 65 to 100; the random bot's median is 15 to 33, so the rubric separates intent from luck. Bo scores 100 in free play and 56 in chapter 4, where never routing to the basket costs him the spread dimension, as intended.
- **Open calibration items for after the playtest:** none blocking. If children read Long Quiet as "shops are bad," the preset copy, not the numbers, is the place to adjust.

## Finished engine (M6)

Engine MS1 · Content DECK2 · Rubric PLAN1 · generated 2026-10-11 by `node tools/harness.mjs --seeds 10000 --family all --heldout` in 211.1 s on this machine. Seeds follow the rule `v|<family>|<k>`. Realized total return is the mean annualized product of monthly factors with events included; the gap compares the arithmetic mean of monthly simple returns (times 12) with drift plus yield, which is what the drift parameter means; the geometric column is the median-style growth that variance drag pulls below it (HANDOFF 4). "Investment gain" is the ledger's market change plus interest, not final divided by initial wealth.

### free (standard), 10000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 2510 / 4901 / 9634 | 1489 / 2858 / 5510 | 2892 | 33% / 48% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 2428 / 2548 / 2656 | 1375 / 1489 / 1586 | 544 | 32% / 34% | 100% | 90% | 69 / 100 / 100 | 0 |
| cass | 2381 / 4511 / 9354 | 1414 / 2631 / 5381 | 2510 | 34% / 48% | 100% | 58% | 54 / 60 / 74 | 13 |
| dev | 1569 / 4156 / 10986 | 922 / 2427 / 6270 | 2165 | 48% / 75% | 100% | 60% | 53 / 53 / 53 | 0 |
| random | 2262 / 3440 / 6070 | 1341 / 2007 / 3481 | 1432 | 33% / 45% | 100% | 85% | 18 / 33 / 53 | 0 |
| planner | 2510 / 4901 / 9634 | 1489 / 2858 / 5510 | 2892 | 33% / 48% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 68% of runs · closures 0 · surprise costs per run 5.02

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.83% | -0.17 | 3.24% |
| BAKE | 8.00% | 8.40% | 7.95% | -0.05 | 7.27% |
| TOYS | 7.50% | 8.10% | 7.60% | 0.10 | 5.05% |
| BIKE | 8.00% | 8.70% | 8.00% | -0.00 | 6.33% |
| PAWS | 7.50% | 7.60% | 7.47% | -0.03 | 6.47% |
| ROBO | 9.00% | 9.40% | 8.91% | -0.09 | 2.86% |

### ch2, 10000 seeds, held-out set, 36 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 117 / 174 / 255 | 117 / 174 / 255 | 34 | 15% / 26% | 100% |  | 69 / 100 / 100 | 0 |
| bo | 140 / 140 / 140 | 140 / 140 / 140 | 0 | 0% / 0% | 100% | 76% | 100 / 100 / 100 | 0 |
| cass | 109 / 171 / 260 | 109 / 171 / 260 | 31 | 16% / 25% | 100% | 48% | 54 / 70 / 100 | 2 |
| dev | 80 / 165 / 298 | 80 / 165 / 298 | 25 | 25% / 48% | 100% | 56% | 38 / 38 / 56 | 0 |
| random | 119 / 145 / 212 | 119 / 145 / 212 | 4 | 9% / 26% | 98% | 67% | 0 / 15 / 69 | 0 |
| planner | 117 / 174 / 255 | 117 / 174 / 255 | 34 | 15% / 26% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 0% of runs · closures 0 · surprise costs per run 0.00

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.14% | -0.86 | 3.59% |
| BAKE | 8.00% | 8.40% | 7.19% | -0.81 | 6.74% |
| TOYS | 7.50% | 8.10% | 6.58% | -0.92 | 4.76% |
| BIKE | 8.00% | 8.70% | 7.30% | -0.70 | 6.12% |
| PAWS | 7.50% | 7.60% | 6.75% | -0.75 | 6.06% |
| ROBO | 9.00% | 9.40% | 8.59% | -0.41 | 4.31% |

### ch3, 10000 seeds, held-out set, 36 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 77 / 129 / 203 | 77 / 129 / 203 | 32 | 19% / 32% | 100% |  | 76 / 76 / 76 | 0 |
| bo | 103 / 109 / 116 | 103 / 109 / 116 | 12 | 11% / 14% | 100% | 67% | 69 / 69 / 69 | 0 |
| cass | 74 / 127 / 206 | 74 / 127 / 206 | 29 | 20% / 31% | 99% | 48% | 61 / 65 / 76 | 2 |
| dev | 54 / 122 / 238 | 54 / 122 / 238 | 24 | 27% / 50% | 97% | 53% | 53 / 53 / 53 | 0 |
| random | 77 / 109 / 175 | 77 / 109 / 175 | 10 | 16% / 33% | 98% | 64% | 0 / 24 / 47 | 0 |
| planner | 77 / 129 / 203 | 77 / 129 / 203 | 32 | 19% / 32% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 0% of runs · closures 0 · surprise costs per run 1.00

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.70% | -0.30 | 4.16% |
| BAKE | 8.00% | 8.40% | 7.24% | -0.76 | 6.79% |
| TOYS | 7.50% | 8.10% | 6.56% | -0.94 | 4.74% |
| BIKE | 8.00% | 8.70% | 7.30% | -0.70 | 6.13% |
| PAWS | 7.50% | 7.60% | 6.80% | -0.70 | 6.11% |
| ROBO | 9.00% | 9.40% | 8.40% | -0.60 | 4.15% |

### ch4, 10000 seeds, held-out set, 60 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 611 / 828 / 1125 | 611 / 828 / 1125 | 198 | 8% / 13% | 100% |  | 69 / 69 / 69 | 0 |
| bo | 677 / 677 / 677 | 677 / 677 / 677 | 47 | 0% / 0% | 100% | 80% | 56 / 56 / 56 | 0 |
| cass | 580 / 819 / 1156 | 580 / 819 / 1156 | 189 | 10% / 20% | 100% | 56% | 45 / 49 / 62 | 3 |
| dev | 488 / 799 / 1266 | 488 / 799 / 1266 | 169 | 16% / 35% | 100% | 55% | 38 / 38 / 38 | 0 |
| random | 597 / 691 / 882 | 597 / 691 / 882 | 61 | 4% / 12% | 99% | 79% | 0 / 15 / 54 | 0 |
| planner | 611 / 828 / 1125 | 611 / 828 / 1125 | 198 | 8% / 13% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 0% of runs · closures 0 · surprise costs per run 0.00

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 7.37% | 0.37 | 4.53% |
| BAKE | 8.00% | 8.40% | 8.25% | 0.25 | 7.79% |
| TOYS | 7.50% | 8.10% | 8.25% | 0.75 | 6.29% |
| BIKE | 8.00% | 8.70% | 8.39% | 0.39 | 7.12% |
| PAWS | 7.50% | 7.60% | 7.78% | 0.28 | 7.05% |
| ROBO | 9.00% | 9.40% | 10.40% | 1.40 | 5.65% |

### ch5, 10000 seeds, held-out set, 60 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 529 / 746 / 1079 | 529 / 746 / 1079 | 13 | 18% / 30% | 100% |  | 76 / 76 / 76 | 0 |
| bo | 774 / 792 / 813 | 774 / 792 / 813 | 62 | 1% / 4% | 100% | 41% | 69 / 69 / 69 | 0 |
| cass | 542 / 737 / 1085 | 542 / 737 / 1085 | 1 | 18% / 31% | 100% | 51% | 59 / 65 / 76 | 3 |
| dev | 377 / 713 / 1226 | 377 / 713 / 1226 | -21 | 29% / 58% | 100% | 56% | 53 / 53 / 53 | 0 |
| random | 597 / 756 / 947 | 597 / 756 / 947 | 20 | 8% / 23% | 98% | 49% | 0 / 24 / 49 | 0 |
| planner | 529 / 746 / 1079 | 529 / 746 / 1079 | 13 | 18% / 30% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 100% of runs · closures 3225 · surprise costs per run 0.50

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 2.33% | -4.67 | -1.73% |
| BAKE | 8.00% | 8.40% | 2.89% | -5.11 | 1.87% |
| TOYS | 7.50% | 8.10% | 1.52% | -5.98 | -1.27% |
| BIKE | 8.00% | 8.70% | 2.28% | -5.72 | 0.20% |
| PAWS | 7.50% | 7.60% | 2.96% | -4.54 | 1.63% |
| ROBO | 9.00% | 9.40% | 2.08% | -6.92 | -4.17% |

### ch6, 10000 seeds, held-out set, 120 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 1091 / 1867 / 3108 | 850 / 1428 / 2341 | 779 | 16% / 27% | 100% |  | 65 / 81 / 81 | 0 |
| bo | 1249 / 1280 / 1310 | 931 / 984 / 1020 | 192 | 2% / 5% | 100% | 82% | 75 / 75 / 75 | 0 |
| cass | 1036 / 1798 / 3202 | 802 / 1375 / 2423 | 694 | 19% / 32% | 98% | 55% | 52 / 63 / 69 | 6 |
| dev | 720 / 1732 / 3638 | 553 / 1328 / 2743 | 645 | 29% / 53% | 100% | 57% | 45 / 45 / 56 | 0 |
| random | 1059 / 1418 / 2109 | 817 / 1088 / 1598 | 328 | 10% / 21% | 99% | 81% | 0 / 20 / 42 | 0 |
| planner | 1091 / 1867 / 3108 | 850 / 1428 / 2341 | 779 | 16% / 27% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 44% of runs · closures 0 · surprise costs per run 0.51

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.78% | -0.22 | 3.39% |
| BAKE | 8.00% | 8.40% | 7.71% | -0.29 | 7.07% |
| TOYS | 7.50% | 8.10% | 7.27% | -0.23 | 4.86% |
| BIKE | 8.00% | 8.70% | 7.74% | -0.26 | 6.16% |
| PAWS | 7.50% | 7.60% | 7.28% | -0.22 | 6.33% |
| ROBO | 9.00% | 9.40% | 9.25% | 0.25 | 3.57% |

Appended by `node tools/harness.mjs --seeds 2000 --family free --preset early-storm --heldout` in 16.7 s.

### free (early-storm), 2000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 2430 / 4771 / 9325 | 1460 / 2811 / 5324 | 2774 | 33% / 47% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 2438 / 2557 / 2664 | 1392 / 1507 / 1607 | 546 | 32% / 34% | 100% | 88% | 69 / 100 / 100 | 0 |
| cass | 2285 / 4361 / 9143 | 1368 / 2552 / 5250 | 2373 | 35% / 48% | 100% | 60% | 47 / 60 / 73 | 13 |
| dev | 1645 / 4119 / 10029 | 972 / 2439 / 5835 | 2102 | 48% / 74% | 100% | 61% | 53 / 53 / 53 | 0 |
| random | 2241 / 3413 / 6080 | 1351 / 2009 / 3499 | 1407 | 33% / 44% | 100% | 82% | 19 / 32 / 53 | 0 |
| planner | 2430 / 4771 / 9325 | 1460 / 2811 / 5324 | 2774 | 33% / 47% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 100% of runs · closures 0 · surprise costs per run 5.01

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.40% | -0.60 | 2.57% |
| BAKE | 8.00% | 8.40% | 6.97% | -1.03 | 6.15% |
| TOYS | 7.50% | 8.10% | 6.60% | -0.90 | 3.82% |
| BIKE | 8.00% | 8.70% | 7.03% | -0.97 | 5.16% |
| PAWS | 7.50% | 7.60% | 6.67% | -0.83 | 5.53% |
| ROBO | 9.00% | 9.40% | 7.85% | -1.15 | 1.35% |

Appended by `node tools/harness.mjs --seeds 2000 --family free --preset late-storm --heldout` in 17.1 s.

### free (late-storm), 2000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 2008 / 3846 / 7866 | 1203 / 2263 / 4563 | 1833 | 37% / 52% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 2428 / 2548 / 2655 | 1397 / 1506 / 1606 | 544 | 32% / 34% | 100% | 79% | 69 / 100 / 100 | 0 |
| cass | 2017 / 3654 / 7961 | 1201 / 2158 / 4606 | 1661 | 36% / 49% | 100% | 53% | 55 / 60 / 69 | 13 |
| dev | 1235 / 3255 / 9003 | 741 / 1932 / 5192 | 1243 | 52% / 79% | 100% | 60% | 53 / 53 / 53 | 0 |
| random | 2021 / 2970 / 5239 | 1205 / 1747 / 3061 | 962 | 34% / 46% | 100% | 77% | 19 / 32 / 52 | 0 |
| planner | 2008 / 3846 / 7866 | 1203 / 2263 / 4563 | 1833 | 37% / 52% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 100% of runs · closures 0 · surprise costs per run 5.03

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 5.91% | -1.09 | 2.04% |
| BAKE | 8.00% | 8.40% | 6.85% | -1.15 | 6.02% |
| TOYS | 7.50% | 8.10% | 6.25% | -1.25 | 3.41% |
| BIKE | 8.00% | 8.70% | 6.68% | -1.32 | 4.78% |
| PAWS | 7.50% | 7.60% | 6.36% | -1.14 | 5.20% |
| ROBO | 9.00% | 9.40% | 7.64% | -1.36 | 1.10% |

Appended by `node tools/harness.mjs --seeds 2000 --family free --preset long-quiet --heldout` in 16.5 s.

### free (long-quiet), 2000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 1546 / 2764 / 5087 | 957 / 1699 / 3111 | 760 | 40% / 56% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 2447 / 2563 / 2670 | 1497 / 1574 / 1648 | 547 | 31% / 33% | 100% | 57% | 69 / 100 / 100 | 0 |
| cass | 1584 / 2704 / 5391 | 977 / 1667 / 3311 | 699 | 39% / 53% | 100% | 49% | 47 / 60 / 70 | 13 |
| dev | 953 / 2402 / 6236 | 592 / 1475 / 3828 | 401 | 56% / 82% | 100% | 59% | 53 / 53 / 53 | 0 |
| random | 1749 / 2534 / 3946 | 1075 / 1550 / 2404 | 514 | 36% / 49% | 100% | 61% | 19 / 32 / 50 | 0 |
| planner | 1546 / 2764 / 5087 | 957 / 1699 / 3111 | 760 | 40% / 56% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 70% of runs · closures 0 · surprise costs per run 5.00

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 3.05% | -3.95 | -1.01% |
| BAKE | 8.00% | 8.40% | 3.93% | -4.07 | 2.95% |
| TOYS | 7.50% | 8.10% | 3.07% | -4.43 | 0.06% |
| BIKE | 8.00% | 8.70% | 3.71% | -4.29 | 1.65% |
| PAWS | 7.50% | 7.60% | 3.80% | -3.70 | 2.50% |
| ROBO | 9.00% | 9.40% | 4.23% | -4.77 | -2.54% |

Appended by `node tools/harness.mjs --seeds 2000 --family free --preset rising-prices --heldout` in 16.9 s.

### free (rising-prices), 2000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 2319 / 4528 / 8765 | 855 / 1669 / 3231 | 2634 | 38% / 54% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 2263 / 2386 / 2489 | 834 / 880 / 918 | 515 | 40% / 43% | 100% | 89% | 69 / 100 / 100 | 0 |
| cass | 2175 / 4199 / 8777 | 802 / 1548 / 3236 | 2333 | 39% / 55% | 100% | 57% | 54 / 60 / 74 | 13 |
| dev | 1370 / 3781 / 10250 | 505 / 1394 / 3778 | 1906 | 52% / 79% | 100% | 62% | 53 / 53 / 53 | 0 |
| random | 2108 / 3228 / 5683 | 777 / 1190 / 2095 | 1369 | 41% / 53% | 100% | 83% | 17 / 30 / 46 | 0 |
| planner | 2319 / 4528 / 8765 | 855 / 1669 / 3231 | 2634 | 38% / 54% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 69% of runs · closures 0 · surprise costs per run 4.96

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.59% | -0.41 | 2.98% |
| BAKE | 8.00% | 8.40% | 7.74% | -0.26 | 7.04% |
| TOYS | 7.50% | 8.10% | 7.44% | -0.06 | 4.85% |
| BIKE | 8.00% | 8.70% | 7.77% | -0.23 | 6.07% |
| PAWS | 7.50% | 7.60% | 7.26% | -0.24 | 6.23% |
| ROBO | 9.00% | 9.40% | 8.70% | -0.30 | 2.63% |

Appended by `node tools/harness.mjs --seeds 2000 --family free --preset savings-pay-well --heldout` in 16.3 s.

### free (savings-pay-well), 2000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 2693 / 5010 / 10187 | 2205 / 4102 / 8341 | 2943 | 30% / 45% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 3273 / 3424 / 3553 | 2680 / 2804 / 2909 | 1338 | 24% / 25% | 100% | 78% | 69 / 100 / 100 | 0 |
| cass | 2599 / 4777 / 9725 | 2128 / 3911 / 7963 | 2682 | 32% / 44% | 100% | 57% | 55 / 60 / 75 | 13 |
| dev | 1704 / 4332 / 11104 | 1395 / 3547 / 9092 | 2247 | 46% / 73% | 100% | 61% | 53 / 53 / 53 | 0 |
| random | 2548 / 3797 / 6367 | 2086 / 3109 / 5213 | 1718 | 27% / 39% | 100% | 81% | 19 / 34 / 56 | 0 |
| planner | 2693 / 5010 / 10187 | 2205 / 4102 / 8341 | 2943 | 30% / 45% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 68% of runs · closures 0 · surprise costs per run 5.01

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.81% | -0.19 | 3.23% |
| BAKE | 8.00% | 8.40% | 7.85% | -0.15 | 7.16% |
| TOYS | 7.50% | 8.10% | 7.52% | 0.02 | 4.97% |
| BIKE | 8.00% | 8.70% | 7.94% | -0.06 | 6.27% |
| PAWS | 7.50% | 7.60% | 7.46% | -0.04 | 6.46% |
| ROBO | 9.00% | 9.40% | 8.95% | -0.05 | 2.92% |

Appended by `node tools/harness.mjs --seeds 2000 --family free --preset shops-can-close --heldout` in 17.0 s.

### free (shops-can-close), 2000 seeds, held-out set, 240 months

| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ada | 2420 / 4469 / 8647 | 1452 / 2602 / 4923 | 2473 | 34% / 49% | 100% |  | 76 / 76 / 100 | 0 |
| bo | 2425 / 2551 / 2656 | 1375 / 1486 / 1585 | 544 | 32% / 34% | 100% | 88% | 69 / 100 / 100 | 0 |
| cass | 2283 / 4133 / 8722 | 1362 / 2399 / 4913 | 2116 | 35% / 50% | 100% | 57% | 55 / 60 / 74 | 12 |
| dev | 1567 / 3878 / 10001 | 910 / 2239 / 5670 | 1857 | 51% / 79% | 100% | 61% | 53 / 53 / 69 | 0 |
| random | 2192 / 3180 / 5271 | 1292 / 1860 / 3023 | 1190 | 34% / 46% | 100% | 84% | 18 / 31 / 54 | 0 |
| planner | 2420 / 4469 / 8647 | 1452 / 2602 / 4923 | 2473 | 34% / 49% | 100% | 0% | 100 / 100 / 100 | 0 |

Slump in 68% of runs · closures 2000 · surprise costs per run 4.97

| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |
| --- | --- | --- | --- | --- | --- |
| LEMN | 7.00% | 7.90% | 6.83% | -0.17 | 3.26% |
| BAKE | 8.00% | 8.40% | 7.96% | -0.04 | 7.29% |
| TOYS | 7.50% | 8.10% | 7.31% | -0.19 | 4.89% |
| BIKE | 8.00% | 8.70% | 7.85% | -0.15 | 6.19% |
| PAWS | 7.50% | 7.60% | 7.48% | -0.02 | 6.49% |
| ROBO | 9.00% | 9.40% | 8.66% | -0.34 | 2.97% |
