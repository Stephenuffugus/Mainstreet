# MAINSTREET

A free, offline, kid-safe investing game for ages 8 to 11. Own little pieces of a paper town, make a plan, see what time changes. A Sky Wolf Studio satellite. Someone asked for a game like Crypto Parrot; this is the version we would hand a child.

- **Dev team: start at `START-HERE.md`.** Setup, the editing loop, the lanes, the open items with owners.
- `HANDOFF.md` is the build packet and the single source of truth.
- `STATUS.md` says where the build stands. `docs/WORKLOG.md` has the next unticked box.
- `docs/FLEET.md` is how it joins the arcade (embed protocol only; no sunbeams, by design).
- `docs/ART-BRIEF.md` is the sprite lane. `docs/MUSIC.md` is the song lane.
- `docs/RELEASE-NOTES.md` says what each release carries and what it leaves out. `docs/FLEET-HANDOFF.md` is the vendoring note for the arcade. `docs/calibration.md` is the held-out harness report.

No build step. `index.html` plus `sw.js`, `manifest.webmanifest`, `icons/`, `art/` and `music/` are the whole game. `tools/`, `docs/` and `src/` never ship.

```bash
npm run setup   # once
npm test        # engine tests
npm run ui      # browser journeys, chromium and webkit
npm run split   # index.html into src/ for editing; npm run join rebuilds it
```
