# ART-BRIEF.md, the sprite lane (for Stephen)

> **Drive:** folder [Business Materials › Github › 012Assets › mainstreet](https://drive.google.com/drive/folders/1lYmCMZZhm7yUqmfdQPoxmZSa0sA8LcS9) · [MAINSTREET Asset List (sheet, 113 rows, status column)](https://docs.google.com/spreadsheets/d/1WsVbsgq_wgANRIbEHThQlOzmGogLhbHTa7bzY9urCBE/edit) · [Art 00: Direction and prompts (doc)](https://docs.google.com/document/d/1nPOlBHKx_v_eqfqWmxTbyAWwvLSh6Bb-zDgKTiABYJo/edit)


You are making about 100 sprites for a paper town. This is the runbook: one Blender master scene is the style, Meshy makes the models, every asset renders through the same camera and lights, and the output is 512 px WebP files named by slot in `art/`. Opus never waits for art; every slot has a labeled placeholder until your file lands, and `node tools/art_manifest.mjs` swaps it in.


> **First-pass art is in place (2026-10-11).** Every slot in `art/` is a cut-paper SVG rendered by `node tools/gen_art.mjs` (dev only; Chromium plus `tools/webp.py`), 110 files, 1.3 MB, largest 19 KB. They follow the rules below (no text, no coins or arrows, busy means more customers, closed looks like a fresh start) so the game reads as a town before the Blender renders land. Replace them one by one: drop a file with the same name into `art/`, run `node tools/art_manifest.mjs`, bump `VERSION` in `sw.js`. The generator never overwrites a file you have replaced unless you run it for that slot by name.

## The look, in one paragraph

Folded cardstock. Everything in the town is cut and folded paper: storefronts with visible fold lines and slightly rounded cut edges, a warm cream ground, soft paper grain in every surface, a thin ink outline, matte light with soft shadows baked in. Animal shopkeepers and neighbors are paper too, with simple shapes and expressive posture. No gloss, no plastic, no photoreal texture. The reference feeling is a school diorama made by someone very good at it. It is original: nothing may resemble Animal Crossing or any other game's characters, faces, icon shapes or trade dress, and we check every asset for that by eye.

## Three layers the art must keep separate (from HANDOFF section 10)

1. **Activity**: customers, crates, signs, weather. Shows how the business's month went. Never hints at the child's money.
2. **Market value**: the share card beside the shop. Live markup, not art.
3. **Ownership**: the child's share count. Live markup, not art.

So: no coins, no arrows, no numbers, no gold, no sparkle in any sprite. A busy shop has more customers; a quiet shop has fewer. A closed shop is boarded with a cheerful "new project" sign, not a sad keeper. Neighbors' faces never react to money; they have one neutral and one talking pose.

## The master scene (`tools/mainstreet_master.blend`, you build it once)

- **Camera**: orthographic, three-quarter front view, elevated about 25 degrees, fixed. Every sprite is shot with this camera so the whole street shares one perspective. Orthographic scale set so a storefront fills about 80% of the frame; characters use a second fixed camera at the same angle framed tighter.
- **Lights**: three area lights, soft. Key front-left and above, fill front-right at half power, a gentle top light for the paper edges. World background off, film transparent.
- **Material override**: one "Cardstock" material applied to every imported mesh (View Layer → Material Override, or a script pass): base color from a small palette ramp keyed by object name, roughness 0.9, a subtle procedural paper-grain bump (noise texture, scale about 40, strength 0.05), no specular highlights. Meshy's own textures never reach the screen; they are only a shape guide.
- **Ink line**: Freestyle on, line thickness 1.5 px at 1024 render, dark warm grey (#2B2420), crease angle about 110 degrees. If Freestyle fights a model, turn it off for that asset and keep the shadow edge.
- **Render**: Eevee (or Workbench if Eevee is slow), 1024 by 1024, transparent, PNG RGBA, then cut to 512 WebP (below). `create-a-critter/blender/critter_lib.py` has a working `render_thumbnail` with transparent film and a fixed camera; `tools/render_sprites.py` here is that idea extended with the material override and state collections.
- **States by collection**: inside each storefront file, props live in collections named `base`, `busy`, `quiet`, `special`, `closed`. A state render shows `base` plus one of the others. Five renders from one model, always matching.

## Meshy prompt families (text to 3D, low-poly mode)

Generate shapes, not finishes. The master scene replaces materials, so prompt for silhouette and props.

| Group | Prompt skeleton |
| --- | --- |
| Storefront | "small two-story paper-craft shop building, folded cardstock, flat facade with awning and one door, simple sign board with no text, cozy, toy-like, no people, [shop detail]" where shop detail is: lemonade stand with a striped awning and a jug · bakery with a round window and a bread basket · toy shop with a tall window and a kite · bike shop with a bike rack and a wheel sign · pet care with a kennel door and a paw sign · robot lab with a round antenna and a gadget window |
| Props for states | "paper-craft [item], cardstock, simple": queue of three small animal customers · delivery crates stacked · a sandwich-board sign · an umbrella · a repair bench · a 'new project' banner · boards over a window |
| Keepers | "paper-craft [animal] character, cardstock, simple rounded shapes, standing, friendly, apron, no text" for badger, lemur, otter, hare, hedgehog, fox |
| Neighbors | same skeleton, four different animals from the keepers' six (suggest: owl Ada, tortoise Bo, magpie Cass, goat Dev), casual clothes, no apron |
| Houses | "small paper-craft cottage, cardstock, one door one window, same footprint" four color variants via the material ramp |
| Garden | "paper-craft oak tree, cardstock, [sapling / small / medium / tall / broad]" and the same for a cherry; a flat ground tile |
| Goals | these are flat pictures; the 2D lane (Midjourney, ChatGPT or Gemini) with the same paper-craft wording works better: "paper cut-out illustration of art supplies in a jar, cardstock, cream background, no text" etc. |
| Decorations | planters, bunting strings, a mural board, a bench, a stone path tile, pinwheels: either lane |

Meshy's low-poly mode gives clean topology; polycount does not matter for a render. Expect two or three generations per asset to get a readable silhouette. Keep every GLB you accept in a folder outside the repo (masters never enter git).

## Cut and ship

```
blender --background tools/mainstreet_master.blend --python tools/render_sprites.py -- \
   --glb masters/shop-bake.glb --slot shop-bake --states open,busy,quiet,special,closed --out renders/
# then, for each PNG:
cwebp -q 80 -alpha_q 100 -resize 512 0 renders/shop-bake-busy.png -o art/shop-bake-busy.webp
node tools/art_manifest.mjs      # rewrites art/manifest.json with sizes; STATUS.md reports the total
```

Target 15 to 40 KB per file; 2 MB for the whole folder. Check that all four corners of every sprite are fully transparent (a stray matte is the "white grid border" bug from the fleet art pass).

## Naming (the contract with the code)

| Slot pattern | Files | Example |
| --- | --- | --- |
| `shop-{id}-{state}` | 6 × (open, busy, quiet, special, closed) = 30 | `art/shop-bake-busy.webp` |
| `keeper-{name}-{pose}` | 6 × (neutral, talking, busy) = 18 | `art/keeper-bram-talking.webp` |
| `neighbor-{name}-{pose}` | 4 × (neutral, talking) = 8 | `art/neighbor-ada-talking.webp` |
| `house-{name}` | 4 | `art/house-bo.webp` |
| `stall-{variant}` | normal, ab = 2 | `art/stall-ab.webp` |
| `weather-{kind}` | sun, rain, snow = 3 | `art/weather-rain.webp` |
| `plate-{kind}` | ground, sky = 2 | `art/plate-ground.webp` |
| `goal-{slug}` | art-supplies, nature-trip, bicycle, project-kit, camp-week, big-project = 6 | `art/goal-bicycle.webp` |
| `deco-{family}-{n}` | 6 families × 3 = 18 | `art/deco-pinwheels-2.webp` |
| `frame-ch{n}` | 6 | `art/frame-ch3.webp` |
| `stamp-{dimension}` | goal-fit, readiness, spread, follow-through, cost = 5 | `art/stamp-spread.webp` |
| `card-back` | 1 | `art/card-back.webp` |
| `tree-{kind}-{stage}` | oak, cherry × 1 to 5 = 10, plus `tree-ground` | `art/tree-oak-3.webp` |

Shop ids: `lemn`, `bake`, `toys`, `bike`, `paws`, `robo`. Keepers: `lou`, `bram`, `ottilie`, `hop`, `hazel`, `fen`. Neighbors: `ada`, `bo`, `cass`, `dev`.

## Delivery by milestone

| Opus needs it at | Files |
| --- | --- |
| M2 | `shop-bake-open/busy/quiet`, `keeper-bram-*` (3), `goal-art-supplies`, `plate-ground`, `plate-sky`, `weather-sun` |
| M3 | the other five shops in open/busy/quiet (15), five keepers (15), `stall-normal`, `neighbor-ada-*`, `neighbor-bo-*`, `neighbor-dev-*` (6), `house-ada/bo/dev`, `goal-nature-trip`, `goal-bicycle`, one deco family (3), `weather-rain` |
| M4 | `shop-toys-closed`, `shop-robo-closed`, the six `special` overlays, `neighbor-cass-*` (2), `house-cass`, `weather-snow`, the garden (11), `goal-project-kit/camp-week/big-project`, `stall-ab` |
| M5 | remaining decos (15), `frame-ch1..6`, `stamp-*` (5), `card-back`, PWA icons (192, 512 PNG, maskable), the portal thumbnail source |

## QA before you drop a batch

- Every file is 512 px on the long side, WebP with alpha, under 40 KB, transparent corners.
- Same camera angle and light direction across the batch (put six on one sheet and look).
- No text baked into any image. No coins, arrows, numbers, gold or sparkle.
- No keeper or neighbor looks sad, greedy or triumphant. Closed shops look like a fresh start.
- Nothing resembles a known character or brand. If in doubt, change the animal's proportions or accessories.
- Run `node tools/art_manifest.mjs` and glance at the total.
