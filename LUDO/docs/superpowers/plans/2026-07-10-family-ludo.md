# Family Ludo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A private, free, ad-free realtime multiplayer Ludo web app for one family, playable on phones in different locations, per the approved spec at `docs/superpowers/specs/2026-07-10-family-ludo-design.md`.

**Architecture:** One Cloudflare Worker serves a static Vite SPA and hosts one Durable Object per game room (partyserver). The DO is the single rules engine: server dice, server legal-move computation, state persisted to DO storage on every transition, DO Alarms for bot turns / turn timeouts / room GC. The client is a plain TypeScript SPA that renders snapshots and animates event lists.

**Tech Stack:** TypeScript, Vite 8 + @cloudflare/vite-plugin, partyserver 0.5.8 (server), partysocket 1.3.0 (client), Durable Objects (SQLite backend, hibernation), vitest 4 (+ @cloudflare/vitest-pool-workers for DO tests). No UI framework. No database.

## Global Constraints

- Project root is `LUDO/` inside the `gauravvedi.com` git repo. All paths below are relative to `LUDO/`. Run all npm/wrangler commands from `LUDO/`. Git commits run from anywhere in the repo with `LUDO/`-prefixed paths; commit messages use the repo convention `ludo: <what>`.
- Node >= 22.12 required (wrangler 4.110 floor). Verify before starting.
- Runtime dependencies are EXACTLY `partyserver` and `partysocket`. Do not add any other runtime dependency.
- No UI framework, no React. Plain TypeScript + DOM.
- Pinned dev tooling: `vite@^8.1.4`, `@cloudflare/vite-plugin@^1.44.0`, `wrangler@^4.110.0`, `typescript@~5.9.3`, `vitest@^4.1.10`, `@cloudflare/vitest-pool-workers@^0.18.4`, `@cloudflare/workers-types@^4.20260710.1`.
- STALE-API TRAPS (training data will fight you; the forms below are verified against mid-2026 docs):
  - vitest-pool-workers: `defineWorkersConfig` is REMOVED. Use the `cloudflareTest()` vite plugin from `@cloudflare/vitest-pool-workers`.
  - `SELF` from `cloudflare:test` is gone. Use `import { env, exports } from "cloudflare:workers"` and `exports.default.fetch(...)`.
  - With @cloudflare/vite-plugin, `wrangler.jsonc` OMITS `assets.directory`; deploy is `vite build` then bare `wrangler deploy` (it auto-finds the built output config). Never run `wrangler dev`; `vite dev` runs Worker + DO + assets.
  - DO migration must use `new_sqlite_classes` (not `new_classes`).
  - partyserver: hibernation is opt-in via `static options = { hibernate: true }`. Implement `onAlarm()`, never override `alarm()`. `this.name` is the room code. DO binding `GameRoom` maps to URL `/parties/game-room/:room` (kebab-case) and the client's `party: "game-room"` option.
- One alarm per DO: `setAlarm` REPLACES the existing alarm. All deadlines (bot turn, turn timeout, GC) are stored as epoch-ms fields and multiplexed through one `armAlarm()` helper.
- In-memory DO fields are a cache: rehydrate from storage in `onStart()` (re-runs after hibernation), persist after every accepted transition.
- `connection.setState` payloads are capped at 2,048 bytes — store only `{ color }` there, never game state.
- All user-facing copy: no em dashes, short plain sentences (family app, non-technical users).
- Game rules follow spec section 5 EXACTLY. The engine tests in Tasks 3-4 encode it; when in doubt the spec wins over intuition.
- TDD for all pure logic (Tasks 2-5) and DO behavior (Tasks 6-7). Client rendering (Tasks 8-9) is verified by build + scripted browser checks; do not fake DOM unit tests.

## File Structure

```
LUDO/
├── index.html                 # Vite entry, loads /src/client/main.ts
├── package.json
├── wrangler.jsonc             # Worker + DO binding + SPA assets (input config)
├── vite.config.ts             # cloudflare() plugin only
├── vitest.unit.config.ts      # pure-logic tests (src/shared)
├── vitest.do.config.ts        # DO tests (test/do), runs --max-workers=1 --no-isolate
├── tsconfig.json              # references only
├── tsconfig.app.json          # DOM code: src/client + src/shared
├── tsconfig.node.json         # vite.config.ts
├── tsconfig.worker.json       # workerd code: src/server + src/shared
├── src/
│   ├── shared/                # pure, framework-free, tested by plain vitest
│   │   ├── board.ts           # geometry: track path, starts, safe squares, home columns
│   │   ├── protocol.ts        # GameState, Seat, events, client/server messages, tunables
│   │   ├── engine.ts          # newGame/newLobby, legalMoves, applyRoll, applyMove, snapshot
│   │   ├── bot.ts             # chooseBotMove
│   │   └── *.test.ts          # co-located unit tests
│   ├── server/
│   │   └── index.ts           # GameRoom DO + Worker fetch entry
│   └── client/
│       ├── main.ts            # router, app store, screen switching
│       ├── net.ts             # partysocket wrapper, resync, token storage
│       ├── board.ts           # SVG board build + token positioning + animation
│       ├── screens.ts         # home, lobby, game chrome, game over, digest, roll log
│       └── style.css
├── test/do/
│   ├── tsconfig.json
│   └── game-room.test.ts      # pool-workers DO tests
└── worker-configuration.d.ts  # generated by `wrangler types` (committed)
```

---

### Task 1: Scaffold and toolchain

**Files:**
- Create: `package.json`, `wrangler.jsonc`, `vite.config.ts`, `vitest.unit.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.worker.json`, `index.html`, `src/client/main.ts`, `src/client/style.css`, `src/server/index.ts`, `.gitignore`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a building, deployable skeleton. `GameRoom` DO class exported from `src/server/index.ts` (echo behavior only, replaced in Task 6). npm scripts `dev`, `build`, `deploy`, `test:unit`, `test:do`, `check`, `cf-typegen` that all later tasks use.

- [ ] **Step 1: Verify Node version**

Run: `node --version`
Expected: v22.12 or higher. If lower, stop and install Node 22 (e.g. `brew install node@22`) before continuing.

- [ ] **Step 2: Write package.json**

```json
{
  "name": "ludo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "tsc -b && vite build",
    "preview": "npm run build && vite preview",
    "deploy": "npm run build && wrangler deploy",
    "cf-typegen": "wrangler types",
    "check": "tsc -b && vite build && wrangler deploy --dry-run",
    "test": "npm run test:unit && npm run test:do",
    "test:unit": "vitest run --config vitest.unit.config.ts",
    "test:do": "vitest run --config vitest.do.config.ts --max-workers=1 --no-isolate"
  },
  "dependencies": {
    "partyserver": "^0.5.8",
    "partysocket": "^1.3.0"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.44.0",
    "@cloudflare/vitest-pool-workers": "^0.18.4",
    "@cloudflare/workers-types": "^4.20260710.1",
    "typescript": "~5.9.3",
    "vite": "^8.1.4",
    "vitest": "^4.1.10",
    "wrangler": "^4.110.0"
  }
}
```

- [ ] **Step 3: Write wrangler.jsonc**

