# Family Ludo — Design Spec

**Date:** 2026-07-10
**Status:** Approved by Gaurav (design conversation + multi-agent architecture review)

## 1. Goal

A private, free, ad-free Ludo web app for one family who currently plays Ludo King and is fed up with its ads and daily game limits. Played on phones in different locations. The bar is "more reliable and less annoying than Ludo King for this family", not a commercial product.

Success criteria:

- A game night works end to end: create room, share code on WhatsApp, 2 to 4 people play a full game on their phones with no ads, no limits, no accounts.
- Phones locking, WhatsApp switching, tab kills, and mid-game redeploys never lose a game or a seat.
- Costs $0/month and keeps working for years without babysitting.

## 2. Decisions already made (with the user)

| Decision | Choice |
|---|---|
| Platform | Web app (phone browser), no app stores |
| Play mode | Remote realtime multiplayer, separate devices/locations |
| Joining | Room code, no login, no accounts |
| Empty seats | Filled by computer players (bots) |
| Disconnects | Auto-rejoin same seat |
| Rules | Ludo King variant (bonus turn on 6/capture, blocking) |
| History/stats | None. Nothing persists after a game ends |

## 3. Architecture

**One Cloudflare Worker on Gaurav's own free Cloudflare account, deployed with `wrangler deploy`.** No Vercel, no Next.js, no database.

- **Realtime rooms:** one Durable Object per game room, built with the `partyserver` library (server) and `partysocket` (client, gives auto-reconnect). SQLite storage backend, WebSocket Hibernation API so idle rooms cost nothing.
- **Frontend:** static Vite SPA (plain TypeScript, no framework) served from the same Worker via Workers Static Assets. Client and room server always deploy atomically, so no version skew.
- **Timers:** Durable Object Alarms for bot turns, turn timeouts, and room garbage collection. Never `setTimeout` for anything that must survive hibernation.
- **Cost:** $0/month at family scale (Workers Free: 100k requests/day, 5 GB storage). Worst-case future upgrade is $5/month Workers Paid. Free `*.workers.dev` URL; custom domain optional later.

Rejected during review (kept here so it is not relitigated):

- **PartyKit hosted platform (partykit.dev):** stale toolchain (no npm release since Sep 2025), free tier wipes storage every 24h. `partyserver` on Durable Objects is the maintained successor with the same API shape.
- **Next.js on Vercel + separate realtime service:** two deploy targets for one tiny app; Vercel's own WebSocket options force connection cycling every 300 to 800s and need a Redis layer.
- **Supabase / any database:** nothing persists after a game, so a database is pure tamper surface and setup cost.
- **P2P WebRTC:** host is a single point of failure, NAT traversal unreliable, breaks auto-rejoin.
- **Colyseus, Ably, Pusher, Liveblocks, Fly/Railway/Render:** either cost money at this scale, sleep and kill live games, or have no place to run authoritative rules and bots.

## 4. Server: the single rules engine

The Durable Object holds the authoritative game state and is the only place rules exist.

- **State** (~1 KB JSON): token positions, whose turn, dice phase, seat list with connection status and bot flags, consecutive-six counter, pending extra roll, finish order.
- **Position model:** stored per token as `tokenId → {zone, index}` (zones: base, track, home column, home). Never `square → single occupant`, so stacks and blocks cannot silently overwrite each other.
- **Dice are server-generated only.** Clients never roll.
- **Intents, not moves:** clients send `{type: 'roll' | 'move', tokenId?, turnNumber, actionSeq}`. The server rejects anything not matching the current turn and phase. This makes reconnect resends harmless (idempotent) and airplane-mode re-rolling impossible.
- **Legal-move computation:** after every roll the server computes the legal-move set. Empty set auto-passes immediately (the most common early-game turn) without ever starting the turn timer. Exactly one legal move still requires the player's tap (they see what is happening).
- **Serialized transitions:** every state change (player intent, turn timeout, bot alarm) goes through the same single transition function, so the "timeout fired just as the late move arrived" race cannot double-advance the turn.
- **Persistence:** state is written to Durable Object storage after every accepted transition and rehydrated on wake. A deploy or hibernation mid-game costs nothing but a reconnect.
- **Room GC:** when human connections hit zero, set an alarm; delete the room only after 60 minutes of continued emptiness. A game where all phones lock during a chai break survives. A room with only bots left ends the game immediately.

