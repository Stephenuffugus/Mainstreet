# Plan: delivery, the show, and restart (rc9), 2026-10-11

Stephen's fifth note (21:52 his time) came with a screenshot of the rc4 tray: his phone never received rc5 to rc8. The game's service worker is cache-first for the page itself and only swaps after every tab under its scope is closed, and the "Restart now" banner that forces the swap shows only when the game is installed to the home screen. On top of that, the install step fetches index.html with the default cache mode, and the host serves index.html with `max-age=300, stale-while-revalidate=86400`, so a new worker can precache a stale page. This plan makes updates land on the next open, fixes the two show faults he saw, and gives Home a way to replay a chapter and to start over. No engine change, no content numbers.

## 1. The worker (sw.js)

- On install: precache CORE by fetching each with `{ cache: 'reload' }` and `c.put` (not `c.add`), so the edge cannot hand a stale page; then `self.skipWaiting()`.
- On activate: delete older `mainstreet-*` caches (as now), then `clients.claim()` (as now).
- Fetch: for navigation requests (`e.request.mode === 'navigate'`) go network first with a 3 second timeout (`Promise.race` with a timer), store the fresh response in the cache, and fall back to the cached page when the network fails or times out. Every other request stays cache first with the art and music write-through, as now. A hung fetch must never leave `respondWith` unsettled.
- Keep the `skipWaiting` message handler.

## 2. The page's update path (app.js)

- On `controllerchange`: if the screen is not `show` and no sheet is open, `location.reload()`; otherwise set `S.ui.reloadWhenIdle = true` and reload at the next `arrive()`.
- The update banner ("A new version is ready. Restart when you like." with Restart now) shows on Home in any display mode, not only standalone. Never mid-advance, never embedded, as before.
- The build stamp on Home stays.

## 3. The show: no flicker, no tapping through a year

- Before the first frame, preload every image slot the frames will use (`new Image()` per distinct slot, `Promise.all` with a 2500 ms cap) and only then start stepping. During the wait, show the first frame's labels with the stage empty; this is at most a short pause on first play and nothing once cached.
- In `paint()`, keep the `img` elements between frames and change `src` only when a shop's slot changes. Replace an image only after the new one has decoded (`img.decode()` on a detached image, then swap), so a storefront never blanks.
- Reduced motion: the show auto-steps at 900 ms per frame with the Skip button; the per month "Next month" button is gone. The frames are still stills with no pans. Numbers are unchanged.

## 4. Home: replay a chapter, start over

- Every finished chapter's row on Home is a 48 px button: "Play again". Tapping it starts a new run of that chapter in a new random town. If a run is in progress, an in-page two tap confirm first: "This ends your current town. Start chapter {n} again?" with "Yes, start again" and "Keep my town". Chapter 1 replays walk the walk again, with "Skip the walk" available since it is finished.
- Under the chapter list a "Start over" button: an in-page two tap confirm ("This clears every chapter, page and card on this device. Start over?" with "Yes, start over" and "Keep everything"), then the same full reset Settings performs, back to Home with chapter 1 next.
- The Continue row stays on top when a run is in progress.

## 5. Tests, evidence, versions

- `BUILD` to `1.0.0-rc9`, sw.js `VERSION` bumped. Fixtures unchanged, no `--write-fixtures`.
- `tools/ui.spec.mjs`: the reduced motion journey changes from "stepped by tap, never on a timer" to "steps on a timer, skippable, numbers identical"; add journeys: (1) the show's storefront images are present and complete at the first frame (served over http); (2) Home shows Play again on a finished chapter and it starts a new town after the confirm; (3) Start over asks twice and leaves Home with no run and chapter 1 next; (4) the worker's fetch handler answers a navigation request from the cache when the network fails (a unit style test that loads sw.js in a stub scope, if the harness allows; if not, say so).
- Run `node tools/test.mjs` and `npx playwright test --project=chromium`, one at a time.
- Serve over http, shoot Home with a finished chapter 1 (Play again visible), the Start over confirm, and three consecutive show frames of chapter 2 at 412 by 915 (viewport). Look at them.
- decisions.md entries, WORKLOG box, one STATUS line. One commit on main, test counts in the message, do not push.

## Out of scope

Chapter copy, art, the rename, any engine or content number.
