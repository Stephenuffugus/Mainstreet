# MUSIC.md, the song lane (for Stephen)

The game plays your songs by the feel of each moment. Nothing in the game depends on music: it is off until a player turns it on, it starts only after their first tap (browsers require that), and it goes quiet when the tab is hidden. Paper ticks and the chime are separate (Settings, Sound).

## Drop in a song

1. Export as **mp3** (128 to 192 kbps, 44.1 kHz). m4a also plays everywhere; ogg does not play on iPhone. Keep each file under about 4 MB; loops of one to three minutes work best.
2. Name it in kebab-case, for example `harbor-morning.mp3`, and put it in `music/`.
3. Add it to `music/manifest.json`:

```json
{ "file": "harbor-morning.mp3", "title": "Harbor Morning", "feel": "calm", "loop": true, "gain": 1 }
```

   `feel` is any word you like. `gain` trims a loud track (0.7) or lifts a quiet one (1.2). `loop` false means the track plays once and another track of the same feel follows.
4. Assign feels to moments in the `map` of the same file. The moments are:

| Moment | When |
| --- | --- |
| `home` | the title screen |
| `intro` | a chapter's opening page |
| `town` | the street, between stops |
| `town-slump` | the street while many families are spending less |
| `show-sun`, `show-rain`, `show-snow` | the year show, by the weather of its first month |
| `show-slump` | the year show in a slump |
| `gazette` | the year recap |
| `decision` | goal day, a surprise cost, the fee lab |
| `plan` | My Plan |
| `results` | the chapter end |
| `timemachine`, `scrapbook`, `freeplay`, `settings`, `grownups` | those screens |
| `default` | anything not listed |

   A moment whose feel has no track borrows any track, so a single song covers the whole game on day one. A track keeps playing across moments that share its feel; a change of feel crossfades over about a second.
5. Run `node tools/music_check.mjs`. It lists every track, every moment and what will play there, and fails on a missing file.
6. Bump `VERSION` in `sw.js` so installed copies fetch the new manifest. Songs themselves are cached the first time they play; they are not precached, so the offline install stays small.

## Hearing it in the game

Turn music on from the title screen (the Music button) or Settings. Settings shows "Now playing: title (feel, for moment)", and the debug panel (`?debug`) prints the full music state, so you can walk through the screens and assign by ear. The volume slider is in Settings; the default is 60 of 100.

## In the arcade

When songs exist, the portal card gets `ownMusic:true` (docs/FLEET-HANDOFF.md). The portal then pauses its own jukebox and offers a switch; when the player picks the studio soundtrack it sends `{sws:'host-music', on:true}` and this game mutes until `on:false`. That handshake is built in. The music folder rides along when the game is vendored, so keep the total under about 25 MB.

## Rules kept

- No music unlocks, no earn hooks (ruling R01). Songs are plain files.
- Nothing that sounds like a slot machine or a cash register. Celebration at the chapter end can be warm; it should never feel like a jackpot.
- A slump feel should be calmer, not alarming. Drops are shown calmly on screen and the music should agree.