## 5. Game rules (Ludo King variant, exact)

This section is the arbitration document when the family disputes a call. It is encoded as the rules engine's test suite before any other game code is written. Verify ambiguous cases against Ludo King Classic on a real device during implementation.

1. **Setup:** 4 seats (red, green, yellow, blue), 4 tokens each, all starting in base. 2 to 4 participants (humans + bots).
2. **Exit base:** requires a 6. Exiting still grants the re-roll for the 6.
3. **Extra roll:** a single `extraRollPending` boolean, set by rolling a 6, capturing, or getting a token home. Multiple triggers on one move still mean exactly one extra roll. Extra rolls can chain (each new 6/capture/home sets it again).
4. **Three consecutive sixes:** the third 6 is void, the turn ends, moves made on the first two sixes stand.
5. **Movement:** clockwise around the 52-square track, then up the player's own home column. **Exact roll required to enter home; no bounce-back.** If the roll overshoots, that token cannot move.
6. **Capture:** landing on a square occupied by a single opponent token sends it back to its base. Capturing grants the extra roll.
7. **Safe squares:** the 8 safe squares (4 start squares + 4 star squares). No captures there, any number of tokens of any colors co-exist, and **no blocks form there** (this prevents the permanent block-on-entry-square deadlock).
8. **Blocks:** two or more of one player's tokens on the same non-safe track square form a block. Opponents can neither land on nor pass through it (such moves are simply illegal). The owner may pass and land freely. A block is not capturable.
9. **No legal move:** turn auto-passes instantly, server-side.
10. **Winning:** first player to get all 4 tokens home wins. Play continues to a full placement list (1st, 2nd, 3rd) so a family game has full bragging rights; game over when one seat remains or only bots remain.

## 6. Seats, identity, and reconnect

**Identity:** on claiming a seat, the server mints a random token and the client shows a personal rejoin link (`/r/CODE#p=TOKEN`) with a "keep this in the WhatsApp chat" hint. localStorage caches it but is never the sole credential, because the family's primary join path is WhatsApp's in-app browser with its isolated storage.

- **Lost token fallback:** the join screen lists disconnected seats with a "That's me, rejoin as Mom" button. Family trust level, no PIN. The room broadcasts "X rejoined as Mom" so impersonation is visible and socially self-correcting.
- **Duplicate connections:** latest connection wins. A second tab with the same token closes the first with an "open in another tab" banner; this never counts as a disconnect.

**Seat lifecycle state machine** (resolves wait-vs-bot and the locked-phone notification problem in one rule; there is no push notification path for this audience, so instead of summoning players, absence is made harmless):

```
CONNECTED → AWAY → BOT_CONTROLLED
     ↑________↑________↑  (rejoin always wins)
```

- **CONNECTED → AWAY:** socket drops are invisible to the game unless it is that seat's turn.
- **AWAY on your turn:** everyone sees a visible countdown ("Waiting for Dad, auto-move in 0:20", 60 seconds). Then the bot plays **that one turn**, badged "auto-played". Never a skip, so no pending-bonus-roll state dangles and absent players stay competitive.
- **AWAY → BOT_CONTROLLED:** after 3 consecutive auto-plays the seat flips to full bot control, announced in the UI.
- **Rejoin:** flips the seat back to human, effective at the seat's next turn, atomically cancelling any pending bot alarm.

## 7. Bots

