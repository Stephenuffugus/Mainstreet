# Stephen's first play, 2026-10-11 (verbatim, before any sorting)

Played on his own phone, rc3, through the arcade's tester gate. His words:

> Okay, I just tried testing the game myself and and firstly the game is going to need a whole different name. Main Street is massively overrun so I'll be brainstorming names with Astra. I think to find something that's not so crowded but everything skips really fast. There's like no tutorial hardly. It doesn't explain anything. I can't seem to invest and understand what's going to happen and what is happening. This is me not even a child doing it so there needs to be so much more detail put into this. The assets will come in about 3 more hours so if there's a way we can have this explain more. The only thing I've been able to invest in is the bakery and nothing else. I put some into the art supplies and then I just kept having to click next season next season next season and there was nothing to it. I would quit this game and delete it immediately. That was so stupid. So we're missing a lot of the connective tissue that will turn each piece into a single organism and tie it all together. Figured out if you have to put a team on it to to design and stuff. Don't just waste resources but what's polish just came up and actually make it something playable

## Rulings in it

- R13: the game will be renamed. Stephen brainstorms with Astra. "Main Street" stays only until the new name lands.
- R14: it must explain itself. A grown-up could not tell what investing would do or what had happened. Pace, teaching and consequence are the work, not polish.
- The art batch lands about three hours after these notes.

The sorting (fault / by design / taste) and the plan follow in docs/decisions.md and the lead's plan.

## Second play, after rc4 (verbatim)

> okay we got the tutorial done and it wasnt very good. the first leve that is, now were on the next level that has more businesses but the "your plan" pops up over the whole screen as you build it to the point where you cant see anything. that was not well thought out

- Chapter 1 after rc4: still "not very good". He has not yet said what was missing; the lead asks one question after the tray fix.
- Chapter 2: the plan tray, pinned at the bottom with the buttons since rc4, grows with every queued trade on a six-shop street and covers the screen. Fault, the lead's own (the sticky footer); the team's original tray was also sticky and would have grown the same way.

## Third note, chapter 2 (verbatim)

> its also not clear that as you pass time how to divest and diversify your investments and pull profits to do stuff. its extremely boring and doesnt teach you how to also pull the money to invest in what youre trying to do. arent there programs out there that help teach kids and adults how to do this? you shuld be using a strong framework to build from and make it engaging. we may way to write and animate almost a story. it doesnt not explain well or all

- Ruling R15: the game must teach the moves (divest, diversify, pull money toward the goal), not only show prices.
- Ruling R16: build on a recognized financial-literacy framework for the age, and make it engaging; a written, animated story is on the table.
- The lead's read: the engine has every move (sell, the Basket, the Jar bands, goal day) but nothing teaches when or why to make one. That is a re-spec of the experience layer, not a patch.

## Fourth note, chapter 1 at rc7 (verbatim)

> Okay, so this first level is still just stupid. It's not informative enough and Lee it's dry at least players feeling like they're bored in a desert and they'll leave immediately. The tutorial needs to be like the person walking in and being like. Here's your. Yeah here's your hundred coins. You're going to put them here and then you're going to try and save up over the year by investing in these businesses. You're trying to put the coins for your goal here. These are how you allocate them into businesses. This is how the this is. Absolutely pointless we have my plan, but it doesn't really tell us what it is or what it's for or why we're using that. How it structures, how you're building the structure of your plan and how it's going to affect or where. The thing is that you're going to be clicking to go through time. It has no explanation as to what the heck we're doing. This is just frustrating and bad still after all of this

- R17: chapter 1 is a guided walk. A person (the Clerk) walks the player through the screen piece by piece: the coins, where the goal money goes, the businesses and how coins go into them, the plan and what it is for, and that time moves only when you tap. One thing lit at a time, the player does each step.
- The lead's read: the rc4 guide card explained the stop, never the screen. Nothing ever pointed at the money row, the plan tray, My Plan or the time button and said what they are.

## Fifth note, 21:52 his time, with a screenshot (verbatim)

> Look at this fucking garbage! I already told you that that the plan is covering my screen up. Them I have to simulate an entire year. The fucking buildings are disappearing and reappearing. Then all of a sudden I'm out money and no explanations and have no way to learn or correct. It's just fucking dumb. I closed and reopened and it's like you ignore half the shit intell you. I also have no way to restart the game since I got to the second level to even see how the tutorial works.

- The screenshot shows the rc4 tray ("Your plan" with "Clear plan", the full list pinned): his phone was still running the afternoon build. The game's own service worker keeps the cached copy and only swaps after every tab under /satellites/mainstreet/ is closed; the "Restart now" banner that forces the swap shows only when installed to the home screen. So rc5, rc6, rc7 and rc8 never reached his phone. The lead's delivery failure, not a thing he missed.
- "Simulate an entire year": with his phone's reduce-motion setting on, the year show became twelve Next month taps.
- "Buildings disappearing and reappearing": the show swaps storefront images per month without preloading them; each swap blanks until the new image decodes.
- "Out of money, no explanation, no way to correct": rc4 had no check-in and no pull card; those are in rc5 and later, which he never saw.
- "No way to restart": Home has no replay for a finished chapter; reset is two taps deep in Settings.

## Sixth note, chapter 1 at rc9 (verbatim)

> It's honestly still pretty dry. The tutorial I couldn't hit my goal of thirty in a year. It says nothing about how well I'm really doing and it still just feels clunky and boring

- Goal day in chapter 1 offers Buy it from my Jar, Postpone, Change amount, Review my plan. A player whose Jar is short (the walk skipped, or coins moved out on My Plan) has no one tap way to sell shares and buy the art supplies; "Review my plan" sends them away from the decision. That is "couldn't hit my goal".
- Nothing on Town says how the plan is going. The five stamps exist only at Results, behind Show details in Guided. That is "says nothing about how well I'm really doing".
- Sound is off by default and the Clerk never reacts to what the player just did. That is "dry".
