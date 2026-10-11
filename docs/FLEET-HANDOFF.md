# MAINSTREET, fleet handoff (for the Lucid Winds Claude)

Modeled on the Blooming Words handoff per `NEW_SATELLITE_BRIEF.md`; the contract is `incoming/PORTAL-CONTRACT.md`. Ruling R01 (Stephen, 2026-10-11): this satellite carries **no sunbeams, no earn messages, no music-unlocks include**. Please do not add them during vendoring.

## 1. Where it lives

- Repo: `Stephenuffugus/Mainstreet`, branch `main`, GitHub Pages from `main` at `/ (root)`, legacy build (the branch tree is the site). Deploys happen on push to `main`.
- Live URL (once Pages is enabled by Stephen): `https://stephenuffugus.github.io/Mainstreet/`
- Release candidate: tag `v1.0.0-rc1`.

## 2. File manifest

Deployable: `index.html`, `sw.js`, `manifest.webmanifest`, `icons/`, `art/` (sprites plus `art/manifest.json`). Everything else is dev only and can be dropped when vendoring: `tools/`, `docs/`, `package.json`, `package-lock.json`, `playwright.config.mjs`, `HANDOFF.md`, `STATUS.md`, `README.md`, `.gitignore`.

`MANIFEST` entry in `scripts/vendor_satellites.mjs` (the script's `--selftest` counts entries and cards; bump both when adding):

```js
{ slug:"mainstreet", repo:"Mainstreet", ref:"main", card:"MAINSTREET", drop:["tools/","docs/","package.json","package-lock.json","playwright.config.mjs","HANDOFF.md","STATUS.md"] },
```

The clone the script reads must sit at `/workspaces/Mainstreet` and it resolves `origin/main`, so push upstream before re-vendoring. `sw.js` stays in the vendored copy: it registers at `/satellites/mainstreet/` scope, deletes only `mainstreet-*` caches, and passes `node scripts/sw_cache_scope_check.mjs`.

**Beta gate.** While the card is `beta:true`, the embed block loads `/dev-gate.js` only when the hostname is lucidwinds.com, so a direct url is gated like the card. Nothing loads on GitHub Pages, in a Codespace or under `file:`. Remove that line at v1.0.0 together with `beta:true`.

## 3. Card copy

- Hook: **Own little pieces of a town. Make a plan. See what time changes.**
- Description: A free, offline, kid-safe investing game for ages 8 to 11. Kids own tiny pieces of six paper-town shops, keep money for soon in a jar, make a plan for a goal, and watch what a year of news and weather changes on the street. Four neighbors with plans of their own play the same market beside them. Six short chapters, then twenty years of free play in named towns. Earns no sunbeams, by design.
- Portal entry (`portal/index.html`, `FEATURED`, carded by the vendored path with the mandatory `?v=` stamp): `{nm:"MAINSTREET", ds:"Own little pieces of a town. Make a plan. See what time changes.", cat:"math", url:"/satellites/mainstreet/?v=20261011a", ic:"🏘️", thumb:"/portal-assets/thumbs/mainstreet.png", beta:true, fresh:true}` plus a search keyword entry. A relative `/satellites/` url opens top level, not framed, so the referrer exit is the one that runs.
- Keep `beta:true` until the M6 playtest closes.

## 4. Earn moments

**None, by design (R01).** The game posts only `{sws:'ready'}` and `{sws:'close'}`. There is no `sws:'earn'`, no Sunbeam SDK, no `_sbCapEarn`. If `scripts/music_include.mjs --check` is run with MAINSTREET as a non-vendored satellite, add it to an allow-list; a vendored copy is already expected to carry no include.

## 5. Nav map

Every back control is an internal screen switch; nothing calls `history.back()` or changes `location` except `SWS_EXIT`.

| Screen | Back / close goes to |
| --- | --- |
| Home (`#s-title`, build stamp, "← All Sky Wolf games" → `SWS_EXIT()`) | the portal (framed: posts close; standalone: referrer then `/portal/`) |
| Chapter intro | Town (Start exploring) |
| Town | Home button |
| Shop or Basket panel, trade sheet, confirm sheet, neighbor sheet | Town (Back to town / tap outside) |
| My Plan | Town, or the pending decision, or Results |
| Decision (goal day, surprise cost, fee lab) | resolves back to Town |
| Year show | Skip → Gazette or Town |
| Gazette | Continue → Town, decision, or Results |
| Results | Save and stop → Home; Next chapter → Town |
| Time machine, Scrapbook, Free play, Settings, Grown-ups, Debug | Back → Home or the screen it came from |

Embedded (`?embed=1` or framed): no service worker, no update banner, no fullscreen request.

## 6. Thumbnail

Source image: `portal-thumb-source.png` in the asset list (M5 batch, Stephen's art lane). Until it lands, a 480 px screenshot of the Town screen works (`node tools/shots.mjs <dir> 480 480` then crop).

## 7. Local storage keys

| Key | Holds |
| --- | --- |
| `ms:save` | the current run: versions, scenario, seed, preset, checkpoint, pending tray, options, progress |
| `ms:save:bak` | the previous good save, rotated on every successful save |
| `ms:save:bad` | the first damaged save seen, never overwritten by later failures |
| `ms:settings` | options and progress (chapters finished, decorations, discoveries, scrapbook pages, album, experiments, towns) |
| `ms:owner` | the tab lock stamp (random tab id plus timestamp) |

`sessionStorage` `ms:tab` holds the tab's own id. Nothing is sent anywhere; export is a file the grown-up controls (Settings → Backup).

## 8. Updating content later

- Chapters, cards, presets, town-name lists and strings are data in `<script id="content">` in `index.html`.
- After an art drop: `node tools/art_manifest.mjs` (regenerates `art/manifest.json`; the worker precaches from it). Bump `VERSION` in `sw.js`.
- After any parameter change: `node tools/test.mjs` (fixtures must stay identical unless a decision says otherwise, then `--write-fixtures`), `npx playwright test`, `node tools/harness.mjs --seeds 10000 --family all --heldout --report docs/calibration.md`.
- Build stamp: `BUILD` constant at the top of `<script id="app">`.
