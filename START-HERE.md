# START HERE (MAINSTREET pickup, 2026-10-11)

For the Sky Wolf dev team, and for any Claude Code session opening this repo cold. Ten minutes here saves a day.

## What this is

MAINSTREET is a free, offline, kid-safe investing-habits game for ages 8 to 11: six chapters, then twenty years of free play in named towns. One `index.html` plus `sw.js`, `manifest.webmanifest`, `icons/`, `art/` and `music/` are the whole game. No build step, no framework, no network during play, no accounts, no sunbeams or studio currency (Director's ruling R01). `HANDOFF.md` is the spec and the single source of truth; nothing in its section 16 backlog is authorized for v1.

## State at pickup

- Tag `v1.0.0-rc3` on `main`. Everything in the spec is built and tested: 131 engine tests (`npm test`) and 62 browser journeys in Chromium and WebKit (`npm run ui`) are green. CI runs both on every push (`.github/workflows/tests.yml`).
- Every sprite slot holds first-pass generated art; Astra's renders replace them file by file. The music lane is built and empty; Stephen's songs drop in by feel.
- `STATUS.md` is the current state in one page. `docs/WORKLOG.md` has every milestone box with its evidence. `docs/decisions.md` has every choice the build made, newest first. `docs/RELEASE-NOTES.md` says what each candidate carries.

## Open items and owners

| Item | Owner | Where |
| --- | --- | --- |
| Enable GitHub Pages (`main`, root), then the airplane-mode check on the live URL | Stephen | `docs/WORKLOG.md` M0 and M5 |
| The fun gate: Penny plays chapter 1 and 2; Stephen rules proceed or fix | Stephen | `docs/playtest.md` |
| Songs in `music/` with feels assigned | Stephen | `docs/MUSIC.md` |
| Sprites in `art/`, batch by batch | Astra (art lane) | `docs/ART-BRIEF.md`, `docs/art/ASSET-LIST.md` |
| Vendor into lucid-winds with the portal card `beta:true` | dev team | `docs/FLEET-HANDOFF.md` section 9 (a one-paste patch) |
| Reference device: name it, run the performance line and a TalkBack pass | dev team | `STATUS.md`, `docs/playtest.md` |
| Five to eight children playtested, release blockers tallied | dev team with Stephen | `docs/playtest.md`, HANDOFF section 15 |
| Ship v1.0.0: remove the beta gate line in the embed block, drop `beta:true`, tag, release notes | dev team | `docs/FLEET-HANDOFF.md` |

## Set up

```bash
npm run setup        # npm install, Playwright with Chromium and WebKit, Pillow if available
npm test             # engine tests, fixtures, content rules, art-slot guard (seconds)
npm run ui           # browser journeys in both engines (about 2 minutes)
```

A Codespace or VS Code devcontainer runs setup itself (`.devcontainer/devcontainer.json`).

## The editing loop

`index.html` is the source. It holds four blocks in this order: `<style>`, `<script id="content">` (data only: PARAMS, CONTENT, STRINGS), `<script id="engine">` (pure: no DOM, Date, Math.random, fetch, storage, timers), `<script id="app">` (store and screens). The content block must stay before the engine block.

```bash
npm run split        # writes src/styles.css, content.js, engine.js, app.js, shell.html (src/ is ignored by git)
#   edit under src/
npm run join         # rebuilds index.html; refuses a block with a syntax error
npm run check        # engine tests, join --check, browser journeys
```

Commit `index.html`, never `src/`. The rules the tests enforce:

- The engine stays pure (`tools/lib.mjs` greps for forbidden calls) and deterministic; money is integer centi-coins; conservation laws hold exactly.
- The eight golden fixtures in `tools/fixtures/` must replay identically. A locked number may change only with an entry in `docs/decisions.md`, a version bump (`MS1`, `DECK2`, `PLAN1` in the content block and `VERSION` in `sw.js`), and `node tools/test.mjs --write-fixtures` in the same commit.
- Player copy: no dashes anywhere, exclamation marks only on goal day and chapter end, no coins or arrows or numbers in art, 48 px touch targets, no flashing red during drops.
- Every art slot the game can request must exist in `art/manifest.json` (the guard test enumerates them).

## The lanes

- **Art**: `docs/ART-BRIEF.md`. Drop a WebP with the slot's exact name into `art/`, run `npm run art`, bump `VERSION` in `sw.js`. `node tools/gen_art.mjs --only=<slot>` regenerates a first-pass placeholder if one is ever needed again.
- **Music**: `docs/MUSIC.md`. Drop mp3 files into `music/`, list them with a feel in `music/manifest.json`, map moments to feels, run `npm run music`, bump `VERSION` in `sw.js`. Then add `ownMusic:true` to the portal card.

## The arcade

`docs/FLEET-HANDOFF.md` is the whole vendoring note. Section 9 has a ready-made patch and the one-paste instruction for a lucid-winds session; the arcade's `.gitignore` ignores `music/`, so force-add it after a re-vendor. The game is carded `beta:true` behind the tester key until the playtest passes.

## Writing things down

- A choice the spec left open, or a locked number that changes: one line in `docs/decisions.md`, newest first (date, milestone, who, what, why, where).
- Progress: tick the box in `docs/WORKLOG.md` with its evidence; refresh `STATUS.md` (one page, newest first).
- Commits on `main`, one per finished piece, with the evidence (test counts) in the message.

## Paste this into a fresh Claude Code session in this repo

> You are picking up MAINSTREET, a finished-to-spec kids' investing game. Read START-HERE.md, then STATUS.md, then the first unticked box in docs/WORKLOG.md. HANDOFF.md is the spec; section 16 is not authorized. Edit through `npm run split` and `npm run join`, never commit `src/`. Run `npm test` and `npm run ui` before every commit and put the counts in the commit message. Log every open choice in docs/decisions.md. Keep the Director's rulings: no sunbeams, no earn hooks, no dashes in player text, exclamation marks only on goal day and chapter end, nothing that looks like a payout. Ask Stephen before changing a locked number or starting a backlog item.
