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

## Finished engine (M6)

Not yet run. Produce with `node tools/harness.mjs --seeds 10000 --report docs/calibration.md`.