Note: `assets.directory` is deliberately omitted (the vite plugin supplies it in the build output config).

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "ludo",
  "main": "src/server/index.ts",
  "compatibility_date": "2026-07-01",
  "observability": { "enabled": true },
  "upload_source_maps": true,
  "assets": {
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/parties/*"]
  },
  "durable_objects": {
    "bindings": [{ "name": "GameRoom", "class_name": "GameRoom" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["GameRoom"] }]
}
```

- [ ] **Step 4: Write vite.config.ts**

```ts
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
});
```

- [ ] **Step 5: Write vitest.unit.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/shared/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 6: Write the four tsconfig files**

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.worker.json" }
  ]
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/client", "src/shared"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.unit.config.ts", "vitest.do.config.ts"]
}
```

`tsconfig.worker.json`:

```json
{
  "extends": "./tsconfig.node.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.worker.tsbuildinfo",
    "types": ["./worker-configuration.d.ts"]
  },
  "include": ["src/server", "src/shared"]
}
```

- [ ] **Step 7: Write index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
  <meta name="theme-color" content="#14181f" />
  <title>Family Ludo</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎲</text></svg>" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/client/main.ts"></script>
</body>
</html>
```

- [ ] **Step 8: Write placeholder client**

`src/client/style.css` (extended in Task 8; start minimal):

```css
* { box-sizing: border-box; margin: 0; }
html, body { height: 100%; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #14181f;
  color: #e8eaed;
}
#app { min-height: 100%; display: flex; flex-direction: column; }
```

`src/client/main.ts`:

```ts
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<p style="padding:2rem">Family Ludo scaffold OK</p>`;
```

- [ ] **Step 9: Write echo Worker + DO**

`src/server/index.ts` (replaced wholesale in Task 6):

```ts
import { Server, routePartykitRequest } from "partyserver";
import type { Connection, WSMessage } from "partyserver";

export class GameRoom extends Server<Env> {
  static options = { hibernate: true };

  onMessage(connection: Connection, message: WSMessage) {
    if (typeof message === "string") connection.send(`echo:${message}`);
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ??
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
```

Note: `Env` is the global interface generated by `wrangler types` in Step 11; it includes the `GameRoom` binding. No ASSETS binding or fallback is needed: `run_worker_first: ["/parties/*"]` means the platform serves all static/SPA traffic before the Worker runs, so the Worker only ever sees `/parties/*` requests.

- [ ] **Step 10: Write .gitignore**

```
node_modules/
dist/
.wrangler/
```

- [ ] **Step 11: Install and generate types**

Run: `npm install && npm run cf-typegen`
Expected: install succeeds; `worker-configuration.d.ts` is created at the project root.

- [ ] **Step 12: Verify build and dry-run deploy**

Run: `npm run check`
Expected: `tsc -b` clean, vite build emits `dist/client` and `dist/ludo`, `wrangler deploy --dry-run` prints the Worker summary with the GameRoom binding and exits 0. (Dry run needs no Cloudflare login.)

- [ ] **Step 13: Verify dev server end to end**

Run: `npm run dev` in the background, then `curl -s http://localhost:5173/ | grep -o "Family Ludo"`
Expected: `Family Ludo`. Then stop the dev server.

- [ ] **Step 14: Commit**

```bash
git add LUDO/
git commit -m "ludo: scaffold worker, durable object, vite spa toolchain"
```

---

### Task 2: Board geometry (`src/shared/board.ts`)

**Files:**
- Create: `src/shared/board.ts`
- Test: `src/shared/board.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces (exact exports used by every later task):
  - `COLORS: readonly ['red','green','yellow','blue']`, `type Color`
  - `TRACK_LEN = 52`, `BASE = -1`, `LAST_TRACK = 50`, `HOME = 56`
  - `START: Record<Color, number>` (red 0, green 13, yellow 26, blue 39)
  - `SAFE: Set<number>` (absolute indices {0,8,13,21,26,34,39,47})
  - `absOf(color: Color, progress: number): number | null` (track progress 0..50 only)
  - `PATH: [number, number][]` (52 grid cells, index = absolute track index)
  - `HOME_COL: Record<Color, [number, number][]>` (5 cells each)
  - `BASE_ORIGIN: Record<Color, [number, number]>` (6x6 quadrant origins)
  - `cellOf(color: Color, progress: number): [number, number] | null` (null for base; `[7,7]` for home)

Token position model (from spec): per-token integer progress. `-1` base, `0..50` own track steps, `51..55` home column, `56` home. Absolute track index for progress p is `(START[color] + p) % 52`.

- [ ] **Step 1: Write the failing test**

`src/shared/board.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { BASE, COLORS, HOME, LAST_TRACK, PATH, SAFE, START, TRACK_LEN, HOME_COL, absOf, cellOf } from "./board";

describe("track path", () => {
  it("has 52 unique cells", () => {
    expect(PATH.length).toBe(TRACK_LEN);
    expect(new Set(PATH.map(([c, r]) => `${c},${r}`)).size).toBe(52);
  });

  it("is a contiguous loop of adjacent cells", () => {
    // king-move adjacency: the four arm corners (e.g. [5,6] to [6,5]) turn
    // diagonally on a real Ludo board; all other steps are orthogonal
    for (let i = 0; i < 52; i++) {
      const [c1, r1] = PATH[i]!;
      const [c2, r2] = PATH[(i + 1) % 52]!;
      expect(Math.max(Math.abs(c1 - c2), Math.abs(r1 - r2))).toBe(1);
    }
  });

  it("stays inside the cross arms of the 15x15 grid", () => {
    for (const [c, r] of PATH) {
      expect(c >= 0 && c <= 14 && r >= 0 && r <= 14).toBe(true);
      expect((c >= 6 && c <= 8) || (r >= 6 && r <= 8)).toBe(true);
      expect(c >= 6 && c <= 8 && r >= 6 && r <= 8).toBe(false); // never the center 3x3
    }
  });
});

describe("starts and safety", () => {
  it("start squares sit at the documented absolute indices and are safe", () => {
    expect(START).toEqual({ red: 0, green: 13, yellow: 26, blue: 39 });
    for (const c of COLORS) expect(SAFE.has(START[c])).toBe(true);
  });

  it("has exactly 8 safe squares: 4 starts plus 4 stars 8 past each start", () => {
    expect([...SAFE].sort((a, b) => a - b)).toEqual([0, 8, 13, 21, 26, 34, 39, 47]);
  });

  it("absOf wraps around the loop", () => {
    expect(absOf("red", 0)).toBe(0);
    expect(absOf("blue", 0)).toBe(39);
    expect(absOf("blue", 20)).toBe(7);
    expect(absOf("red", LAST_TRACK)).toBe(50);
    expect(absOf("red", BASE)).toBeNull();
    expect(absOf("red", 51)).toBeNull();
  });
});

describe("cells for rendering", () => {
  it("maps every color's last track step to the cell before its home column", () => {
    expect(cellOf("red", 50)).toEqual([0, 7]);
    expect(cellOf("green", 50)).toEqual([7, 0]);
    expect(cellOf("yellow", 50)).toEqual([14, 7]);
    expect(cellOf("blue", 50)).toEqual([7, 14]);
  });

  it("walks each home column toward the center", () => {
    expect(cellOf("red", 51)).toEqual([1, 7]);
    expect(cellOf("red", 55)).toEqual([5, 7]);
    expect(cellOf("green", 51)).toEqual([7, 1]);
    expect(cellOf("yellow", 51)).toEqual([13, 7]);
    expect(cellOf("blue", 51)).toEqual([7, 13]);
    for (const c of COLORS) expect(HOME_COL[c].length).toBe(5);
  });

  it("returns null in base and the center when home", () => {
    expect(cellOf("red", BASE)).toBeNull();
    expect(cellOf("red", HOME)).toEqual([7, 7]);
  });

  it("home columns never overlap the track", () => {
    const track = new Set(PATH.map(([c, r]) => `${c},${r}`));
    for (const c of COLORS) for (const [x, y] of HOME_COL[c]) expect(track.has(`${x},${y}`)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit`
Expected: FAIL, cannot resolve `./board`.

- [ ] **Step 3: Write the implementation**

`src/shared/board.ts`:

```ts
export const COLORS = ["red", "green", "yellow", "blue"] as const;
export type Color = (typeof COLORS)[number];

export const TRACK_LEN = 52;
export const BASE = -1; // token in its base
export const LAST_TRACK = 50; // last track step before the home column
export const HOME = 56; // finished token
export const START: Record<Color, number> = { red: 0, green: 13, yellow: 26, blue: 39 };
export const SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47]); // absolute track indices

export function absOf(color: Color, progress: number): number | null {
  if (progress < 0 || progress > LAST_TRACK) return null;
  return (START[color] + progress) % TRACK_LEN;
}

// [col,row] on the 15x15 grid per absolute track index; index 0 = red's start,
// clockwise. Red base top-left, green top-right, yellow bottom-right, blue bottom-left.
export const PATH: [number, number][] = [
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0], [8, 0],
  [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [14, 8],
  [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14], [6, 14],
  [6, 13], [6, 12], [6, 11], [6, 10], [6, 9],
  [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7], [0, 6],
];

export const HOME_COL: Record<Color, [number, number][]> = {
  red: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  green: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  yellow: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
  blue: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
};

export const BASE_ORIGIN: Record<Color, [number, number]> = {
  red: [0, 0], green: [9, 0], yellow: [9, 9], blue: [0, 9],
};

export function cellOf(color: Color, progress: number): [number, number] | null {
  if (progress === BASE) return null;
  if (progress <= LAST_TRACK) return PATH[absOf(color, progress)!]!;
  if (progress < HOME) return HOME_COL[color][progress - 51]!;
  return [7, 7];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit`
Expected: PASS (all board tests green).

- [ ] **Step 5: Commit**

```bash
git add LUDO/src/shared/board.ts LUDO/src/shared/board.test.ts
git commit -m "ludo: board geometry with tested 52-cell track and home columns"
```

---

### Task 3: Protocol types and legal-move computation

**Files:**
- Create: `src/shared/protocol.ts`, `src/shared/engine.ts`
- Test: `src/shared/engine.test.ts`

**Interfaces:**
- Consumes: everything from `./board`
- Produces:
  - `protocol.ts`: `Seat`, `SeatKind`, `SeatStatus`, `GameEvent`, `GameState`, `Snapshot`, `ClientMsg`, `ServerMsg`, and tunables `TURN_TIMEOUT_MS = 60_000`, `BOT_DELAY_MS = 1_500`, `AUTOPLAYS_TO_BOT = 3`, `GC_GRACE_MS = 3_600_000`, `CLOSE_SUPERSEDED = 4001`, `CLOSE_NOT_FOUND = 4004`
  - `engine.ts` (this task): `newLobby(): GameState`, `newGame(seats: Seat[]): GameState`, `mkSeat(color, name, kind): Seat`, `legalMoves(g: GameState): number[]`, `snapshot(g: GameState): Snapshot`
  - Task 4 adds `applyRoll` / `applyMove` to the same file.

- [ ] **Step 1: Write protocol.ts** (types only, no test of its own; the engine tests exercise it)

```ts
import type { Color } from "./board";

export type SeatKind = "human" | "bot";
export type SeatStatus = "connected" | "away" | "bot_controlled";

export interface Seat {
  color: Color;
  name: string;
  kind: SeatKind;
  status: SeatStatus; // bots are always "connected"
  autoPlays: number; // consecutive auto-played turns while away
}

export type GameEvent =
  | { e: "roll"; color: Color; value: number; auto?: boolean }
  | { e: "move"; color: Color; token: number; from: number; to: number; auto?: boolean }
  | { e: "capture"; by: Color; victim: Color; token: number }
  | { e: "home"; color: Color; token: number }
  | { e: "forfeit"; color: Color } // third consecutive six is void
  | { e: "nomove"; color: Color } // no legal move, turn auto-passed
  | { e: "finish"; color: Color; place: number }
  | { e: "turn"; color: Color }
  | { e: "seat"; color: Color; status: SeatStatus; kind: SeatKind; name: string }
  | { e: "autotaken"; color: Color } // seat flipped to bot control
  | { e: "over"; placements: Color[] };

export interface GameState {
  phase: "lobby" | "playing" | "over";
  seats: Seat[]; // claimed seats in fixed COLORS order
  tokens: Record<string, number[]>; // color -> 4 progress values
  turn: Color;
  turnNumber: number; // increments when the turn passes between seats
  actionSeq: number; // increments on every logged event
  dice: number | null; // null = waiting for a roll
  sixChain: number;
  lastCaptureVictim: Color | null; // casual-bot policy input
  finishOrder: Color[];
  rollLog: { turnNumber: number; color: Color; value: number; auto?: boolean }[];
  eventLog: { seq: number; ev: GameEvent }[]; // last 60, powers away digests
  turnDeadline: number | null; // epoch ms; away human's turn countdown
  botDue: number | null; // epoch ms; when the bot seat acts
}

export type Snapshot = GameState & { movable: number[] };

export type ClientMsg =
  | { t: "join"; name: string }
  | { t: "claim"; color: Color } // "That's me" reclaim of a disconnected seat
  | { t: "start" }
  | { t: "roll"; turnNumber: number; actionSeq: number }
  | { t: "move"; token: number; turnNumber: number; actionSeq: number }
  | { t: "again" }
  | { t: "sync" };

export type ServerMsg =
  | { t: "snapshot"; state: Snapshot; you: Color | null; token?: string }
  | { t: "update"; events: GameEvent[]; state: Snapshot }
  | { t: "err"; code: "full" | "bad_intent" | "not_playing"; msg: string };

export const CLOSE_SUPERSEDED = 4001; // another tab/device took this seat's connection
export const CLOSE_NOT_FOUND = 4004; // room does not exist
export const TURN_TIMEOUT_MS = 60_000;
export const BOT_DELAY_MS = 1_500;
export const AUTOPLAYS_TO_BOT = 3;
export const GC_GRACE_MS = 60 * 60_000;
```

- [ ] **Step 2: Write the failing tests for legal moves**

`src/shared/engine.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { BASE, HOME, type Color } from "./board";
import type { GameState, Seat } from "./protocol";
import { legalMoves, mkSeat, newGame } from "./engine";

export function game4(): GameState {
  const seats: Seat[] = (["red", "green", "yellow", "blue"] as Color[]).map((c, i) =>
    mkSeat(c, `P${i + 1}`, "human"),
  );
  return newGame(seats);
}

// test helper: place tokens and set the die directly
function set(g: GameState, color: Color, tokens: number[], dice: number | null, turn: Color = color) {
  g.tokens[color] = tokens;
  g.dice = dice;
  g.turn = turn;
}

describe("legalMoves", () => {
  it("needs a 6 to leave base", () => {
    const g = game4();
    set(g, "red", [BASE, BASE, BASE, BASE], 5);
    expect(legalMoves(g)).toEqual([]);
    g.dice = 6;
    expect(legalMoves(g)).toEqual([0, 1, 2, 3]);
  });

  it("requires an exact roll to reach home, no bounce-back", () => {
    const g = game4();
    set(g, "red", [54, BASE, BASE, BASE], 3); // needs exactly 2
    expect(legalMoves(g)).toEqual([]);
    g.dice = 2;
    expect(legalMoves(g)).toEqual([0]);
  });

  it("a finished token never moves again", () => {
    const g = game4();
    set(g, "red", [HOME, 10, BASE, BASE], 3);
    expect(legalMoves(g)).toEqual([1]);
  });

  it("an opponent block cannot be landed on or passed through", () => {
    const g = game4();
    // green tokens at green progress 29 and 29 -> absolute (13+29)%52 = 42 (not safe)
    set(g, "green", [29, 29, BASE, BASE], null, "red");
    // red token at progress 40; rolling 2 lands on abs 42, rolling 4 passes through it
    g.tokens.red = [40, BASE, BASE, BASE];
    g.dice = 2;
    expect(legalMoves(g)).toEqual([]);
    g.dice = 4;
    expect(legalMoves(g)).toEqual([]);
    // rolling 1 stops short of the block: legal
    g.dice = 1;
    expect(legalMoves(g)).toEqual([0]);
  });

  it("your own block never blocks you", () => {
    const g = game4();
    set(g, "red", [40, 42, 42, BASE], 2);
    expect(legalMoves(g)).toContain(0);
  });

  it("two opponent tokens on a SAFE square do not form a block", () => {
    const g = game4();
    // green progress 8 twice -> absolute (13+8)%52 = 21, a star square
    set(g, "green", [8, 8, BASE, BASE], null, "red");
    g.tokens.red = [19, BASE, BASE, BASE]; // rolling 2 -> abs (0+21)=21
    g.dice = 2;
    expect(legalMoves(g)).toEqual([0]);
  });

  it("blocks never apply inside the home column", () => {
    const g = game4();
    set(g, "red", [52, BASE, BASE, BASE], 3);
    expect(legalMoves(g)).toEqual([0]);
  });

  it("empty when there is no die or the game is not playing", () => {
    const g = game4();
    g.dice = null;
    expect(legalMoves(g)).toEqual([]);
    g.dice = 6;
    g.phase = "over";
    expect(legalMoves(g)).toEqual([]);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test:unit`
Expected: FAIL, cannot resolve `./engine`.

- [ ] **Step 4: Write engine.ts (part 1)**

```ts
import { BASE, COLORS, HOME, LAST_TRACK, SAFE, absOf, type Color } from "./board";
import type { GameEvent, GameState, Seat, Snapshot } from "./protocol";

export function mkSeat(color: Color, name: string, kind: Seat["kind"]): Seat {
  return { color, name, kind, status: "connected", autoPlays: 0 };
}

export function newLobby(): GameState {
  return {
    phase: "lobby", seats: [], tokens: {}, turn: "red",
    turnNumber: 0, actionSeq: 0, dice: null, sixChain: 0,
    lastCaptureVictim: null, finishOrder: [], rollLog: [], eventLog: [],
    turnDeadline: null, botDue: null,
  };
}

export function newGame(seats: Seat[]): GameState {
  const g = newLobby();
  g.phase = "playing";
  g.seats = [...seats].sort((a, b) => COLORS.indexOf(a.color) - COLORS.indexOf(b.color));
  for (const s of g.seats) g.tokens[s.color] = [BASE, BASE, BASE, BASE];
  g.turn = g.seats[0]!.color;
  g.turnNumber = 1;
  return g;
}

export function seatOf(g: GameState, color: Color): Seat | undefined {
  return g.seats.find((s) => s.color === color);
}

// Is there an opponent block (2+ tokens of one other color) on this absolute square?
// Blocks never form on safe squares (spec rule 7).
function blockedAt(g: GameState, mover: Color, abs: number): boolean {
  if (SAFE.has(abs)) return false;
  for (const s of g.seats) {
    if (s.color === mover) continue;
    let n = 0;
    for (const p of g.tokens[s.color]!) if (absOf(s.color, p) === abs) n++;
    if (n >= 2) return true;
  }
  return false;
}

function canMove(g: GameState, color: Color, token: number, d: number): boolean {
  const p = g.tokens[color]![token]!;
  if (p === HOME) return false;
  if (p === BASE) return d === 6; // own start is a safe square, never blocked
  const target = p + d;
  if (target > HOME) return false; // overshoot: exact roll required for home
  // opponent blocks bar both passing and landing, on the track portion only
  for (let s = p + 1; s <= Math.min(target, LAST_TRACK); s++) {
    if (blockedAt(g, color, absOf(color, s)!)) return false;
  }
  return true;
}

export function legalMoves(g: GameState): number[] {
  if (g.phase !== "playing" || g.dice === null) return [];
  return [0, 1, 2, 3].filter((i) => canMove(g, g.turn, i, g.dice!));
}

export function snapshot(g: GameState): Snapshot {
  return { ...g, movable: legalMoves(g) };
}

export function logEvent(g: GameState, ev: GameEvent): GameEvent {
  g.eventLog.push({ seq: ++g.actionSeq, ev });
  if (g.eventLog.length > 60) g.eventLog.shift();
  return ev;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add LUDO/src/shared/protocol.ts LUDO/src/shared/engine.ts LUDO/src/shared/engine.test.ts
git commit -m "ludo: protocol types and legal-move engine with block and safe-square rules"
```

---

### Task 4: Engine transitions: applyRoll, applyMove, turn flow

**Files:**
- Modify: `src/shared/engine.ts` (append)
- Test: `src/shared/engine.test.ts` (append)

**Interfaces:**
- Consumes: Task 3 exports
- Produces (exact signatures; the DO and bot rely on them):
  - `type StepResult = { g: GameState; events: GameEvent[] }`
  - `applyRoll(g0: GameState, value: number, auto?: boolean): StepResult` (caller guarantees `g0.dice === null` and `phase === "playing"`)
  - `applyMove(g0: GameState, token: number, auto?: boolean): StepResult | null` (null = illegal move; never mutates input, returns a structuredClone)
  - Both auto-advance the turn (auto-pass on no legal move, forfeit on third six, extra roll on 6/capture/home, finish/placement handling, game over when one unfinished seat remains or only actual bots remain unfinished).

- [ ] **Step 1: Write the failing tests** (append to `src/shared/engine.test.ts`)

```ts
import { applyMove, applyRoll } from "./engine";

describe("applyRoll", () => {
  it("logs the roll and waits for a move when one is legal", () => {
    const g = game4();
    g.tokens.red = [0, BASE, BASE, BASE];
    const { g: g2, events } = applyRoll(g, 3);
    expect(g2.dice).toBe(3);
    expect(g2.rollLog.at(-1)).toMatchObject({ color: "red", value: 3 });
    expect(events[0]).toMatchObject({ e: "roll", color: "red", value: 3 });
  });

  it("auto-passes instantly when no move is legal, without a timer", () => {
    const g = game4(); // all tokens in base
    const { g: g2, events } = applyRoll(g, 4);
    expect(g2.dice).toBeNull();
    expect(g2.turn).toBe("green");
    expect(g2.turnNumber).toBe(2);
    expect(events.map((e) => e.e)).toEqual(["roll", "nomove", "turn"]);
  });

  it("voids the third consecutive six; prior moves stand; turn ends", () => {
    let g = game4();
    g.tokens.red = [5, 10, BASE, BASE];
    let r = applyRoll(g, 6);
    r = applyMove(r.g, 0)!; // move to 11, extra roll pending
    expect(r.g.turn).toBe("red");
    r = applyRoll(r.g, 6);
    r = applyMove(r.g, 1)!; // move to 16, extra roll pending
    expect(r.g.turn).toBe("red");
    const third = applyRoll(r.g, 6);
    expect(third.events.some((e) => e.e === "forfeit")).toBe(true);
    expect(third.g.turn).toBe("green");
    expect(third.g.tokens.red).toEqual([11, 16, BASE, BASE]); // moves stood
  });

  it("a non-six resets the six chain", () => {
    let g = game4();
    g.tokens.red = [5, BASE, BASE, BASE];
    let r = applyRoll(g, 6);
    r = applyMove(r.g, 0)!;
    r = applyRoll(r.g, 2); // chain broken
    r = applyMove(r.g, 0)!;
    expect(r.g.turn).toBe("green");
    expect(r.g.sixChain).toBe(0);
  });
});

describe("applyMove", () => {
  it("exits base to the start square on a 6 and keeps the extra roll", () => {
    const g = game4();
    const r1 = applyRoll(g, 6);
    const r2 = applyMove(r1.g, 0)!;
    expect(r2.g.tokens.red![0]).toBe(0);
    expect(r2.g.turn).toBe("red"); // extra roll
    expect(r2.g.dice).toBeNull();
  });

  it("rejects an illegal move", () => {
    const g = game4();
    const r1 = applyRoll(g, 6);
    const g2 = r1.g;
    g2.dice = 3; // force a state where token 0 in base cannot move
    expect(applyMove(g2, 0)).toBeNull();
  });

  it("captures a lone opponent, sends it to base, grants an extra roll", () => {
    const g = game4();
    g.tokens.red = [1, BASE, BASE, BASE]; // roll 2 lands on progress 3 = absolute 3
    g.tokens.green = [42, BASE, BASE, BASE]; // green progress 42 = absolute (13+42)%52 = 3
    const r1 = applyRoll(g, 2);
    const r2 = applyMove(r1.g, 0)!;
    expect(r2.g.tokens.green![0]).toBe(BASE);
    expect(r2.events.some((e) => e.e === "capture")).toBe(true);
    expect(r2.g.turn).toBe("red"); // extra roll for the capture
    expect(r2.g.lastCaptureVictim).toBe("green");
  });

  it("never captures on a safe square", () => {
    const g = game4();
    g.tokens.red = [6, BASE, BASE, BASE]; // roll 2 -> progress 8 -> abs 8, a star
    g.tokens.green = [47, BASE, BASE, BASE]; // abs (13+47)%52 = 8
    const r1 = applyRoll(g, 2);
    const r2 = applyMove(r1.g, 0)!;
    expect(r2.g.tokens.green![0]).toBe(47); // untouched
    expect(r2.events.some((e) => e.e === "capture")).toBe(false);
    expect(r2.g.turn).toBe("green"); // no extra roll either
  });

  it("getting a token home grants one extra roll; multi-trigger is still one", () => {
    const g = game4();
    g.tokens.red = [50, BASE, BASE, BASE];
    const r1 = applyRoll(g, 6); // 50 + 6 = 56 exactly home, AND it is a six
    const r2 = applyMove(r1.g, 0)!;
    expect(r2.g.tokens.red![0]).toBe(HOME);
    expect(r2.events.some((e) => e.e === "home")).toBe(true);
    expect(r2.g.turn).toBe("red"); // exactly one extra roll pending
  });

  it("finishing all four tokens records placement and skips the extra roll", () => {
    const g = game4();
    g.tokens.red = [HOME, HOME, HOME, 50];
    const r1 = applyRoll(g, 6);
    const r2 = applyMove(r1.g, 3)!;
    expect(r2.g.finishOrder).toEqual(["red"]);
    expect(r2.events.some((e) => e.e === "finish")).toBe(true);
    expect(r2.g.turn).toBe("green"); // no extra roll for a finished player
  });

  it("skips finished players in turn order", () => {
    const g = game4();
    g.finishOrder = ["green"];
    g.tokens.red = [0, BASE, BASE, BASE];
    const r1 = applyRoll(g, 1);
    const r2 = applyMove(r1.g, 0)!;
    expect(r2.g.turn).toBe("yellow");
  });

  it("ends the game with full placements when only one seat is unfinished", () => {
    const g = game4();
    g.finishOrder = ["green", "yellow"];
    g.tokens.red = [HOME, HOME, HOME, 55];
    const r1 = applyRoll(g, 1);
    const r2 = applyMove(r1.g, 3)!;
    expect(r2.g.phase).toBe("over");
    const over = r2.events.find((e) => e.e === "over");
    expect(over).toMatchObject({ placements: ["green", "yellow", "red", "blue"] });
  });

  it("ends the game when only actual bots remain unfinished", () => {
    const seats = [
      mkSeat("red", "Dad", "human"),
      mkSeat("green", "Bot 1", "bot"),
      mkSeat("yellow", "Bot 2", "bot"),
      mkSeat("blue", "Bot 3", "bot"),
    ];
    const g = newGame(seats);
    g.tokens.red = [HOME, HOME, HOME, 55];
    const r1 = applyRoll(g, 1);
    const r2 = applyMove(r1.g, 3)!;
    expect(r2.g.phase).toBe("over");
    expect(r2.g.finishOrder[0]).toBe("red");
  });

  it("a bot_controlled human seat does NOT end the game", () => {
    const g = game4();
    g.seats[1]!.status = "bot_controlled";
    g.finishOrder = [];
    g.tokens.red = [0, BASE, BASE, BASE];
    const r1 = applyRoll(g, 1);
    const r2 = applyMove(r1.g, 0)!;
    expect(r2.g.phase).toBe("playing");
  });

  it("never mutates its input state", () => {
    const g = game4();
    const before = JSON.stringify(g);
    applyRoll(g, 6);
    expect(JSON.stringify(g)).toBe(before);
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npm run test:unit`
Expected: FAIL, `applyRoll` not exported.

- [ ] **Step 3: Append the implementation to engine.ts**

```ts
export type StepResult = { g: GameState; events: GameEvent[] };

function advanceTurn(g: GameState, events: GameEvent[]) {
  g.dice = null;
  g.sixChain = 0;
  g.turnDeadline = null;
  g.botDue = null;
  const order = g.seats.map((s) => s.color);
  const alive = order.filter((c) => !g.finishOrder.includes(c));
  const humansAlive = alive.filter((c) => seatOf(g, c)!.kind === "human");
  // over when one unfinished seat remains, or only actual bots are left playing
  if (alive.length <= 1 || humansAlive.length === 0) {
    g.phase = "over";
    const placements = [...g.finishOrder, ...alive];
    events.push(logEvent(g, { e: "over", placements }));
    return;
  }
  let i = order.indexOf(g.turn);
  do i = (i + 1) % order.length;
  while (g.finishOrder.includes(order[i]!));
  g.turn = order[i]!;
  g.turnNumber++;
  events.push(logEvent(g, { e: "turn", color: g.turn }));
}

export function applyRoll(g0: GameState, value: number, auto = false): StepResult {
  const g = structuredClone(g0);
  const events: GameEvent[] = [];
  const color = g.turn;
  g.rollLog.push({ turnNumber: g.turnNumber, color, value, ...(auto ? { auto } : {}) });
  events.push(logEvent(g, { e: "roll", color, value, ...(auto ? { auto } : {}) }));
  if (value === 6) {
    g.sixChain++;
    if (g.sixChain >= 3) {
      events.push(logEvent(g, { e: "forfeit", color }));
      advanceTurn(g, events);
      return { g, events };
    }
  } else {
    g.sixChain = 0;
  }
  g.dice = value;
  if (legalMoves(g).length === 0) {
    events.push(logEvent(g, { e: "nomove", color }));
    advanceTurn(g, events);
  }
  return { g, events };
}

export function applyMove(g0: GameState, token: number, auto = false): StepResult | null {
  if (g0.phase !== "playing" || g0.dice === null) return null;
  if (!legalMoves(g0).includes(token)) return null;
  const g = structuredClone(g0);
  const events: GameEvent[] = [];
  const color = g.turn;
  const d = g.dice!;
  const from = g.tokens[color]![token]!;
  const to = from === BASE ? 0 : from + d;
  g.tokens[color]![token] = to;
  events.push(logEvent(g, { e: "move", color, token, from, to, ...(auto ? { auto } : {}) }));

  // one extraRollPending boolean: six OR capture OR token home = one extra roll
  let extra = d === 6;

  const abs = absOf(color, to);
  if (abs !== null && !SAFE.has(abs)) {
    for (const s of g.seats) {
      if (s.color === color) continue;
      g.tokens[s.color]!.forEach((p, i) => {
        if (absOf(s.color, p) === abs) {
          g.tokens[s.color]![i] = BASE;
          events.push(logEvent(g, { e: "capture", by: color, victim: s.color, token: i }));
          g.lastCaptureVictim = s.color;
          extra = true;
        }
      });
    }
  }

  if (to === HOME) {
    events.push(logEvent(g, { e: "home", color, token }));
    extra = true;
    if (g.tokens[color]!.every((p) => p === HOME)) {
      g.finishOrder.push(color);
      events.push(logEvent(g, { e: "finish", color, place: g.finishOrder.length }));
      extra = false; // finished players do not roll again
    }
  }

  g.dice = null;
  if (extra) {
    events.push(logEvent(g, { e: "turn", color })); // same player rolls again
  } else {
    advanceTurn(g, events);
  }
  return { g, events };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:unit`
Expected: PASS (all engine tests green).

- [ ] **Step 5: Commit**

```bash
git add LUDO/src/shared/engine.ts LUDO/src/shared/engine.test.ts
git commit -m "ludo: full turn engine encoding the spec rules as tests"
```

---

### Task 5: Bot chooser (`src/shared/bot.ts`)

**Files:**
- Create: `src/shared/bot.ts`
- Test: `src/shared/bot.test.ts`

**Interfaces:**
- Consumes: `legalMoves` from `./engine`, board constants, `GameState`
- Produces: `chooseBotMove(g: GameState, rand: () => number): number` where the return value is ALWAYS a member of `legalMoves(g)`. Throws if called with no legal moves (callers roll first and check). `rand` is injected for deterministic tests; production passes a crypto-backed `() => number` in [0,1).
- Policy (from spec section 7): capture > exit base > reach a safe square or home > advance the furthest token. Casual softening: captures are taken with probability 0.8 when any non-capture alternative exists, and a capture against `g.lastCaptureVictim` is avoided when any other choice exists. No lookahead, no difficulty levels. This is deliberately final (`ponytail:` comment in code).

- [ ] **Step 1: Write the failing test**

`src/shared/bot.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { BASE } from "./board";
import { applyRoll, legalMoves } from "./engine";
import { chooseBotMove } from "./bot";
import { game4 } from "./engine.test";

const always = (v: number) => () => v;

describe("chooseBotMove", () => {
  it("always returns a legal move across many random states", () => {
    for (let seed = 0; seed < 200; seed++) {
      const g = game4();
      // scatter tokens deterministically
      g.tokens.red = [seed % 57 === 56 ? 55 : (seed % 51), BASE, 10, 20];
      g.tokens.green = [(seed * 7) % 51, BASE, BASE, 5];
      const r = applyRoll(g, (seed % 6) + 1);
      if (r.g.turn !== "red" || r.g.dice === null) continue; // auto-passed or forfeited
      const pick = chooseBotMove(r.g, always(0.5));
      expect(legalMoves(r.g)).toContain(pick);
    }
  });

  it("prefers a capture when rand is under the capture probability", () => {
    const g = game4();
    g.tokens.red = [1, 30, BASE, BASE];
    g.tokens.green = [42, BASE, BASE, BASE]; // abs 3, capturable by red token 0 rolling 2
    g.dice = 2;
    expect(chooseBotMove(g, always(0.1))).toBe(0);
  });

  it("can decline a capture (casual policy) when an alternative exists", () => {
    const g = game4();
    g.tokens.red = [1, 30, BASE, BASE];
    g.tokens.green = [42, BASE, BASE, BASE];
    g.dice = 2;
    expect(chooseBotMove(g, always(0.95))).not.toBe(0);
  });

  it("takes the capture anyway when it is the only legal move", () => {
    const g = game4();
    g.tokens.red = [1, BASE, BASE, BASE];
    g.tokens.green = [42, BASE, BASE, BASE];
    g.dice = 2;
    expect(chooseBotMove(g, always(0.95))).toBe(0);
  });

  it("avoids capturing the same victim twice in a row when alternatives exist", () => {
    const g = game4();
    g.lastCaptureVictim = "green";
    g.tokens.red = [1, 30, BASE, BASE];
    g.tokens.green = [42, BASE, BASE, BASE];
    g.dice = 2;
    expect(chooseBotMove(g, always(0.1))).not.toBe(0);
  });

  it("prefers exiting base over a plain advance", () => {
    const g = game4();
    g.tokens.red = [BASE, 20, BASE, BASE];
    g.dice = 6;
    expect(chooseBotMove(g, always(0.5))).not.toBe(1);
  });

  it("otherwise advances the furthest token", () => {
    const g = game4();
    g.tokens.red = [3, 30, 15, BASE];
    g.dice = 2;
    expect(chooseBotMove(g, always(0.5))).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit`
Expected: FAIL, cannot resolve `./bot`.

- [ ] **Step 3: Write the implementation**

`src/shared/bot.ts`:

```ts
import { BASE, HOME, SAFE, absOf, type Color } from "./board";
import type { GameState } from "./protocol";
import { legalMoves } from "./engine";

// ponytail: five-rule priority chooser, no lookahead, no difficulty levels.
// This is deliberately final for a family app (spec section 7).
export function chooseBotMove(g: GameState, rand: () => number): number {
  const legal = legalMoves(g);
  if (legal.length === 0) throw new Error("chooseBotMove called with no legal moves");
  const color = g.turn;
  const d = g.dice!;

  const info = legal.map((token) => {
    const from = g.tokens[color]![token]!;
    const to = from === BASE ? 0 : from + d;
    const abs = absOf(color, to);
    let victim: Color | null = null;
    if (abs !== null && !SAFE.has(abs)) {
      for (const s of g.seats) {
        if (s.color === color) continue;
        if (g.tokens[s.color]!.some((p) => absOf(s.color, p) === abs)) victim = s.color;
      }
    }
    return { token, from, to, abs, victim };
  });

  const captures = info.filter((m) => m.victim !== null);
  // casual policy: avoid the player we captured last time when any other choice exists
  const polite = captures.filter((m) => m.victim !== g.lastCaptureVictim);
  const onlyCaptures = captures.length === legal.length;
  // if every capture would re-target the last victim and non-capture moves exist,
  // skip capturing entirely this turn
  const skipCaptures = captures.length > 0 && polite.length === 0 && !onlyCaptures;
  if (captures.length > 0 && !skipCaptures && (onlyCaptures || rand() < 0.8)) {
    const pool = polite.length > 0 ? polite : captures;
    return pool[Math.floor(rand() * pool.length) % pool.length]!.token;
  }

  const nonCapture = info.filter((m) => m.victim === null);
  const pool = nonCapture.length > 0 ? nonCapture : info;
  const exit = pool.find((m) => m.from === BASE);
  if (exit) return exit.token;
  const safeOrHome = pool.filter((m) => m.to === HOME || (m.abs !== null && SAFE.has(m.abs)));
  if (safeOrHome.length > 0) return safeOrHome.sort((a, b) => b.from - a.from)[0]!.token;
  return pool.sort((a, b) => b.from - a.from)[0]!.token;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add LUDO/src/shared/bot.ts LUDO/src/shared/bot.test.ts
git commit -m "ludo: casual bot chooser with capture softening"
```

---

### Task 6: GameRoom Durable Object: identity, lobby, seats

**Files:**
- Modify: `src/server/index.ts` (replace the Task 1 echo version wholesale)
- Create: `vitest.do.config.ts`, `test/do/tsconfig.json`
- Test: `test/do/game-room.test.ts`

**Interfaces:**
- Consumes: `newLobby`, `mkSeat`, `snapshot`, `logEvent` from `../shared/engine`; protocol types and close codes.
- Produces: the `GameRoom` class handling connect/join/claim/sync/disconnect, with `game: GameState | null`, `secrets: Record<string, Color>`, `gcAt: number | null` fields, and private helpers `persist()`, `commit(events, exceptId?)`, `sendSnapshot(conn, token?)`, `present(color)`, `err(conn, code, msg)`. Task 7 extends `onMessage` with the game intents and `commit` with timers/alarms.
- Wire protocol behavior later tasks rely on:
  - Connect with `?create=1` initializes an empty lobby; without it, a room with no game closes with code 4004.
  - Connect with a valid `?token=` re-attaches that seat, kicks any older connection on the same seat with code 4001, resets `autoPlays`, clears `turnDeadline` if it was that seat's turn.
  - `join` assigns the next free color, mints a `crypto.randomUUID()` token, and answers with a `snapshot` message carrying `token`.
  - `claim` re-seats a disconnected human seat with a FRESH token (old rejoin links for that seat die), rejected while the seat has a live connection.
  - Every accepted change persists to storage then broadcasts an `update`.

- [ ] **Step 1: Write vitest.do.config.ts and test/do/tsconfig.json**

`vitest.do.config.ts`:

```ts
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
    }),
  ],
  test: {
    include: ["test/do/**/*.test.ts"],
  },
});
```

`test/do/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.worker.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["@cloudflare/vitest-pool-workers/types"]
  },
  "include": ["./**/*.ts", "../../worker-configuration.d.ts", "../../src/server/**/*.ts", "../../src/shared/**/*.ts"]
}
```

Reminder: `npm run test:do` already passes `--max-workers=1 --no-isolate` (WebSockets + DO storage do not work under per-file isolation; this is a documented platform limitation, not a smell).

- [ ] **Step 2: Write the failing DO tests**

`test/do/game-room.test.ts`:

```ts
import { env, exports } from "cloudflare:workers";
import { runInDurableObject } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GameRoom } from "../../src/server/index";
import type { ServerMsg } from "../../src/shared/protocol";

