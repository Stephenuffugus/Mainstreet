# MAINSTREET

A free, offline, kid-safe investing game for ages 8 to 11. Own little pieces of a paper town, make a plan, see what time changes. A Sky Wolf Studio satellite. Someone asked for a game like Crypto Parrot; this is the version we would hand a child.

- `HANDOFF.md` is the build packet and the single source of truth.
- `STATUS.md` says where the build stands. `docs/WORKLOG.md` has the next unticked box.
- `docs/FLEET.md` is how it joins the arcade (embed protocol only; no sunbeams, by design).
- `docs/ART-BRIEF.md` is the sprite lane.

No build step. `index.html` plus `sw.js`, `manifest.webmanifest`, `icons/` and `art/` are the whole game. `tools/` and `docs/` never ship.