- **Move choice:** bots are pure choosers over the server's own legal-move list, never a parallel rules implementation. Priority: capture > exit base > reach safe square > advance the furthest token > random.
- **Casual policy:** the family left Ludo King partly over "rigged" bots. The bot captures with probability below 1 and avoids targeting the same player on consecutive opportunities when alternatives exist. No difficulty levels, no lookahead.
- **Scheduling:** every bot move and turn deadline is a Durable Object Alarm (survives hibernation). A watchdog on every connect/message checks: if the current turn belongs to a bot and no alarm is pending, act immediately. A room can never freeze on a bot's turn.
- **Pacing:** the server resolves a bot's full turn (including bonus chains) instantly and sends it as an ordered action list; the client animates it at a natural cadence. No server-side pacing timers.

## 8. Client

Single-page Vite app, plain TypeScript, mobile-first, portrait.

**Screens:** Home (create game / enter code) → Lobby (seat picking, bot fill, start) → Game (board) → Game over (placements, "play again" reuses the room).

**Routing and resync (first-class, not an afterthought):**

- Rooms live at `/r/CODE`, so tab eviction or a cold reload deterministically re-enters the room with zero typing.
- On `visibilitychange`/`pageshow`/`focus`/`online`: blocking "Reconnecting…" overlay, reconnect via partysocket, request a full authoritative snapshot (never diff-patch a stale board), then render. Screen unlocks happen dozens of times per game.
- Screen Wake Lock held while the game is active.
- "While you were away" digest (rolls, captures, auto-plays) shown on rejoin.

**Mobile input hardening** (each item's failure loses a move in a game with no undo):

- 44px minimum hit-slop on tokens regardless of visual size.
- After a roll, highlight only legally movable tokens; moving requires a destination-tap confirm.
- Zoomed two-option picker when a cell holds multiple own tokens (the block rule guarantees this every game).
- `overscroll-behavior: none` (kills pull-to-refresh), `touch-action: manipulation` (kills double-tap zoom), `user-select: none`.
- Roll button locks synchronously on tap; a client dice-tumble animation runs until the server result arrives (600ms minimum) so mobile latency never invites a double-tap.
- Per-seat presence badges ("Dad, away 0:32") so silence reads as a person being away, not the app crashing.

**Trust feature:** tap-to-view dice roll history for the current game, so any "the dice hate me" streak accusation can be checked against the log.

## 9. Error handling

- Unknown/expired room code → friendly "game not found, start a new one?" screen.
- Malformed or out-of-turn intents → silently rejected server-side (client UI cannot produce them; only devtools can).
- WebSocket drop → partysocket auto-reconnects with backoff; the seat lifecycle (section 6) handles the game side.
- Worker deploy mid-game → state was persisted on every transition; clients reconnect and resync. Deploying during game night is expected behavior, not an incident.

## 10. Testing

- **Rules engine:** the section 5 spec encoded as a test suite (vitest), written before the engine. Pure functions: `(state, intent, dieRoll) → newState | rejection`. Covers every numbered rule, plus the deadlock cases (block on entry square cannot form; no-legal-move auto-pass; third-six void; overshoot at home).
- **Seat lifecycle:** unit tests for the state machine transitions including auto-play, bot takeover, rejoin cancelling alarms, and the timeout-vs-late-move race.
- **Bots:** test that every bot choice is a member of the server's legal-move set for that state.
- **Manual end-to-end:** one scripted game-night rehearsal (4 browser tabs, kill one mid-game, redeploy mid-game) before handing the link to the family.

## 11. Out of scope (deliberate)

- Accounts, auth, friends lists, match history, leaderboards.
- Push notifications and PWA install flow (auto-play makes absence harmless, which beats a push most of this family could never receive).
- Chat/voice (they have WhatsApp open anyway).
- Anti-cheat beyond server-authoritative dice and moves; PIN-protected seats (family threat model).
- Bot difficulty levels or lookahead AI.
- Ludo King's extra modes (quick mode, snake and ladders, tournaments).