let roomN = 0;
const freshRoom = () => `t${Date.now()}-${roomN++}`;

async function open(room: string, params = "") {
  const res = await exports.default.fetch(
    `https://example.com/parties/game-room/${room}${params}`,
    { headers: { Upgrade: "websocket" } },
  );
  expect(res.status).toBe(101);
  const ws = res.webSocket!;
  const queue: ServerMsg[] = [];
  const waiters: ((m: ServerMsg) => void)[] = [];
  const closes: { code: number }[] = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse((e as MessageEvent).data as string) as ServerMsg;
    const w = waiters.shift();
    if (w) w(m);
    else queue.push(m);
  });
  ws.addEventListener("close", (e) => closes.push({ code: (e as CloseEvent).code }));
  ws.accept();
  return {
    ws,
    closes,
    send: (m: unknown) => ws.send(JSON.stringify(m)),
    next: (): Promise<ServerMsg> =>
      queue.length > 0
        ? Promise.resolve(queue.shift()!)
        : new Promise((r) => waiters.push(r)),
  };
}

const settle = () => new Promise((r) => setTimeout(r, 50));

describe("GameRoom identity and lobby", () => {
  it("rejects joining a room that was never created", async () => {
    const room = freshRoom();
    const c = await open(room); // no ?create=1
    await settle();
    expect(c.closes[0]?.code).toBe(4004);
  });

  it("creates a lobby and seats two players in color order", async () => {
    const room = freshRoom();
    const a = await open(room, "?create=1");
    const snapA = await a.next();
    expect(snapA).toMatchObject({ t: "snapshot", you: null });
    a.send({ t: "join", name: "Dad" });
    const seated = await a.next();
    expect(seated).toMatchObject({ t: "snapshot", you: "red" });
    expect((seated as any).token).toBeTruthy();

    const b = await open(room);
    await b.next(); // b's initial snapshot
    b.send({ t: "join", name: "Mom" });
    const seatedB = await b.next();
    expect(seatedB).toMatchObject({ t: "snapshot", you: "green" });
  });

  it("persists seats to storage on every change", async () => {
    const room = freshRoom();
    const a = await open(room, "?create=1");
    await a.next();
    a.send({ t: "join", name: "Dad" });
    await a.next();
    await settle();
    const stub = env.GameRoom.get(env.GameRoom.idFromName(room));
    await runInDurableObject(stub, async (_i: GameRoom, state) => {
      const game = (await state.storage.get("game")) as any;
      expect(game.seats).toHaveLength(1);
      expect(game.seats[0]).toMatchObject({ color: "red", name: "Dad", kind: "human" });
      const secrets = (await state.storage.get("secrets")) as Record<string, string>;
      expect(Object.values(secrets)).toContain("red");
    });
  });

  it("reconnecting with the token reclaims the seat and kicks the older tab", async () => {
    const room = freshRoom();
    const a = await open(room, "?create=1");
    await a.next();
    a.send({ t: "join", name: "Dad" });
    const seated = (await a.next()) as Extract<ServerMsg, { t: "snapshot" }>;
    const token = seated.token!;

    const b = await open(room, `?token=${token}`);
    const snapB = await b.next();
    expect(snapB).toMatchObject({ t: "snapshot", you: "red" });
    await settle();
    expect(a.closes[0]?.code).toBe(4001); // older connection superseded
  });

  it("claim hands a disconnected seat to a new device with a fresh token", async () => {
    const room = freshRoom();
    const a = await open(room, "?create=1");
    await a.next();
    a.send({ t: "join", name: "Mom" });
    const seated = (await a.next()) as Extract<ServerMsg, { t: "snapshot" }>;
    const oldToken = seated.token!;
    a.ws.close();
    await settle();

    const b = await open(room);
    await b.next();
    b.send({ t: "claim", color: "red" });
    const claimed = (await b.next()) as Extract<ServerMsg, { t: "snapshot" }>;
    expect(claimed.you).toBe("red");
    expect(claimed.token).toBeTruthy();
    expect(claimed.token).not.toBe(oldToken);

    // the old token is dead now
    const c = await open(room, `?token=${oldToken}`);
    const snapC = await c.next();
    expect((snapC as any).you).toBeNull();
  });

  it("claim is rejected while the seat is still connected", async () => {
    const room = freshRoom();
    const a = await open(room, "?create=1");
    await a.next();
    a.send({ t: "join", name: "Mom" });
    await a.next();

    const b = await open(room);
    await b.next();
    b.send({ t: "claim", color: "red" });
    const rejected = await b.next();
    expect(rejected.t).toBe("err");
  });
});
```

- [ ] **Step 3: Run DO tests to verify they fail**

Run: `npm run test:do`
Expected: FAIL (echo server has none of this behavior).

- [ ] **Step 4: Replace src/server/index.ts**

```ts
import { Server, routePartykitRequest } from "partyserver";
import type { Connection, ConnectionContext, WSMessage } from "partyserver";
import { COLORS, type Color } from "../shared/board";
import {
  CLOSE_NOT_FOUND, CLOSE_SUPERSEDED,
  type ClientMsg, type GameEvent, type GameState, type ServerMsg,
} from "../shared/protocol";
import { logEvent, mkSeat, newLobby, snapshot } from "../shared/engine";

