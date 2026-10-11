# FLEET.md, joining the Sky Wolf Studio arcade

Read before any screen work. Everything here was read from the fleet's own documents in `Stephenuffugus/lucid-winds` on 2026-10-11: `incoming/PORTAL-CONTRACT.md` (verified against the live portal, 2026-08-16), `NEW_SATELLITE_BRIEF.md`, `SATELLITE_ONBOARDING_STANDARD.md`, `VENDORING.md`, `SUNBEAM_EARN_POLICY.md`, `docs/MUSIC-SYSTEM.md`, `sw.js`, `scripts/vendor_satellites.mjs`, `scripts/music_include.mjs`. The portal contract says the older brief is stale where they disagree; the contract wins.

## The ruling (R01, Stephen, 2026-10-11)

MAINSTREET is a kids' anti-gambling game. It ships **none** of the fleet's reward layer:

- no `https://lucidwinds.com/sunbeam-sdk.js`, no `Sunbeam.init`, no `_sbCapEarn`, no `Sunbeam.earn`
- no `parent.postMessage({sws:'earn', …})` moments
- no `<script src="/music-unlocks.js" defer></script>`, no `SWSMusic.unlock`
- no studio currency, no daily cap, no "never played and got nothing" floor, no unlock toast

It **does** ship the embed protocol below, because that is navigation, not reward. The fleet handoff lists "earn moments: none, by design (R01)". If the fleet's `scripts/music_include.mjs --check` is run with MAINSTREET as a native satellite, it needs an allow-list entry; a vendored copy is already expected to carry no include.

## The embed block (copy verbatim into `<script id="app">`, first thing)

```js
/* ===== Sky Wolf Studio embed protocol (incoming/PORTAL-CONTRACT.md) ===== */
(function(){
  var framed=false; try{ framed = window.parent!==window; }catch(e){ framed=true; }
  var EMBED = /[?&]embed=1(&|$)/.test(location.search) || framed;
  window.SWS_EMBED = EMBED; window.SWS_FRAMED = framed;
  window.SWS_EXIT = function(){
    if(framed){ try{ parent.postMessage({sws:'close'},'*'); }catch(e){} return; }
    if(document.referrer.indexOf('/portal')>=0 && history.length>1){ history.back(); }
    else{ location.replace('https://lucidwinds.com/portal/'); }
  };
  if(framed){
    try{ parent.postMessage({sws:'ready'},'*'); }catch(e){}
    window.addEventListener('load',function(){ try{ parent.postMessage({sws:'ready'},'*'); }catch(e){} });
  }
})();
```

Rules that go with it:

1. `{sws:'ready'}` is posted at parse time **and** on `load`, on every page load. A silent frame is treated as a black screen and auto-closed by the portal.
2. `{sws:'close'}` is sent once per user intent, only from the exit button.
3. Every in-game back or ✕ is an **internal screen switch**. Never `history.back()`, never change `location`, from any control other than `SWS_EXIT`.
4. The Home screen (`id="s-title"`) has a 48 px button labeled **← All Sky Wolf games** wired to `window.SWS_EXIT()`. Standalone it cross-promotes the portal; framed it closes cleanly.
5. When `window.SWS_EMBED` is true: do not register the service worker, do not show the "new version is ready" banner, never `location.reload()` on `controllerchange`, never request fullscreen.
6. A visible **build stamp** sits on `#s-title` (version string plus short commit), so the live build can be checked at a glance.
7. Optional, harmless: honor `{sws:'host-music', on:bool}` by muting the game's own ticks when `on` is true. MAINSTREET has no music, so this is a two-line listener.

## Two ways the portal opens a game

| Card url | How it opens | What matters |
| --- | --- | --- |
| `https://stephenuffugus.github.io/Mainstreet/` | Framed in an iframe with `?embed=1`; a 12-second watchdog waits for `ready` | The block above; no SW; exit posts `close` |
| `/satellites/mainstreet/?v=…` (after vendoring) | Top-level navigation, no frame | Exit uses `document.referrer` and `history.back()`; the root `sw.js` on lucidwinds.com owns caching; the vendor step removes our `sw.js` |

Test the exit path both ways.

## Deploy and vendor

1. **GitHub Pages** on this repo: Settings → Pages → Deploy from a branch → `main`, `/ (root)`. Or: `gh api -X POST repos/Stephenuffugus/Mainstreet/pages -f source[branch]=main -f source[path]=/`. The live URL is `https://stephenuffugus.github.io/Mainstreet/`. All paths in the game are relative and `manifest.webmanifest` uses `start_url: "."`, so the same files run at any origin or subfolder.
2. **Portal card** (`portal/index.html`, `FEATURED` or `GAMES`): `{nm:"MAINSTREET", ds:"Own little pieces of a town. Make a plan. See what time changes.", url:"https://stephenuffugus.github.io/Mainstreet/", ic:"🏘️", thumb:"/portal-assets/thumbs/mainstreet.png", beta:true}`. `beta:true` is the tester gate (`localStorage.sws_dev_ok='1'`), the fleet's "Test Lab". Card copy adds "Earns no sunbeams, by design." Thumbnail under 150 KB and 480 px, from the source image Stephen provides.
3. **Vendoring** (fleet side, after M6): add MAINSTREET to `MANIFEST` in `scripts/vendor_satellites.mjs` (`slug:"mainstreet", repo:"Mainstreet", ref:"main", drop:["tools/","docs/"]`), run `--vendor mainstreet`, bump the card's `?v=`. Fixes always go upstream here, then re-vendor; never hand-edit the vendored copy.
4. **Our `sw.js`** deletes only caches whose name starts with `mainstreet-`. The fleet's `node scripts/sw_cache_scope_check.mjs --fleet` must pass. Nine satellites once wiped every cache on the origin; do not be the tenth.

## Fleet checks to pass before vendoring

- No horizontal page overflow at 412 by 915, 375 by 667 and 320 by 568, measured after the first tap (`scripts/fleet/overflow.mjs /satellites/mainstreet/`).
- `{sws:'ready'}` observed in a frame; `{sws:'close'}` on the exit button; no `history.back()` anywhere else.
- No em or en dash in player copy; exclamation marks only on goal day and chapter end.
- Build stamp visible on `#s-title`.
- No console errors when framed.
- Zero network requests during play after install; no third-party script anywhere.

## The fleet handoff (what to hand back at M6, modeled on Blooming Words')

1. Live Pages URL, repo name, branch and path Pages serves from, how deploys happen (push to `main`).
2. File manifest: the deployable game (`index.html`, `sw.js`, `manifest.webmanifest`, `icons/`, `art/`) versus dev-only (`tools/`, `docs/`, `package.json`).
3. One-line hook and one-paragraph description for the card.
4. **Earn moments: none, by design (R01).**
5. Nav map: every screen and overlay and what its back does; confirmation that the embed block is in and `SWS_EXIT()` is wired to the Home exit.
6. Thumbnail source image.
7. Every localStorage key written and what it holds: `ms:save`, `ms:save:bak`, `ms:save:bad`, `ms:settings`, `ms:owner`.
8. How to update content later: `CONTENT` and `STRINGS` in `index.html`; `tools/art_manifest.mjs` after an art drop; `tools/harness.mjs --report` after a parameter change.