type ConnState = { color: Color | null };

export class GameRoom extends Server<Env> {
  static options = { hibernate: true };

  // in-memory cache over DO storage; rehydrated in onStart after hibernation
  game: GameState | null = null;
  secrets: Record<string, Color> = {}; // rejoin token -> seat color, never sent in snapshots
  gcAt: number | null = null;

  async onStart() {
    this.game = (await this.ctx.storage.get<GameState>("game")) ?? null;
    this.secrets = (await this.ctx.storage.get<Record<string, Color>>("secrets")) ?? {};
    this.gcAt = (await this.ctx.storage.get<number | null>("gcAt")) ?? null;
  }

  async onConnect(conn: Connection<ConnState>, ctx: ConnectionContext) {
    const url = new URL(ctx.request.url);
    if (!this.game) {
      if (url.searchParams.get("create") !== "1") {
        conn.close(CLOSE_NOT_FOUND, "no such game");
        return;
      }
      this.game = newLobby();
    }
    this.gcAt = null;
    const token = url.searchParams.get("token");
    const color = (token && this.secrets[token]) || null;
    conn.setState({ color });
    if (color) {
      await this.seatConnected(conn, color);
    } else {
      await this.commit([]); // persist lobby creation / refresh gc state
    }
    this.sendSnapshot(conn);
  }

  async onMessage(conn: Connection<ConnState>, raw: WSMessage) {
    if (typeof raw !== "string" || !this.game) return;
    let msg: ClientMsg;
    try {
      msg = JSON.parse(raw) as ClientMsg;
    } catch {
      return;
    }
    switch (msg.t) {
      case "join": return this.handleJoin(conn, msg.name);
      case "claim": return this.handleClaim(conn, msg.color);
      case "sync": return this.sendSnapshot(conn);
      // Task 7 adds: start, roll, move, again
    }
  }

  async onClose(conn: Connection<ConnState>) {
    await this.dropped(conn);
  }

  async onError(conn: Connection<ConnState>) {
    await this.dropped(conn);
  }

  // ---- handlers ----

  private async handleJoin(conn: Connection<ConnState>, name: string) {
    const g = this.game!;
    if (conn.state?.color) return this.sendSnapshot(conn); // already seated; idempotent
    if (g.phase !== "lobby") {
      return this.err(conn, "not_playing", "This game already started. If one of the seats is yours, tap it below.");
    }
    const free = COLORS.find((c) => !g.seats.some((s) => s.color === c));
    if (!free) return this.err(conn, "full", "All four seats are taken.");
    const seat = mkSeat(free, name.trim().slice(0, 16) || "Player", "human");
    g.seats.push(seat);
    g.seats.sort((a, b) => COLORS.indexOf(a.color) - COLORS.indexOf(b.color));
    const token = crypto.randomUUID();
    this.secrets[token] = free;
    conn.setState({ color: free });
    const events = [logEvent(g, { e: "seat", color: free, status: "connected", kind: "human", name: seat.name })];
    this.sendSnapshot(conn, token);
    await this.commit(events, conn.id);
  }

  private async handleClaim(conn: Connection<ConnState>, color: Color) {
    const g = this.game!;
    const seat = g.seats.find((s) => s.color === color);
    if (!seat || seat.kind !== "human") {
      return this.err(conn, "bad_intent", "That seat cannot be claimed.");
    }
    const occupied = [...this.getConnections<ConnState>()].some(
      (c) => c.id !== conn.id && c.state?.color === color,
    );
    if (occupied) return this.err(conn, "bad_intent", `${seat.name} is still connected on that seat.`);
    // fresh token; older rejoin links for this seat stop working
    for (const [tok, c] of Object.entries(this.secrets)) if (c === color) delete this.secrets[tok];
    const token = crypto.randomUUID();
    this.secrets[token] = color;
    conn.setState({ color });
    seat.status = "connected";
    seat.autoPlays = 0;
    if (g.turn === color) g.turnDeadline = null;
    const events = [logEvent(g, { e: "seat", color, status: "connected", kind: "human", name: seat.name })];
    this.sendSnapshot(conn, token);
    await this.commit(events, conn.id);
  }

  private async seatConnected(conn: Connection<ConnState>, color: Color) {
    // latest connection wins: kick any older tab or device holding this seat
    for (const other of this.getConnections<ConnState>()) {
      if (other.id !== conn.id && other.state?.color === color) {
        other.close(CLOSE_SUPERSEDED, "superseded");
      }
    }
    const g = this.game!;
    const seat = g.seats.find((s) => s.color === color);
    const events: GameEvent[] = [];
    if (seat && seat.kind === "human") {
      seat.status = "connected";
      seat.autoPlays = 0;
      if (g.turn === color) g.turnDeadline = null;
      events.push(logEvent(g, { e: "seat", color, status: "connected", kind: seat.kind, name: seat.name }));
    }
    await this.commit(events, conn.id);
  }

  private async dropped(conn: Connection<ConnState>) {
    if (!this.game) return;
    const g = this.game;
    const events: GameEvent[] = [];
    const color = conn.state?.color;
    if (color) {
      const stillThere = [...this.getConnections<ConnState>()].some(
        (c) => c.id !== conn.id && c.state?.color === color,
      );
      const seat = g.seats.find((s) => s.color === color);
      if (!stillThere && seat && seat.kind === "human" && seat.status === "connected") {
        seat.status = "away";
        events.push(logEvent(g, { e: "seat", color, status: "away", kind: seat.kind, name: seat.name }));
      }
    }
    await this.commit(events, conn.id);
  }

  // ---- plumbing ----

  private sendSnapshot(conn: Connection<ConnState>, token?: string) {
    const msg: ServerMsg = {
      t: "snapshot",
      state: snapshot(this.game!),
      you: conn.state?.color ?? null,
      ...(token ? { token } : {}),
    };
    conn.send(JSON.stringify(msg));
  }

  private err(conn: Connection<ConnState>, code: "full" | "bad_intent" | "not_playing", msgText: string) {
    conn.send(JSON.stringify({ t: "err", code, msg: msgText } satisfies ServerMsg));
  }

  private present(color: Color): boolean {
    return [...this.getConnections<ConnState>()].some((c) => c.state?.color === color);
  }

  // Task 6 version: persist + broadcast. Task 7 extends with turn timers, alarms, GC.
  // Only event-carrying commits broadcast; the connecting client always gets its
  // own fresh snapshot, so empty commits (room creation, presence bookkeeping)
  // must stay silent or tests and clients would see spurious empty updates.
  private async commit(events: GameEvent[], exceptId?: string) {
    await this.persist();
    if (events.length > 0) {
      this.broadcast(
        JSON.stringify({ t: "update", events, state: snapshot(this.game!) } satisfies ServerMsg),
        exceptId ? [exceptId] : [],
      );
    }
  }

  private async persist() {
    await this.ctx.storage.put({ game: this.game, secrets: this.secrets, gcAt: this.gcAt });
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ??
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
```

- [ ] **Step 5: Run all tests**

Run: `npm run test:unit && npm run test:do`
Expected: PASS. If a DO test hangs, check that `--max-workers=1 --no-isolate` are present in the `test:do` script and that room names are unique per test (storage is shared across the file in this mode).

- [ ] **Step 6: Commit**

```bash
git add LUDO/src/server/index.ts LUDO/vitest.do.config.ts LUDO/test/
git commit -m "ludo: game room identity, lobby, seat claim over websockets"
```

---

### Task 7: GameRoom game loop: intents, alarms, auto-play, bots, GC

**Files:**
- Modify: `src/server/index.ts`
- Test: `test/do/game-room.test.ts` (append)

**Interfaces:**
- Consumes: `applyRoll`, `applyMove`, `newGame`, `legalMoves` from `../shared/engine`; `chooseBotMove` from `../shared/bot`; tunables from `../shared/protocol`.
- Produces the complete server. Behavior contract (client relies on all of it):
  - `start` (lobby, seated senders only): fills every unclaimed color with a bot seat named `Bot 1..3`, starts the game, first seat's turn.
  - `roll`/`move`: only from the seat whose turn it is; stale `(turnNumber, actionSeq)` pairs are silently ignored (reconnect resends are harmless); dice are `crypto.getRandomValues`-backed; a human acting resets their `autoPlays` to 0.
  - `again` (over phase): same seats, fresh game.
  - One DO alarm multiplexes three deadlines: `game.botDue` (bot seat acts ~1.5s after its turn starts), `game.turnDeadline` (away human's turn auto-plays after 60s), `gcAt` (room storage wiped 60min after the last seated connection leaves). `armAlarm()` sets the earliest; `onAlarm()` handles whatever is due and re-arms.
  - Auto-play: the bot plays the away human's ENTIRE turn (with `auto: true` flags on roll/move events); 3 consecutive auto-plays flip the seat to `bot_controlled` (emits `autotaken`); any reconnect flips it back (already handled by `seatConnected` in Task 6).
  - Bot play pauses when zero seated connections remain (no `botDue` armed) and resumes on the next connect; this plus GC means an abandoned room goes quiet, then gets wiped.

- [ ] **Step 1: Write the failing tests** (append to `test/do/game-room.test.ts`)

```ts
async function seatAndStart(room: string) {
  const a = await open(room, "?create=1");
  await a.next();
  a.send({ t: "join", name: "Dad" });
  await a.next();
  a.send({ t: "start" });
  const upd = (await a.next()) as Extract<ServerMsg, { t: "update" }>;
  return { a, upd };
}

describe("GameRoom game loop", () => {
  it("start fills empty seats with bots and begins play", async () => {
    const room = freshRoom();
    const { upd } = await seatAndStart(room);
    expect(upd.state.phase).toBe("playing");
    expect(upd.state.seats).toHaveLength(4);
    expect(upd.state.seats.filter((s) => s.kind === "bot")).toHaveLength(3);
    expect(upd.state.turn).toBe("red");
    expect(upd.state.turnNumber).toBe(1);
  });

  it("rolls only for the seat whose turn it is, and ignores stale resends", async () => {
    const room = freshRoom();
    const { a, upd } = await seatAndStart(room);
    const { turnNumber, actionSeq } = upd.state;
    a.send({ t: "roll", turnNumber, actionSeq });
    const rolled = (await a.next()) as Extract<ServerMsg, { t: "update" }>;
    expect(rolled.events.some((e) => e.e === "roll")).toBe(true);
    const rollsAfterOne = rolled.state.rollLog.length;
    a.send({ t: "roll", turnNumber, actionSeq }); // duplicate resend of the same intent
    a.send({ t: "sync" });
    // the duplicate may draw an err ("not your turn") if the first roll auto-passed;
    // either way the snapshot that follows must show no extra roll happened
    let snap = await a.next();
    while (snap.t !== "snapshot") snap = await a.next();
    expect(snap.state.rollLog.length).toBe(rollsAfterOne); // duplicate was ignored
  });

  it("a bot turn is scheduled and plays via the alarm", async () => {
    const room = freshRoom();
    const { a, upd } = await seatAndStart(room);
    // force red (the human) to have no legal move so the turn passes to a bot:
    // roll intents auto-pass when nothing can move; all tokens are in base and
    // any non-6 roll has no legal move. Roll until the turn leaves red.
    let state = upd.state;
    for (let i = 0; i < 20 && state.turn === "red"; i++) {
      a.send({ t: "roll", turnNumber: state.turnNumber, actionSeq: state.actionSeq });
      const u = (await a.next()) as Extract<ServerMsg, { t: "update" }>;
      state = u.state;
      // if red rolled a 6 it must move; move token 0
      if (state.turn === "red" && state.dice !== null) {
        a.send({ t: "move", token: state.movable[0]!, turnNumber: state.turnNumber, actionSeq: state.actionSeq });
        const u2 = (await a.next()) as Extract<ServerMsg, { t: "update" }>;
        state = u2.state;
      }
    }
    expect(state.turn).not.toBe("red");
    expect(state.botDue).toBeTypeOf("number");

    // fire the pending alarm now instead of waiting 1.5s. onAlarm compares
    // wall-clock time to botDue, so fast-forward the deadline first.
    const stub = env.GameRoom.get(env.GameRoom.idFromName(room));
    const { runDurableObjectAlarm } = await import("cloudflare:test");
    await runInDurableObject(stub, async (i: GameRoom) => {
      i.game!.botDue = Date.now() - 1;
      await i.ctx.storage.put("game", i.game);
      await i.ctx.storage.setAlarm(Date.now() - 1);
    });
    const ran = await runDurableObjectAlarm(stub);
    expect(ran).toBe(true);
    const u = (await a.next()) as Extract<ServerMsg, { t: "update" }>;
    expect(u.events.some((e) => e.e === "roll")).toBe(true); // the bot acted
  });

  it("an away human's turn is auto-played after the deadline and flips to bot control after three", async () => {
    const room = freshRoom();
    const { a, upd } = await seatAndStart(room);
    expect(upd.state.turn).toBe("red");
    a.ws.close(); // Dad's phone dies during his own turn
    await settle();

    const stub = env.GameRoom.get(env.GameRoom.idFromName(room));
    const { runDurableObjectAlarm } = await import("cloudflare:test");
    await runInDurableObject(stub, async (i: GameRoom) => {
      expect(i.game!.turnDeadline).toBeTypeOf("number");
      i.game!.turnDeadline = Date.now() - 1; // fast-forward the countdown
      await i.ctx.storage.put("game", i.game);
      await i.ctx.storage.setAlarm(Date.now() - 1);
    });
    await runDurableObjectAlarm(stub);
    await runInDurableObject(stub, async (i: GameRoom) => {
      const dad = i.game!.seats.find((s) => s.color === "red")!;
      expect(dad.autoPlays).toBeGreaterThanOrEqual(1);
      expect(i.game!.rollLog.some((r) => r.auto)).toBe(true);
    });
  });

  it("wipes storage via GC when the room stays empty past the grace period", async () => {
    const room = freshRoom();
    const { a } = await seatAndStart(room);
    a.ws.close();
    await settle();
    const stub = env.GameRoom.get(env.GameRoom.idFromName(room));
    const { runDurableObjectAlarm } = await import("cloudflare:test");
    await runInDurableObject(stub, async (i: GameRoom) => {
      expect(i.gcAt).toBeTypeOf("number");
      i.gcAt = Date.now() - 1; // fast-forward the hour
      await i.ctx.storage.put("gcAt", i.gcAt);
      await i.ctx.storage.setAlarm(Date.now() - 1);
    });
    await runDurableObjectAlarm(stub);
    await runInDurableObject(stub, async (_i: GameRoom, state) => {
      expect(await state.storage.get("game")).toBeUndefined();
    });
  });
});
```

Note on the auto-play test: closing the only seated connection sets BOTH `turnDeadline` (his turn) and `gcAt` (room empty). `onAlarm` must check GC only when it is actually due AND the room is still empty, then fall through to turn handling; with `turnDeadline` forced into the past and `gcAt` an hour out, the auto-play path runs. Bot play stays paused (no `botDue`) because nobody is connected, so after the auto-play the room goes quiet. The test asserts exactly that one auto-play happened.

- [ ] **Step 2: Run DO tests to verify the new ones fail**

Run: `npm run test:do`
Expected: FAIL (`start` unhandled, no alarms).

- [ ] **Step 3: Extend src/server/index.ts**

Add imports (replace the engine import line and add the bot import):

```ts
import { applyMove, applyRoll, logEvent, mkSeat, newGame, newLobby, snapshot } from "../shared/engine";
import { chooseBotMove } from "../shared/bot";
import type { StepResult } from "../shared/engine";
import {
  AUTOPLAYS_TO_BOT, BOT_DELAY_MS, CLOSE_NOT_FOUND, CLOSE_SUPERSEDED, GC_GRACE_MS, TURN_TIMEOUT_MS,
  type ClientMsg, type GameEvent, type GameState, type ServerMsg,
} from "../shared/protocol";
```

Add the four cases to the `switch` in `onMessage`:

```ts
      case "start": return this.handleStart(conn);
      case "roll": return this.handleRoll(conn, msg);
      case "move": return this.handleMove(conn, msg);
      case "again": return this.handleAgain(conn);
```

Add the handlers and the alarm machinery to the class:

```ts
  private async handleStart(conn: Connection<ConnState>) {
    const g = this.game!;
    if (g.phase !== "lobby") return this.err(conn, "bad_intent", "The game already started.");
    if (!conn.state?.color) return this.err(conn, "bad_intent", "Join a seat first.");
    const seats = g.seats.map((s) => ({ ...s }));
    let botN = 1;
    for (const c of COLORS) {
      if (!seats.some((s) => s.color === c)) seats.push(mkSeat(c, `Bot ${botN++}`, "bot"));
    }
    for (const s of seats) {
      if (s.kind === "human") s.status = this.present(s.color) ? "connected" : "away";
    }
    this.game = newGame(seats);
    await this.commit([logEvent(this.game, { e: "turn", color: this.game.turn })]);
  }

  private async handleRoll(conn: Connection<ConnState>, msg: { turnNumber: number; actionSeq: number }) {
    const g = this.game!;
    const color = conn.state?.color;
    if (!color || g.phase !== "playing" || g.turn !== color) {
      return this.err(conn, "bad_intent", "It is not your turn.");
    }
    if (g.dice !== null) return; // already rolled; duplicate tap
    if (msg.turnNumber !== g.turnNumber || msg.actionSeq !== g.actionSeq) return; // stale resend
    g.seats.find((s) => s.color === color)!.autoPlays = 0;
    const r = applyRoll(g, this.rollDie());
    this.game = r.g;
    await this.commit(r.events);
  }

  private async handleMove(conn: Connection<ConnState>, msg: { token: number; turnNumber: number; actionSeq: number }) {
    const g = this.game!;
    const color = conn.state?.color;
    if (!color || g.phase !== "playing" || g.turn !== color) {
      return this.err(conn, "bad_intent", "It is not your turn.");
    }
    if (msg.turnNumber !== g.turnNumber || msg.actionSeq !== g.actionSeq) return; // stale resend
    g.seats.find((s) => s.color === color)!.autoPlays = 0;
    const r = applyMove(g, msg.token);
    if (!r) return this.err(conn, "bad_intent", "That token cannot move.");
    this.game = r.g;
    await this.commit(r.events);
  }

  private async handleAgain(conn: Connection<ConnState>) {
    const g = this.game!;
    if (g.phase !== "over") return this.err(conn, "bad_intent", "The game is still going.");
    if (!conn.state?.color) return this.err(conn, "bad_intent", "Only players can restart.");
    const seats = g.seats.map((s) => ({
      ...s,
      autoPlays: 0,
      status: (s.kind === "bot" || this.present(s.color) ? "connected" : "away") as Seat["status"],
    }));
    this.game = newGame(seats);
    await this.commit([logEvent(this.game, { e: "turn", color: this.game.turn })]);
  }

  // ---- dice ----

  private rollDie(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return 1 + (buf[0]! % 6); // ponytail: modulo bias is ~1e-9, irrelevant here
  }

  private rand(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! / 2 ** 32;
  }

  // ---- alarm machinery: one DO alarm multiplexes botDue, turnDeadline, gcAt ----

  private ensureTurnTimers() {
    const g = this.game;
    if (!g || g.phase !== "playing") return;
    const seat = g.seats.find((s) => s.color === g.turn)!;
    const anySeatedConn = [...this.getConnections<ConnState>()].some((c) => c.state?.color);
    if (seat.kind === "bot" || seat.status === "bot_controlled") {
      g.turnDeadline = null;
      // pause bot play while nobody is connected; onConnect -> commit resumes it
      g.botDue = anySeatedConn ? (g.botDue ?? Date.now() + BOT_DELAY_MS) : null;
    } else if (!this.present(g.turn)) {
      g.botDue = null;
      g.turnDeadline = g.turnDeadline ?? Date.now() + TURN_TIMEOUT_MS;
    } else {
      g.botDue = null;
      g.turnDeadline = null;
    }
  }

  private updateGc() {
    const anySeatedConn = [...this.getConnections<ConnState>()].some((c) => c.state?.color);
    this.gcAt = anySeatedConn ? null : this.gcAt ?? Date.now() + GC_GRACE_MS;
  }

  private async armAlarm() {
    const g = this.game;
    const cands = [g?.turnDeadline, g?.botDue, this.gcAt].filter(
      (x): x is number => typeof x === "number",
    );
    if (cands.length > 0) await this.ctx.storage.setAlarm(Math.min(...cands));
    else await this.ctx.storage.deleteAlarm();
  }

  async onAlarm() {
    const now = Date.now();
    if (this.gcAt !== null && now >= this.gcAt) {
      const anySeatedConn = [...this.getConnections<ConnState>()].some((c) => c.state?.color);
      if (!anySeatedConn) {
        await this.ctx.storage.deleteAll();
        await this.ctx.storage.deleteAlarm();
        this.game = null;
        this.secrets = {};
        this.gcAt = null;
        return;
      }
      this.gcAt = null;
    }
    const g = this.game;
    if (g && g.phase === "playing") {
      if (g.botDue !== null && now >= g.botDue) return this.playBotTurn(false);
      if (g.turnDeadline !== null && now >= g.turnDeadline) return this.playBotTurn(true);
    }
    await this.armAlarm();
  }

  // Resolve the current seat's ENTIRE turn server-side (including extra-roll
  // chains); the client animates the event list at its own pace.
  private async playBotTurn(auto: boolean) {
    let g = this.game!;
    const color = g.turn;
    g.turnDeadline = null;
    g.botDue = null;
    let flippedNow = false;
    if (auto) {
      const seat = g.seats.find((s) => s.color === color)!;
      seat.autoPlays++;
      if (seat.autoPlays >= AUTOPLAYS_TO_BOT && seat.status !== "bot_controlled") {
        seat.status = "bot_controlled";
        flippedNow = true;
      }
    }
    const events: GameEvent[] = [];
    for (let i = 0; i < 100 && g.phase === "playing" && g.turn === color; i++) {
      let r: StepResult;
      if (g.dice === null) {
        r = applyRoll(g, this.rollDie(), auto);
      } else {
        r = applyMove(g, chooseBotMove(g, () => this.rand()), auto)!;
      }
      g = r.g;
      events.push(...r.events);
    }
    if (flippedNow) events.push(logEvent(g, { e: "autotaken", color }));
    this.game = g;
    await this.commit(events);
  }
```

Replace the Task 6 `commit` with the full version:

```ts
  private async commit(events: GameEvent[], exceptId?: string) {
    this.ensureTurnTimers();
    this.updateGc();
    await this.persist();
    if (events.length > 0) {
      this.broadcast(
        JSON.stringify({ t: "update", events, state: snapshot(this.game!) } satisfies ServerMsg),
        exceptId ? [exceptId] : [],
      );
    }
    await this.armAlarm();
  }
```

Also remove the two `this.gcAt = null` / GC lines from `onConnect` and `dropped` if any remain from Task 6; `updateGc()` inside `commit` now owns that decision. Add the missing `Seat` type import to the protocol import line.

- [ ] **Step 4: Run all tests**

Run: `npm run test:unit && npm run test:do`
Expected: PASS.

- [ ] **Step 5: Play a full solo game against bots in the browser**

Run: `npm run dev`, open `http://localhost:5173`, then in devtools console:

```js
// temporary manual check until the client exists (Tasks 8-9):
const ws = new WebSocket("ws://localhost:5173/parties/game-room/DEV1?create=1&_pk=dev");
ws.onmessage = (e) => { const m = JSON.parse(e.data); console.log(m.t, m.state?.turn, m.state?.dice, m.events?.map(x => x.e)); window.last = m; };
ws.onopen = () => {};
// then step through:
ws.send(JSON.stringify({ t: "join", name: "Dev" }));
ws.send(JSON.stringify({ t: "start" }));
// roll with the current counters shown in window.last:
ws.send(JSON.stringify({ t: "roll", turnNumber: window.last.state.turnNumber, actionSeq: window.last.state.actionSeq }));
```

Expected: after each of Dev's actions, within ~1.5s per bot the three bots play automatically (update messages stream in), and the turn returns to red. This proves alarms fire in local dev.

- [ ] **Step 6: Commit**

```bash
git add LUDO/src/server/index.ts LUDO/test/do/game-room.test.ts
git commit -m "ludo: full game loop with alarm-driven bots, auto-play, and room gc"
```

---

### Task 8: Client shell: connection, identity, lobby, playable text client

**Files:**
- Create: `src/client/net.ts`, `src/client/screens.ts`
- Modify: `src/client/main.ts` (replace scaffold), `src/client/style.css` (replace)

**Interfaces:**
- Consumes: protocol types, close codes; the Task 7 server.
- Produces:
  - `net.ts`: `connect(room, create, onMsg, onStatus): Net` where `Net = { socket: PartySocket; send(m: ClientMsg): void }`; `NetStatus = "connecting" | "open" | "closed_not_found" | "closed_superseded"`; `getToken(room)`, `saveToken(room, token)`.
  - `screens.ts`: `Store` and `UI` interfaces, `render(store, ui)`, `showToast(text)`, `makeCode()`, `COLOR_HEX`. Task 9 replaces `renderGame` inside this file and adds the board experience; everything else here is final.
  - `main.ts`: routing (`/` and `/r/CODE`), the singleton `store`, socket lifecycle, digest capture on snapshot.
- Deliverable: a COMPLETE, playable (ugly) game client. Two browsers can create, join, start, roll, and move using text buttons. This proves the whole stack before any board pixels exist.

- [ ] **Step 1: Write src/client/net.ts**

```ts
import { PartySocket } from "partysocket";
import {
  CLOSE_NOT_FOUND, CLOSE_SUPERSEDED,
  type ClientMsg, type ServerMsg,
} from "../shared/protocol";

export type NetStatus = "connecting" | "open" | "closed_not_found" | "closed_superseded";

export interface Net {
  socket: PartySocket;
  send(m: ClientMsg): void;
}

const tokenKey = (room: string) => `ludo:${room}:token`;

export function getToken(room: string): string | null {
  try {
    return localStorage.getItem(tokenKey(room));
  } catch {
    return null; // some in-app browsers block storage; rejoin links still work
  }
}

export function saveToken(room: string, token: string) {
  try {
    localStorage.setItem(tokenKey(room), token);
  } catch {
    // ignore: the visible rejoin link is the durable credential
  }
}

export function connect(
  room: string,
  create: boolean,
  onMsg: (m: ServerMsg) => void,
  onStatus: (s: NetStatus) => void,
): Net {
  const socket = new PartySocket({
    host: location.host,
    party: "game-room", // kebab-case of the GameRoom DO binding
    room,
    // never queue moves while offline; we resync with a fresh snapshot instead
    maxEnqueuedMessages: 0,
    // re-evaluated on EVERY reconnect, so a token minted mid-session is picked up
    query: () => ({
      token: getToken(room) ?? undefined,
      create: create ? "1" : undefined,
    }),
    // 4xxx close codes are terminal decisions by the server, not network hiccups
    shouldReconnectOnClose: (e) => e.code < 4000,
  });

  socket.addEventListener("open", () => onStatus("open"));
  socket.addEventListener("close", (e) => {
    if (e.code === CLOSE_NOT_FOUND) onStatus("closed_not_found");
    else if (e.code === CLOSE_SUPERSEDED) onStatus("closed_superseded");
    else onStatus("connecting");
  });
  socket.addEventListener("message", (e) => {
    let m: ServerMsg;
    try {
      m = JSON.parse(e.data as string) as ServerMsg;
    } catch {
      return;
    }
    if (m.t === "snapshot" && m.token) saveToken(room, m.token);
    onMsg(m);
  });

  // screen unlocks, app switches, network flaps: reconnect or refresh the snapshot.
  // partysocket re-fires "open" on every reconnect and the server pushes a full
  // snapshot in onConnect, so a reconnect IS a resync.
  const resync = () => {
    if (document.visibilityState !== "visible") return;
    if (socket.readyState === 1 /* OPEN */) {
      socket.send(JSON.stringify({ t: "sync" } satisfies ClientMsg));
    } else {
      onStatus("connecting");
      socket.reconnect();
    }
  };
  document.addEventListener("visibilitychange", resync);
  window.addEventListener("pageshow", resync);
  window.addEventListener("focus", resync);
  window.addEventListener("online", resync);

  return { socket, send: (m) => void socket.send(JSON.stringify(m)) };
}
```

- [ ] **Step 2: Write src/client/screens.ts**

```ts
import { COLORS, type Color } from "../shared/board";
import type { ClientMsg, GameEvent, Snapshot } from "../shared/protocol";
import { getToken, type NetStatus } from "./net";

export interface Store {
  room: string | null;
  you: Color | null;
  state: Snapshot | null;
  status: NetStatus;
  lastSeenSeq: number;
  digest: GameEvent[] | null;
  spectate: boolean;
}

export interface UI {
  send(m: ClientMsg): void;
  navigate(path: string): void;
}

export const COLOR_HEX: Record<Color, string> = {
  red: "#e5484d", green: "#30a46c", yellow: "#f0b100", blue: "#3e63dd",
};

const app = document.querySelector<HTMLDivElement>("#app")!;
const NAME_KEY = "ludo:name";
// no ambiguous characters: no I/L/O/0/1
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function makeCode(): string {
  const buf = new Uint32Array(4);
  crypto.getRandomValues(buf);
  return [...buf].map((n) => CODE_ALPHABET[n % CODE_ALPHABET.length]!).join("");
}

function esc(s: string): string {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

export function showToast(text: string) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 2600);
}

export function render(store: Store, ui: UI) {
  if (!store.room) return renderHome(ui);
  if (store.status === "closed_not_found") {
    return renderMessage("Game not found", "That code does not match a running game. Codes expire about an hour after everyone leaves.", "Start a new game", () => ui.navigate("/"));
  }
  if (store.status === "closed_superseded") {
    return renderMessage("Opened somewhere else", "This game is now open in another tab or on another device.", "Take over here instead", () => location.reload());
  }
  if (!store.state) return renderConnecting(store);
  const s = store.state;
  if (s.phase === "lobby") {
    store.you ? renderLobby(store, ui) : renderJoin(store, ui);
  } else if (!store.you && !store.spectate) {
    renderPickSeat(store, ui);
  } else {
    renderGame(store, ui);
  }
  // the game screen keeps its DOM between renders, so the overlay must be
  // explicitly removed on reconnect and never duplicated while connecting
  app.querySelector(".overlay")?.remove();
  if (store.status === "connecting" && store.state) {
    app.insertAdjacentHTML("beforeend", `<div class="overlay"><div class="card slim">Reconnecting…</div></div>`);
  }
}

function renderConnecting(store: Store) {
  app.innerHTML = `<main class="card"><h1>Room ${esc(store.room!)}</h1><p class="sub">Connecting…</p></main>`;
}

function renderMessage(title: string, body: string, action: string, onAction: () => void) {
  app.innerHTML = `
    <main class="card">
      <h1>${esc(title)}</h1>
      <p class="sub">${esc(body)}</p>
      <button id="action" class="primary">${esc(action)}</button>
    </main>`;
  app.querySelector("#action")!.addEventListener("click", onAction);
}

function renderHome(ui: UI) {
  const savedName = localStorage.getItem(NAME_KEY) ?? "";
  app.innerHTML = `
    <main class="card">
      <h1>Family Ludo</h1>
      <p class="sub">No ads. No limits. Just Ludo.</p>
      <label>Your name
        <input id="name" maxlength="16" placeholder="e.g. Dad" value="${esc(savedName)}" />
      </label>
      <button id="new" class="primary">New game</button>
      <div class="divider">or join with a code</div>
      <form id="joinform">
        <input id="code" maxlength="4" placeholder="CODE" autocapitalize="characters" autocomplete="off" />
        <button class="secondary">Join</button>
      </form>
    </main>`;
  const name = app.querySelector<HTMLInputElement>("#name")!;
  const remember = () => localStorage.setItem(NAME_KEY, name.value.trim());
  app.querySelector("#new")!.addEventListener("click", () => {
    remember();
    const code = makeCode();
    sessionStorage.setItem(`ludo:${code}:create`, "1");
    ui.navigate(`/r/${code}`);
  });
  app.querySelector("#joinform")!.addEventListener("submit", (e) => {
    e.preventDefault();
    remember();
    const code = app.querySelector<HTMLInputElement>("#code")!.value.trim().toUpperCase();
    if (code.length === 4) ui.navigate(`/r/${code}`);
  });
}

function renderJoin(store: Store, ui: UI) {
  const savedName = localStorage.getItem(NAME_KEY) ?? "";
  app.innerHTML = `
    <main class="card">
      <h1>Room ${esc(store.room!)}</h1>
      <p class="sub">Pick a name to take a seat.</p>
      <form id="seatform">
        <label>Your name
          <input id="name" maxlength="16" placeholder="e.g. Mom" value="${esc(savedName)}" />
        </label>
        <button class="primary">Take a seat</button>
      </form>
    </main>`;
  app.querySelector("#seatform")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = app.querySelector<HTMLInputElement>("#name")!.value.trim();
    if (!name) return;
    localStorage.setItem(NAME_KEY, name);
    ui.send({ t: "join", name });
  });
}

function renderLobby(store: Store, ui: UI) {
  const s = store.state!;
  const seatRows = COLORS.map((c) => {
    const seat = s.seats.find((x) => x.color === c);
    const label = seat
      ? `${esc(seat.name)}${seat.color === store.you ? " (you)" : ""}${seat.status === "away" ? " · away" : ""}`
      : `<span class="muted">Computer player</span>`;
    return `<li class="${seat ? "filled" : "empty"}"><span class="dot" style="background:${COLOR_HEX[c]}"></span>${label}</li>`;
  }).join("");
  app.innerHTML = `
    <main class="card">
      <h1>Room <span class="code">${esc(store.room!)}</span></h1>
      <p class="sub">Share this code on WhatsApp so others can join. Empty seats get a computer player.</p>
      <ul class="seats">${seatRows}</ul>
      <button id="start" class="primary">Start game</button>
      <button id="copylink" class="secondary">Copy my rejoin link</button>
      <p class="hint">Keep your rejoin link in the family chat. It brings you back to your seat if your phone dies or you switch devices.</p>
    </main>`;
  app.querySelector("#start")!.addEventListener("click", () => ui.send({ t: "start" }));
  app.querySelector("#copylink")!.addEventListener("click", () => copyRejoinLink(store));
}

export async function copyRejoinLink(store: Store) {
  const token = getToken(store.room!);
  const link = `${location.origin}/r/${store.room}${token ? `#p=${token}` : ""}`;
  try {
    await navigator.clipboard.writeText(link);
    showToast("Rejoin link copied. Paste it in the family chat.");
  } catch {
    prompt("Copy your rejoin link:", link);
  }
}

function renderPickSeat(store: Store, ui: UI) {
  const s = store.state!;
  const rows = s.seats
    .filter((seat) => seat.kind === "human")
    .map((seat) => {
      const free = seat.status !== "connected";
      return `<li><span class="dot" style="background:${COLOR_HEX[seat.color]}"></span>
        ${free
          ? `<button class="secondary claim" data-color="${seat.color}">That's me, rejoin as ${esc(seat.name)}</button>`
          : `${esc(seat.name)} <span class="muted">connected</span>`}
      </li>`;
    }).join("");
  app.innerHTML = `
    <main class="card">
      <h1>Room ${esc(store.room!)}</h1>
      <p class="sub">This game is running. Is one of these seats yours?</p>
      <ul class="seats">${rows}</ul>
      <button id="spectate" class="secondary">Just watch</button>
    </main>`;
  app.querySelectorAll<HTMLButtonElement>(".claim").forEach((b) =>
    b.addEventListener("click", () => ui.send({ t: "claim", color: b.dataset.color as Color })),
  );
  app.querySelector("#spectate")!.addEventListener("click", () => {
    store.spectate = true;
    render(store, ui);
  });
}

// Task 8 version: a plain but fully playable text client.
// Task 9 replaces this function with the SVG board experience.
function renderGame(store: Store, ui: UI) {
  const s = store.state!;
  const rows = s.seats.map((seat) => {
    const toks = s.tokens[seat.color]!
      .map((p) => (p === -1 ? "base" : p === 56 ? "home" : `at ${p}`))
      .join(", ");
    const marks = [
      seat.color === s.turn && s.phase === "playing" ? "◀ turn" : "",
      seat.status === "away" ? "· away" : "",
      seat.status === "bot_controlled" ? "· bot playing" : "",
    ].join(" ");
    return `<li><span class="dot" style="background:${COLOR_HEX[seat.color]}"></span>${esc(seat.name)}: ${toks} ${marks}</li>`;
  }).join("");
  const myTurn = store.you === s.turn && s.phase === "playing";
  app.innerHTML = `
    <main class="card">
      <h1>Room ${esc(store.room!)}</h1>
      <ul class="seats">${rows}</ul>
      <p>Die: ${s.dice ?? "not rolled"}</p>
      ${s.phase === "over" ? `<p>Winner: ${esc(s.seats.find((x) => x.color === s.finishOrder[0])?.name ?? "?")}</p><button id="again" class="primary">Play again</button>` : ""}
      ${myTurn && s.dice === null ? `<button id="roll" class="primary">Roll</button>` : ""}
      ${myTurn && s.dice !== null ? s.movable.map((i) => `<button class="secondary mv" data-i="${i}">Move token ${i + 1}</button>`).join(" ") : ""}
      ${s.turnDeadline ? `<p class="hint">Waiting for ${esc(s.seats.find((x) => x.color === s.turn)?.name ?? "")}. The computer moves for them soon.</p>` : ""}
    </main>`;
  app.querySelector("#roll")?.addEventListener("click", () =>
    ui.send({ t: "roll", turnNumber: s.turnNumber, actionSeq: s.actionSeq }),
  );
  app.querySelectorAll<HTMLButtonElement>(".mv").forEach((b) =>
    b.addEventListener("click", () =>
      ui.send({ t: "move", token: Number(b.dataset.i), turnNumber: s.turnNumber, actionSeq: s.actionSeq }),
    ),
  );
  app.querySelector("#again")?.addEventListener("click", () => ui.send({ t: "again" }));
}
```

- [ ] **Step 3: Replace src/client/main.ts**

```ts
import "./style.css";
import type { ServerMsg } from "../shared/protocol";
import { connect, saveToken, type Net } from "./net";
import { render, showToast, type Store, type UI } from "./screens";

const store: Store = {
  room: null, you: null, state: null,
  status: "connecting", lastSeenSeq: 0, digest: null, spectate: false,
};

let net: Net | null = null;

const ui: UI = {
  send: (m) => net?.send(m),
  navigate(path: string) {
    history.pushState(null, "", path);
    route();
  },
};

function route() {
  const m = location.pathname.match(/^\/r\/([A-Za-z0-9]{4,8})$/);
  if (m) enterRoom(m[1]!.toUpperCase());
  else {
    net?.socket.close();
    net = null;
    store.room = null;
    store.state = null;
    store.you = null;
    render(store, ui);
  }
}

function enterRoom(room: string) {
  if (store.room === room && net) return;
  net?.socket.close();
  store.room = room;
  store.you = null;
  store.state = null;
  store.lastSeenSeq = 0;
  store.digest = null;
  store.spectate = false;
  store.status = "connecting";
  // rejoin link support: /r/CODE#p=TOKEN
  const hp = location.hash.match(/^#p=([\w-]+)$/);
  if (hp) {
    saveToken(room, hp[1]!);
    history.replaceState(null, "", `/r/${room}`);
  }
  const create = sessionStorage.getItem(`ludo:${room}:create`) === "1";
  net = connect(room, create, onServerMsg, (s) => {
    store.status = s;
    render(store, ui);
  });
  render(store, ui);
}

function onServerMsg(m: ServerMsg) {
  if (m.t === "snapshot") {
    const prevSeq = store.lastSeenSeq;
    // while-you-were-away digest: anything logged since we last looked
    const missed = m.state.eventLog.filter((x) => x.seq > prevSeq).map((x) => x.ev);
    if (prevSeq > 0 && missed.length > 0) store.digest = missed;
    store.state = m.state;
    store.you = m.you;
    store.lastSeenSeq = m.state.actionSeq;
    render(store, ui);
  } else if (m.t === "update") {
    // Task 9 routes this through the animation queue; for now, jump to the result
    store.state = m.state;
    store.lastSeenSeq = m.state.actionSeq;
    render(store, ui);
  } else if (m.t === "err") {
    showToast(m.msg);
    render(store, ui);
  }
}

window.addEventListener("popstate", route);
route();
```

- [ ] **Step 4: Replace src/client/style.css**

```css
:root {
  --bg: #14181f;
  --card: #1d232c;
  --ink: #e8eaed;
  --muted: #98a1ad;
  --line: #2c3440;
  --accent: #3e63dd;
}
* { box-sizing: border-box; margin: 0; -webkit-tap-highlight-color: transparent; }
html, body { height: 100%; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--ink);
  overscroll-behavior: none; /* no pull-to-refresh mid-game */
  touch-action: manipulation; /* no double-tap zoom */
  user-select: none;
  -webkit-user-select: none;
}
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom));
}
.card {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card.slim { width: auto; margin: 0; }
h1 { font-size: 1.4rem; }
.code { letter-spacing: 0.15em; }
.sub, .hint, .muted { color: var(--muted); font-size: 0.9rem; }
label { display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; color: var(--muted); }
input {
  font-size: 1.1rem;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--ink);
  width: 100%;
}
button {
  font: inherit;
  font-size: 1.05rem;
  min-height: 48px;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}
.primary { background: var(--accent); color: #fff; font-weight: 600; }
.secondary { background: var(--line); color: var(--ink); }
button:disabled { opacity: 0.45; }
.divider { text-align: center; color: var(--muted); font-size: 0.85rem; }
#joinform { display: flex; gap: 8px; }
#joinform input { text-transform: uppercase; letter-spacing: 0.2em; text-align: center; }
#seatform { display: flex; flex-direction: column; gap: 12px; }
.seats { list-style: none; display: flex; flex-direction: column; gap: 8px; padding: 0; }
.seats li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg);
  border-radius: 10px;
  min-height: 48px;
}
.seats li.empty { color: var(--muted); }
.seats .claim { flex: 1; }
.dot { width: 14px; height: 14px; border-radius: 50%; flex: none; }
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #000c;
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  z-index: 50;
  max-width: 90vw;
}
.overlay {
  position: fixed;
  inset: 0;
  background: #000a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}
```

- [ ] **Step 5: Type-check and build**

Run: `npm run check`
Expected: clean.

- [ ] **Step 6: Two-browser manual verification**

Run: `npm run dev`, then:

1. Browser tab A: open `http://localhost:5173`, enter name "Dad", tap New game. Expect the lobby with the room code and Dad seated red.
2. Tab B (private/incognito window so storage is separate): open `http://localhost:5173`, enter name "Mom", join with the code. Expect Mom seated green in BOTH tabs.
3. Tab A: tap "Copy my rejoin link"; expect a toast.
4. Tab A: Start game. Expect both tabs to show the text game screen, 2 bots seated, red's turn.
5. Play a few turns from both tabs (Roll, then Move buttons). Expect bots to play automatically between human turns.
6. Close tab B entirely, reopen `http://localhost:5173/r/<CODE>` in a fresh private window WITHOUT the token. Expect the "Is one of these seats yours?" screen; claim Mom's seat; expect play to continue.
7. Paste tab A's copied rejoin link into a THIRD window. Expect the first tab A to show "Opened somewhere else" and the new window to control Dad's seat.

- [ ] **Step 7: Commit**

```bash
git add LUDO/src/client/
git commit -m "ludo: playable client shell with lobby, rejoin links, seat claim"
```

---

### Task 9: Board, animations, and the full game screen

**Files:**
- Create: `src/client/board.ts`
- Modify: `src/client/screens.ts` (replace `renderGame`, add game-screen functions, move `COLOR_HEX`), `src/client/main.ts` (route updates through the animation queue), `src/client/style.css` (append board styles)

**Interfaces:**
- Consumes: everything from Task 8; `cellOf`, `PATH`, `HOME_COL`, `BASE_ORIGIN`, `START`, `SAFE`, board constants from `../shared/board`.
- Produces:
  - `board.ts`: `COLOR_HEX` (moves here from screens.ts), `buildBoard(mount, onCellTap, onTokenTap): SVGSVGElement`, `layoutTokens(svg, snap, movable, you, selected)`, `showTarget(svg, cell | null)`.
  - `screens.ts`: new `renderGame(store, ui)` (stable DOM, updates in place), `applyUpdate(store, ui, events, state): void` (animation queue), plus dice display, countdown, roll-log drawer, digest modal, picker sheet, game-over overlay.
  - `main.ts`: the `update` branch calls `applyUpdate(store, ui, m.events, m.state)`.
- Input rules implemented here (from spec section 8): after a roll only legally movable tokens are highlighted and tappable; moving requires a second tap on the destination ring; a stack of movable own tokens opens a picker sheet; the roll button locks synchronously and a dice tumble runs until the server result arrives.
- Note on the spec's 44px token targets: a 15-column board on a 375px phone gives ~25px cells, so 44px per token is geometrically impossible. Compensation (per the same spec goal, no lost moves): full-cell hit areas, movable-only tap filtering, and the mandatory destination-confirm tap.

- [ ] **Step 1: Write src/client/board.ts**

```ts
import {
  BASE, BASE_ORIGIN, COLORS, HOME, HOME_COL, PATH, SAFE, START, cellOf, type Color,
} from "../shared/board";
import type { Snapshot } from "../shared/protocol";

export const COLOR_HEX: Record<Color, string> = {
  red: "#e5484d", green: "#30a46c", yellow: "#f0b100", blue: "#3e63dd",
};

const NS = "http://www.w3.org/2000/svg";

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

const BASE_SPOTS: [number, number][] = [[2, 2], [4, 2], [2, 4], [4, 4]];
// where finished tokens nest inside the center, per color
const HOME_NEST: Record<Color, [number, number]> = {
  red: [6.55, 7.5], green: [7.5, 6.55], yellow: [8.45, 7.5], blue: [7.5, 8.45],
};

export function buildBoard(
  mount: HTMLElement,
  onCellTap: (col: number, row: number) => void,
  onTokenTap: (color: Color, idx: number) => void,
): SVGSVGElement {
  const svg = el("svg", { viewBox: "0 0 15 15", class: "board" });

  for (const color of COLORS) {
    const [bx, by] = BASE_ORIGIN[color];
    svg.append(el("rect", { x: bx, y: by, width: 6, height: 6, rx: 0.4, fill: COLOR_HEX[color] }));
    svg.append(el("rect", { x: bx + 1, y: by + 1, width: 4, height: 4, rx: 0.3, fill: "#f8fafc" }));
    for (const [sx, sy] of BASE_SPOTS) {
      svg.append(el("circle", {
        cx: bx + sx, cy: by + sy, r: 0.42,
        fill: "none", stroke: COLOR_HEX[color], "stroke-width": 0.08,
      }));
    }
  }

  PATH.forEach(([c, r], abs) => {
    const startColor = COLORS.find((col) => START[col] === abs);
    svg.append(el("rect", {
      x: c + 0.03, y: r + 0.03, width: 0.94, height: 0.94, rx: 0.12,
      fill: startColor ? COLOR_HEX[startColor] : "#f8fafc",
      stroke: "#c8ccd4", "stroke-width": 0.03,
      class: "cell", "data-col": c, "data-row": r,
    }));
    if (SAFE.has(abs) && !startColor) {
      const star = el("text", {
        x: c + 0.5, y: r + 0.73, "text-anchor": "middle",
        "font-size": 0.62, fill: "#b6bcc6", "pointer-events": "none",
      });
      star.textContent = "★";
      svg.append(star);
    }
  });

  for (const color of COLORS) {
    for (const [c, r] of HOME_COL[color]) {
      svg.append(el("rect", {
        x: c + 0.03, y: r + 0.03, width: 0.94, height: 0.94, rx: 0.12,
        fill: COLOR_HEX[color], opacity: 0.85,
        stroke: "#c8ccd4", "stroke-width": 0.03,
        class: "cell", "data-col": c, "data-row": r,
      }));
    }
  }

  const tri: Record<Color, string> = {
    red: "6,6 6,9 7.5,7.5",
    green: "6,6 9,6 7.5,7.5",
    yellow: "9,6 9,9 7.5,7.5",
    blue: "6,9 9,9 7.5,7.5",
  };
  for (const color of COLORS) svg.append(el("polygon", { points: tri[color], fill: COLOR_HEX[color] }));

  svg.append(el("g", { id: "targets" }));
  const tokens = el("g", { id: "tokens" });
  svg.append(tokens);

  for (const color of COLORS) {
    for (let idx = 0; idx < 4; idx++) {
      const g = el("g", { class: "token", "data-color": color, "data-idx": idx });
      g.append(el("circle", { r: 0.36, fill: COLOR_HEX[color], stroke: "#fff", "stroke-width": 0.07 }));
      g.append(el("circle", { r: 0.16, fill: "#fff", opacity: 0.35 }));
      // full-cell invisible hit area (see 44px note above)
      g.append(el("circle", { r: 0.52, fill: "transparent" }));
      tokens.append(g);
    }
  }

  svg.addEventListener("click", (e) => {
    const t = e.target as Element;
    const tok = t.closest<SVGGElement>(".token");
    if (tok && tok.style.display !== "none") {
      onTokenTap(tok.dataset.color as Color, Number(tok.dataset.idx));
      return;
    }
    const cell = t.closest<SVGRectElement>(".cell");
    if (cell) onCellTap(Number(cell.dataset.col), Number(cell.dataset.row));
  });

  mount.append(svg);
  return svg;
}

// visual position of one token, including stack spreading
function positionOf(snap: Snapshot, color: Color, idx: number): { x: number; y: number; scale: number } {
  const p = snap.tokens[color]![idx]!;
  if (p === BASE) {
    const [bx, by] = BASE_ORIGIN[color];
    const [sx, sy] = BASE_SPOTS[idx]!;
    return { x: bx + sx, y: by + sy, scale: 1 };
  }
  if (p === HOME) {
    const [nx, ny] = HOME_NEST[color];
    return { x: nx + ((idx % 2) - 0.5) * 0.3, y: ny + (Math.floor(idx / 2) - 0.5) * 0.3, scale: 0.6 };
  }
  const [c, r] = cellOf(color, p)!;
  // stack detection: every token (any color) on this same grid cell
  const mates: [Color, number][] = [];
  for (const col of COLORS) {
    (snap.tokens[col] ?? []).forEach((q, i) => {
      const cc = q === BASE || q === HOME ? null : cellOf(col, q);
      if (cc && cc[0] === c && cc[1] === r) mates.push([col, i]);
    });
  }
  if (mates.length <= 1) return { x: c + 0.5, y: r + 0.5, scale: 1 };
  const k = mates.findIndex(([mc, mi]) => mc === color && mi === idx);
  const OFF: [number, number][] = [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]];
  const [ox, oy] = OFF[k % 4]!;
  return { x: c + 0.5 + ox, y: r + 0.5 + oy, scale: 0.72 };
}

export function layoutTokens(
  svg: SVGSVGElement,
  snap: Snapshot,
  movable: Set<number>, // token indices of the viewer's own movable tokens
  you: Color | null,
  selected: number | null,
) {
  for (const g of svg.querySelectorAll<SVGGElement>(".token")) {
    const color = g.dataset.color as Color;
    const idx = Number(g.dataset.idx);
    if (!snap.tokens[color]) {
      g.style.display = "none";
      continue;
    }
    g.style.display = "";
    const { x, y, scale } = positionOf(snap, color, idx);
    g.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    g.classList.toggle("movable", you === color && movable.has(idx));
    g.classList.toggle("selected", you === color && selected === idx);
  }
}

export function showTarget(svg: SVGSVGElement, cell: [number, number] | null) {
  const layer = svg.querySelector("#targets")!;
  layer.innerHTML = "";
  if (!cell) return;
  layer.append(el("circle", {
    cx: cell[0] + 0.5, cy: cell[1] + 0.5, r: 0.44,
    class: "target", fill: "none", stroke: "#fff", "stroke-width": 0.09,
    "pointer-events": "none",
  }));
}
```

- [ ] **Step 2: Update screens.ts for the board experience**

(a) Delete the `export const COLOR_HEX = { ... }` block from `screens.ts` and add to its imports:

```ts
import { BASE, COLORS, HOME, cellOf, type Color } from "../shared/board";
import { COLOR_HEX, buildBoard, layoutTokens, showTarget } from "./board";
```

(this REPLACES the old board import line; `tsconfig` has `noUnusedLocals`, so import exactly what the file uses and nothing more).

(b) Replace the Task 8 `renderGame` function entirely with the following block of functions, appended state, and helpers:

```ts
// ---- game screen (stable DOM, updated in place so CSS transitions run) ----

let sel: number | null = null; // selected own token index awaiting destination confirm
let lastUi: UI | null = null;
let lastStore: Store | null = null;
let countdownTimer: number | undefined;

function seatName(s: Snapshot, color: Color): string {
  return s.seats.find((x) => x.color === color)?.name ?? color;
}

function renderGame(store: Store, ui: UI) {
  lastUi = ui;
  lastStore = store;
  const s = store.state!;
  if (!document.getElementById("gamewrap")) {
    app.innerHTML = `
      <div id="gamewrap">
        <header id="topbar">
          <span class="code">${esc(store.room!)}</span>
          <span id="seatsbar"></span>
          <span id="actions">
            <button id="loglink" class="chip" title="Dice history">🎲</button>
            <button id="linklink" class="chip" title="Copy rejoin link">🔗</button>
          </span>
        </header>
        <div id="banner" hidden></div>
        <div id="boardmount"></div>
        <footer id="controls">
          <div id="dice">·</div>
          <div id="status"></div>
          <button id="roll" class="primary" hidden>Roll</button>
        </footer>
        <div id="sheet" hidden></div>
        <div id="modal" hidden></div>
      </div>`;
    buildBoard(document.getElementById("boardmount")!, onCellTap, onTokenTap);
    document.getElementById("loglink")!.addEventListener("click", showRollLog);
    document.getElementById("linklink")!.addEventListener("click", () => copyRejoinLink(store));
    document.getElementById("roll")!.addEventListener("click", onRollTap);
    clearInterval(countdownTimer);
    countdownTimer = window.setInterval(tickCountdown, 500);
  }
  updateGame(s);
  if (store.digest) showDigest(store.digest, s);
}

function updateGame(s: Snapshot) {
  const store = lastStore!;
  const svg = document.querySelector<SVGSVGElement>("#boardmount svg")!;
  const movable = new Set(store.you === s.turn ? s.movable : []);
  if (sel !== null && !movable.has(sel)) sel = null;
  layoutTokens(svg, s, movable, store.you, sel);
  showTarget(svg, sel !== null ? targetCell(s, sel) : null);

  // seats bar
  document.getElementById("seatsbar")!.innerHTML = s.seats.map((seat) => {
    const cls = [
      "seat",
      seat.color === s.turn && s.phase === "playing" ? "turn" : "",
      seat.status !== "connected" ? "off" : "",
    ].join(" ");
    const suffix = seat.status === "bot_controlled" ? "🤖" : seat.status === "away" ? "…" : "";
    return `<span class="${cls}" style="--c:${COLOR_HEX[seat.color]}">${esc(seat.name)}${suffix}</span>`;
  }).join("");

  // dice + status + roll button
  const dice = document.getElementById("dice")!;
  if (!dice.classList.contains("tumbling")) dice.textContent = s.dice ? DIE[s.dice]! : "·";
  const myTurn = store.you === s.turn && s.phase === "playing";
  const roll = document.getElementById("roll") as HTMLButtonElement;
  roll.hidden = !(myTurn && s.dice === null);
  roll.disabled = false;
  const status = document.getElementById("status")!;
  if (s.phase === "over") status.textContent = "Game over";
  else if (myTurn) status.textContent = s.dice === null ? "Your turn" : "Pick a token to move";
  else status.textContent = `${seatName(s, s.turn)}'s turn`;

  tickCountdown();
  const modal = document.getElementById("modal")!;
  if (s.phase === "over") {
    showGameOver(s);
  } else if (modal.dataset.over === "1") {
    // someone else tapped Play again; drop the stale game-over overlay
    modal.dataset.over = "";
    modal.hidden = true;
  }
}

const DIE = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function targetCell(s: Snapshot, token: number): [number, number] | null {
  const you = lastStore!.you!;
  const from = s.tokens[you]![token]!;
  const to = from === BASE ? 0 : from + (s.dice ?? 0);
  return cellOf(you, to);
}

function onRollTap() {
  const s = lastStore!.state!;
  const roll = document.getElementById("roll") as HTMLButtonElement;
  roll.disabled = true; // synchronous lock against double taps
  startTumble();
  lastUi!.send({ t: "roll", turnNumber: s.turnNumber, actionSeq: s.actionSeq });
}

let tumbleTimer: number | undefined;
function startTumble() {
  const dice = document.getElementById("dice")!;
  dice.classList.add("tumbling");
  clearInterval(tumbleTimer);
  tumbleTimer = window.setInterval(() => {
    dice.textContent = DIE[1 + Math.floor(Math.random() * 6)]!;
  }, 80);
  // safety: never tumble forever if the server errors
  setTimeout(stopTumble, 3000);
}
function stopTumble() {
  clearInterval(tumbleTimer);
  document.getElementById("dice")?.classList.remove("tumbling");
}

function onTokenTap(color: Color, idx: number) {
  const store = lastStore!;
  const s = store.state!;
  if (store.you !== s.turn || s.dice === null || s.phase !== "playing") return;
  // confirm tap: a token standing on the selected token's destination (a capture
  // target or a stack) covers the whole cell with its hit area, so a tap on it
  // must count as tapping the destination ring
  if (sel !== null) {
    const target = targetCell(s, sel);
    const tapped = cellOf(color, s.tokens[color]![idx]!);
    if (target && tapped && target[0] === tapped[0] && target[1] === tapped[1]) {
      lastUi!.send({ t: "move", token: sel, turnNumber: s.turnNumber, actionSeq: s.actionSeq });
      sel = null;
      updateGame(s);
      return;
    }
  }
  if (color !== store.you) return;
  const cell = cellOf(color, s.tokens[color]![idx]!);
  // all movable tokens sharing the tapped token's cell (base tokens share none)
  const mates = s.movable.filter((i) => {
    if (i === idx) return true;
    const c2 = cellOf(color, s.tokens[color]![i]!);
    return !!cell && !!c2 && c2[0] === cell[0] && c2[1] === cell[1];
  });
  if (mates.length === 0) return;
  if (mates.length > 1) return showPicker(mates, s);
  sel = mates[0]!;
  updateGame(s);
}

function onCellTap(col: number, row: number) {
  const s = lastStore!.state!;
  if (sel === null) return;
  const target = targetCell(s, sel);
  if (target && target[0] === col && target[1] === row) {
    lastUi!.send({ t: "move", token: sel, turnNumber: s.turnNumber, actionSeq: s.actionSeq });
  }
  sel = null;
  updateGame(s);
}

function showPicker(tokens: number[], s: Snapshot) {
  const you = lastStore!.you!;
  const sheet = document.getElementById("sheet")!;
  sheet.hidden = false;
  sheet.innerHTML = `<div class="sheetcard">
    <p class="sub">Two of your tokens are here. Which one moves?</p>
    ${tokens.map((i) => {
      const p = s.tokens[you]![i]!;
      const steps = p === BASE ? "from the base" : `${HOME - p} steps from home`;
      return `<button class="secondary pick" data-i="${i}">Move the one ${steps}</button>`;
    }).join("")}
    <button class="secondary" id="pickcancel">Cancel</button>
  </div>`;
  sheet.querySelectorAll<HTMLButtonElement>(".pick").forEach((b) =>
    b.addEventListener("click", () => {
      sel = Number(b.dataset.i);
      sheet.hidden = true;
      updateGame(lastStore!.state!);
    }),
  );
  sheet.querySelector("#pickcancel")!.addEventListener("click", () => (sheet.hidden = true));
}

function tickCountdown() {
  const s = lastStore?.state;
  const banner = document.getElementById("banner");
  if (!s || !banner) return;
  if (s.phase === "playing" && s.turnDeadline) {
    const left = Math.max(0, Math.ceil((s.turnDeadline - Date.now()) / 1000));
    banner.hidden = false;
    banner.textContent = `Waiting for ${seatName(s, s.turn)}. Auto-move in ${left}s`;
  } else if (s.phase === "playing" && s.botDue && s.seats.find((x) => x.color === s.turn)?.status === "bot_controlled") {
    banner.hidden = false;
    banner.textContent = `The computer is playing for ${seatName(s, s.turn)}`;
  } else {
    banner.hidden = true;
  }
}

function showRollLog() {
  const s = lastStore!.state!;
  const modal = document.getElementById("modal")!;
  const rows = [...s.rollLog].slice(-30).reverse().map((r) =>
    `<li><span class="dot" style="background:${COLOR_HEX[r.color]}"></span>${esc(seatName(s, r.color))} rolled ${r.value}${r.auto ? " (auto)" : ""}</li>`,
  ).join("");
  modal.hidden = false;
  modal.innerHTML = `<div class="card slim modalcard">
    <h1>Dice history</h1>
    <ul class="seats loglist">${rows || "<li>No rolls yet</li>"}</ul>
    <button class="secondary" id="modalclose">Close</button>
  </div>`;
  modal.querySelector("#modalclose")!.addEventListener("click", () => (modal.hidden = true));
}

function describeEvent(ev: GameEvent, s: Snapshot): string | null {
  switch (ev.e) {
    case "roll": return `${seatName(s, ev.color)} rolled ${ev.value}${ev.auto ? " (auto)" : ""}`;
    case "capture": return `${seatName(s, ev.by)} captured ${seatName(s, ev.victim)}'s token`;
    case "home": return `${seatName(s, ev.color)} got a token home`;
    case "forfeit": return `${seatName(s, ev.color)} lost the turn (three sixes)`;
    case "finish": return `${seatName(s, ev.color)} finished in place ${ev.place}`;
    case "autotaken": return `${seatName(s, ev.color)}'s seat is now played by the computer`;
    case "over": return "Game over";
    case "seat":
      // the spec's "X rejoined as Mom" announcement, and its counterpart
      if (ev.status === "connected") return `${ev.name} is back`;
      if (ev.status === "away") return `${ev.name} lost connection`;
      return null;
    default: return null;
  }
}

function showDigest(events: GameEvent[], s: Snapshot) {
  lastStore!.digest = null;
  const lines = events.map((ev) => describeEvent(ev, s)).filter(Boolean).slice(-12) as string[];
  if (lines.length === 0) return;
  const modal = document.getElementById("modal")!;
  modal.hidden = false;
  modal.innerHTML = `<div class="card slim modalcard">
    <h1>While you were away</h1>
    <ul class="seats loglist">${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
    <button class="primary" id="modalclose">Back to the game</button>
  </div>`;
  modal.querySelector("#modalclose")!.addEventListener("click", () => (modal.hidden = true));
}

function showGameOver(s: Snapshot) {
  const modal = document.getElementById("modal")!;
  if (modal.dataset.over === "1") return; // already shown
  modal.dataset.over = "1";
  modal.hidden = false;
  const medals = ["🥇", "🥈", "🥉", ""];
  modal.innerHTML = `<div class="card slim modalcard">
    <h1>Game over</h1>
    <ul class="seats">${s.finishOrder.map((c, i) =>
      `<li><span class="dot" style="background:${COLOR_HEX[c]}"></span>${medals[i] ?? ""} ${esc(seatName(s, c))}</li>`,
    ).join("")}</ul>
    <button class="primary" id="again">Play again</button>
    <button class="secondary" id="gohome">Leave</button>
  </div>`;
  modal.querySelector("#again")!.addEventListener("click", () => {
    modal.dataset.over = "";
    modal.hidden = true;
    lastUi!.send({ t: "again" });
  });
  modal.querySelector("#gohome")!.addEventListener("click", () => lastUi!.navigate("/"));
}

// ---- animation queue: play server event lists at a human pace ----

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let animating = false;
const animQueue: { events: GameEvent[]; state: Snapshot }[] = [];

export function applyUpdate(store: Store, ui: UI, events: GameEvent[], state: Snapshot) {
  const boardUp = !!document.getElementById("gamewrap") && store.state?.phase !== "lobby";
  if (!boardUp || events.length === 0) {
    store.state = state;
    store.lastSeenSeq = state.actionSeq;
    render(store, ui);
    return;
  }
  animQueue.push({ events, state });
  if (!animating) void drainAnimations(store, ui);
}

async function drainAnimations(store: Store, ui: UI) {
  animating = true;
  while (animQueue.length > 0) {
    const { events, state } = animQueue.shift()!;
    // visual working copy: replay events on top of the previous state
    const visual = structuredClone(store.state!) as Snapshot;
    const svg = document.querySelector<SVGSVGElement>("#boardmount svg");
    for (const ev of events) {
      if (!svg) break;
      if (ev.e === "roll") {
        stopTumble();
        const dice = document.getElementById("dice")!;
        dice.textContent = DIE[ev.value]!;
        document.getElementById("status")!.textContent =
          `${seatName(visual, ev.color)} rolled ${ev.value}${ev.auto ? " (auto)" : ""}`;
        await sleep(650);
      } else if (ev.e === "move") {
        visual.tokens[ev.color]![ev.token] = ev.to;
        layoutTokens(svg, visual, new Set(), store.you, null);
        await sleep(380);
      } else if (ev.e === "capture") {
        visual.tokens[ev.victim]![ev.token] = BASE;
        layoutTokens(svg, visual, new Set(), store.you, null);
        await sleep(380);
      } else if (ev.e === "home" || ev.e === "finish" || ev.e === "forfeit" || ev.e === "autotaken" || ev.e === "seat") {
        const line = describeEvent(ev, visual);
        if (line) showToast(line);
        if (ev.e !== "seat") await sleep(400);
      }
    }
    // a resync snapshot may have landed mid-animation; never regress to older state
    if (state.actionSeq >= store.lastSeenSeq) {
      store.state = state;
      store.lastSeenSeq = state.actionSeq;
      render(store, ui);
    }
  }
  animating = false;
}
```

Also make `renderGame`'s replacement compile: `screens.ts` now needs `GameEvent` and `Snapshot` in its protocol type import (both were already imported in Task 8; verify the import line reads `import type { ClientMsg, GameEvent, Snapshot } from "../shared/protocol";`).

(c) In `main.ts`, add `applyUpdate` to the screens import and replace the `update` branch of `onServerMsg`:

```ts
  } else if (m.t === "update") {
    applyUpdate(store, ui, m.events, m.state);
  } else if (m.t === "err") {
```

(d) One lobby-screen wire: when a snapshot arrives while the game screen DOM exists but the phase went back to `lobby` (play again from another player is impossible since `again` starts a fresh game immediately, but a late joiner may see it), `render` already rebuilds via `app.innerHTML` in the lobby branch. No change needed; noted so nobody "fixes" it.

- [ ] **Step 3: Append board styles to style.css**

```css
#gamewrap { width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
#topbar { display: flex; align-items: center; gap: 8px; padding-top: 4px; }
#topbar .code { color: var(--muted); letter-spacing: 0.12em; font-size: 0.85rem; }
#seatsbar { flex: 1; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.seat {
  font-size: 0.8rem;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--card);
  border: 2px solid var(--c);
}
.seat.turn { background: var(--c); color: #fff; font-weight: 600; }
.seat.off { opacity: 0.55; }
.chip { min-height: 36px; min-width: 44px; padding: 4px 8px; background: var(--card); border-radius: 10px; font-size: 1rem; }
#banner {
  text-align: center;
  background: #7c2d12;
  color: #fed7aa;
  border-radius: 10px;
  padding: 8px;
  font-size: 0.9rem;
}
.board { width: 100%; height: auto; display: block; border-radius: 12px; background: #dfe3e8; }
.token { transition: transform 0.35s ease; cursor: pointer; }
.token.movable circle:first-child { stroke: #fff; animation: pulse 1s infinite alternate; }
.token.selected circle:first-child { stroke: #111; }
.target { animation: pulse 0.8s infinite alternate; }
@keyframes pulse { from { stroke-opacity: 1; } to { stroke-opacity: 0.35; } }
#controls { display: flex; align-items: center; gap: 12px; padding-bottom: 8px; }
#dice {
  font-size: 2.6rem;
  line-height: 1;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card);
  border-radius: 12px;
}
#dice.tumbling { color: var(--muted); }
#status { flex: 1; color: var(--muted); }
#roll { min-width: 110px; }
#sheet { position: fixed; inset: 0; background: #0009; display: flex; align-items: flex-end; z-index: 45; }
.sheetcard {
  width: 100%;
  background: var(--card);
  border-radius: 16px 16px 0 0;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 10px;
}
#modal { position: fixed; inset: 0; background: #000a; display: flex; align-items: center; justify-content: center; z-index: 46; padding: 16px; }
.modalcard { max-height: 80vh; overflow-y: auto; min-width: 280px; }
.loglist { font-size: 0.9rem; }
#sheet[hidden], #modal[hidden], #banner[hidden] { display: none; }
```

- [ ] **Step 4: Type-check and build**

Run: `npm run check`
Expected: clean.

- [ ] **Step 5: Full-game browser verification**

Run: `npm run dev`, then:

1. One tab: create a game as "Dad", start it (3 bots). Play a FULL game to the end. Verify: dice tumble on roll; only movable tokens pulse after a roll; tapping a movable token shows a white destination ring; tapping the ring moves; bot turns animate step by step ~1.5s apart; captures walk the victim back to base; the roll-log drawer lists every roll; a stack of two own tokens opens the picker sheet (engineer a block: get two tokens onto one square); game over shows placements and Play again works.
2. Two tabs (Dad + Mom): while Mom's turn is active, close her tab. Verify Dad sees the countdown banner "Waiting for Mom. Auto-move in Ns" and after ~60s the computer auto-plays her turn with "(auto)" in the status line. Reopen Mom's rejoin link. Verify she gets the "While you were away" digest listing what she missed.
3. Lock/unlock simulation: switch Mom's tab to another app/tab for 30s during bot turns, come back. Verify the board resyncs (no frozen mid-animation state) via the reconnect overlay or a silent snapshot.

- [ ] **Step 6: Commit**

```bash
git add LUDO/src/client/
git commit -m "ludo: svg board, tap-confirm moves, animations, digest, dice history"
```

---

### Task 10: Mobile polish, wake lock, deploy, family rehearsal

**Files:**
- Modify: `src/client/main.ts` (wake lock), `index.html` (iOS standalone meta)
- No new source files. Ends with the production deploy.

**Interfaces:**
- Consumes: everything.
- Produces: the live production URL on `ludo.<account>.workers.dev`.

- [ ] **Step 1: Add the screen wake lock to main.ts**

Append at the bottom of `main.ts`:

```ts
// keep the screen awake during a game; reacquire after tab switches
let wakeLock: { release(): Promise<void> } | null = null;
async function acquireWakeLock() {
  try {
    // @ts-expect-error wakeLock is not yet in all TS lib versions
    wakeLock = await navigator.wakeLock?.request("screen") ?? null;
  } catch {
    wakeLock = null; // fine: not supported or low battery
  }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && store.room) void acquireWakeLock();
});
void acquireWakeLock();
```

- [ ] **Step 2: Add iOS meta tags to index.html**

Add inside `<head>`:

```html
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Ludo" />
```

- [ ] **Step 3: Run the full test suite one last time**

Run: `npm test`
Expected: all unit and DO tests pass.

- [ ] **Step 4: Authenticate wrangler (needs the user's browser)**

Run: `npx wrangler whoami`
If not logged in, run `npx wrangler login` and let Gaurav complete the browser OAuth flow. This is the only step that cannot run unattended. A free Cloudflare account is sufficient (SQLite-backed DOs are included in the free tier).

- [ ] **Step 5: Deploy**

Run: `npm run deploy`
Expected: build then `wrangler deploy` prints the live URL, e.g. `https://ludo.<account>.workers.dev`. Open it on a phone and play one turn against bots.

- [ ] **Step 6: Family rehearsal checklist (manual, on real phones)**

1. Create a game on one phone, share the code via actual WhatsApp, have a second phone join from the WhatsApp in-app browser. Verify seat claiming and the rejoin link flow work inside the webview.
2. Mid-game: lock one phone for 90 seconds. Verify the countdown, one auto-played turn, and the digest on unlock.
3. Mid-game: run `npm run deploy` again (a real redeploy). Verify both phones reconnect within seconds and the game continues exactly where it was.
4. Finish a full 4-seat game (2 humans + 2 bots) to the placement screen; Play again once.
5. Abandon a test room entirely and confirm the next day that its code shows "Game not found" (GC ran).

- [ ] **Step 7: Commit and record the URL**

```bash
git add LUDO/
git commit -m "ludo: wake lock, ios meta, production deploy"
```

Then tell Gaurav the live URL and remind him: bookmark it, and the family chat should pin each player's personal rejoin link during games.
