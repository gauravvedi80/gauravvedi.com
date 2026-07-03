/* ==========================================================================
   Ocean's Mahjong — app.js
   Sections: 1 utils · 2 storage · 3 tile kinds · 4 layouts · 5 board core
             6 themes & faces · 7 renderer & FX · 8 audio · 9 game · 10 UI
   ========================================================================== */
'use strict';

const APP_VERSION = '3.2.0';   // shown in the menu; keep in step with the service-worker CACHE_VERSION
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.gauravvedi.oceansmahjong';

/* ───────────────────────── 1. Utilities ───────────────────────── */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function fmtTime(s) {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function dateToStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function todayStr() { return dateToStr(new Date()); }

/* Deterministic PRNG (xmur3 hash → mulberry32) for seeded/daily boards. */
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seedStr) { return mulberry32(xmur3(String(seedStr))()); }
function seedHash(seedStr) { return xmur3(String(seedStr))(); }

function shuffleArr(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ───────────────────────── 2. Storage ───────────────────────── */

const Store = {
  get(k, fb) {
    try { const v = localStorage.getItem(k); return v == null ? fb : JSON.parse(v); }
    catch (e) { return fb; }
  },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full / private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};

const SETTINGS_KEY = 'om.settings';
const STATS_KEY = 'om.stats';
const SAVE_KEY = 'om.save';

const DEFAULT_SETTINGS = {
  theme: 'gem',
  vol: { master: 0.8, rain: 0.7, thunder: 0.7, nature: 0.7, zen: 0.7, music: 0.6, fx: 0.7 },
  activeSounds: [],
  largeText: false,
  highContrast: false,
  colorblind: false,
  reducedMotion: false,
  petals: true,
  haptics: true,
  dimBlocked: true,
  tileScale: 1
};

const DEFAULT_STATS = {
  played: 0, won: 0, bestTime: 0, streak: 0, longestStreak: 0,
  totalMoves: 0, dailyCount: 0, pearls: 0, dailyDates: {}, layoutStars: {}, voyage: {}, times: {},
  ratePromptStage: 0   // 0 unasked, 1 deferred once, 2 done (rated or dismissed) — never nag past that
};

let Settings = null;
let Stats = null;

function loadSettings() {
  Settings = Object.assign({}, DEFAULT_SETTINGS, Store.get(SETTINGS_KEY, {}));
  Settings.vol = Object.assign({}, DEFAULT_SETTINGS.vol, Settings.vol || {});
  Stats = Object.assign({}, DEFAULT_STATS, Store.get(STATS_KEY, {}));
  // clone map fields so mutations never touch DEFAULT_STATS
  Stats.dailyDates = Object.assign({}, Stats.dailyDates);
  Stats.layoutStars = Object.assign({}, Stats.layoutStars);
  Stats.voyage = Object.assign({}, Stats.voyage);
  Stats.times = Object.assign({}, Stats.times);
}
function saveSettings() { Store.set(SETTINGS_KEY, Settings); }
function saveStats() { Store.set(STATS_KEY, Stats); }

/* ───────────────────────── 3. Tile kinds ─────────────────────────
   42 distinct faces:
     0..26  three suits × ranks 1–9
     27..30 four "winds" (directional specials)
     31..33 three "dragons" (trio specials)
     34..37 flowers  — any flower matches any flower
     38..41 seasons  — any season matches any season               */

const KINDS = [];
for (let s = 0; s < 3; s++) for (let r = 1; r <= 9; r++) KINDS.push({ t: 's', s, r });
for (let i = 0; i < 4; i++) KINDS.push({ t: 'w', i });
for (let i = 0; i < 3; i++) KINDS.push({ t: 'd', i });
for (let i = 0; i < 4; i++) KINDS.push({ t: 'f', i });
for (let i = 0; i < 4; i++) KINDS.push({ t: 'n', i });

function matchKeyOf(kind) {
  if (kind >= 38) return 101;       // seasons group
  if (kind >= 34) return 100;       // flowers group
  return kind;
}

/* Pool of matching pairs (72 = full 144-tile set). For smaller boards a
   shuffled subset is used; oversized boards cycle the suits again. */
function buildPairPool(nPairs, rnd) {
  const pool = [];
  for (let k = 0; k < 34; k++) { pool.push([k, k], [k, k]); }
  pool.push([34, 35], [36, 37], [38, 39], [40, 41]);
  shuffleArr(pool, rnd);
  let k = 0;
  while (pool.length < nPairs) { pool.push([k, k]); k = (k + 1) % 34; }
  return pool.slice(0, nPairs);
}

/* ───────────────────────── 4. Layouts ─────────────────────────
   Coordinates are half-tile units: a tile spans [x,x+2) × [y,y+2).
   Two tiles overlap when |dx|<2 and |dy|<2 on the same layer.     */

function R(list, z, r, c0, c1) { for (let c = c0; c <= c1; c++) list.push({ x: c * 2, y: r * 2, z }); }
function P(list, z, x, y) { list.push({ x, y, z }); }

/* Layouts are mobile-first: after orientation every playable footprint fits
   8 columns × ≤12 rows (pyramid reaches it via the portrait transpose), and
   tile counts come from stacking depth rather than spread — that is how the
   big commercial mahjongs keep tiles large on a phone screen.             */

function buildTurtle() {
  const L = [];
  for (let r = 0; r <= 11; r++) for (let c = 0; c <= 7; c++) {
    if ((r === 0 || r === 11) && (c === 0 || c === 7)) continue;   // shell corners
    P(L, 0, c * 2, r * 2);
  }
  for (let r = 2; r <= 9; r++) for (let c = 1; c <= 6; c++) {
    if ((r === 2 || r === 9) && (c === 1 || c === 6)) continue;
    P(L, 1, c * 2, r * 2);
  }
  R(L, 2, 5, 2, 5); R(L, 2, 6, 2, 5);                              // raised heart
  return L; // 144 in an 8×12 footprint
}

function buildTurtle2() {
  // variant: open heart, watchtower corners on the second tier
  const L = buildTurtle().filter(p => p.z !== 2);
  P(L, 2, 2, 6); P(L, 2, 12, 6); P(L, 2, 2, 16); P(L, 2, 12, 16);
  return L; // 140
}

function buildDragon() {
  const L = [];
  const spans = [[0, 3, 7], [1, 2, 7], [2, 1, 6], [3, 0, 5], [4, 0, 4], [5, 1, 5],
                 [6, 2, 6], [7, 3, 7], [8, 2, 7], [9, 1, 6], [10, 0, 5], [11, 0, 4]];
  for (const [r, c0, c1] of spans) R(L, 0, r, c0, c1);             // serpentine body
  R(L, 1, 1, 3, 6); R(L, 1, 3, 1, 4); R(L, 1, 6, 3, 6); R(L, 1, 8, 3, 6); R(L, 1, 10, 1, 4);
  R(L, 2, 3, 2, 3); R(L, 2, 8, 4, 5);                              // spine ridges
  return L; // 90
}

function buildPyramid() {
  const L = [];
  for (let r = 0; r <= 5; r++) R(L, 0, r, 1, 12);
  for (let r = 1; r <= 4; r++) R(L, 1, r, 3, 10);
  for (let r = 2; r <= 3; r++) R(L, 2, r, 4, 9);
  for (let r = 2; r <= 3; r++) R(L, 3, r, 6, 7);
  return L; // 120
}

function buildCastle() {
  const L = [];
  R(L, 0, 0, 0, 7); R(L, 0, 1, 0, 7); R(L, 0, 8, 0, 7); R(L, 0, 9, 0, 7);   // walls
  for (let r = 2; r <= 7; r++) { R(L, 0, r, 0, 1); R(L, 0, r, 6, 7); }
  R(L, 0, 4, 3, 4); R(L, 0, 5, 3, 4);                               // keep
  R(L, 1, 0, 0, 1); R(L, 1, 1, 0, 1); R(L, 1, 0, 6, 7); R(L, 1, 1, 6, 7);   // towers
  R(L, 1, 8, 0, 1); R(L, 1, 9, 0, 1); R(L, 1, 8, 6, 7); R(L, 1, 9, 6, 7);
  R(L, 1, 4, 3, 4); R(L, 1, 5, 3, 4);
  P(L, 2, 1, 1); P(L, 2, 13, 1); P(L, 2, 1, 17); P(L, 2, 13, 17);   // tower tops
  return L; // 84 in an 8×10 footprint
}

function buildLotus() {
  const L = [];
  for (let r = 4; r <= 7; r++) R(L, 0, r, 2, 5);                    // core
  R(L, 0, 0, 3, 4); R(L, 0, 1, 3, 4); R(L, 0, 8, 3, 4); R(L, 0, 9, 3, 4);   // N/S petals
  R(L, 0, 5, 0, 1); R(L, 0, 6, 0, 1); R(L, 0, 5, 6, 7); R(L, 0, 6, 6, 7);   // W/E petals
  R(L, 0, 1, 0, 1); R(L, 0, 2, 0, 1); R(L, 0, 1, 6, 7); R(L, 0, 2, 6, 7);   // diagonals
  R(L, 0, 8, 0, 1); R(L, 0, 9, 0, 1); R(L, 0, 8, 6, 7); R(L, 0, 9, 6, 7);
  R(L, 1, 5, 3, 4); R(L, 1, 6, 3, 4);                               // raised heart
  P(L, 1, 7, 1); P(L, 1, 7, 17); P(L, 1, 1, 11); P(L, 1, 13, 11);   // petal tips
  P(L, 1, 1, 3); P(L, 1, 13, 3); P(L, 1, 1, 17); P(L, 1, 13, 17);
  P(L, 2, 6, 11); P(L, 2, 8, 11);                                   // bloom crown
  return L; // 62 in an 8×10 footprint
}

function buildGarden() {
  const L = [];
  const beds = [[0, 0], [3, 0], [6, 0], [0, 7], [3, 7], [6, 7]];
  for (const [c0, r0] of beds) {
    R(L, 0, r0, c0, c0 + 1); R(L, 0, r0 + 1, c0, c0 + 1);
    P(L, 1, c0 * 2 + 1, r0 * 2 + 1);
  }
  R(L, 0, 3, 2, 5); R(L, 0, 4, 2, 5);                               // central pond
  P(L, 1, 6, 7); P(L, 1, 8, 7);                                     // lily pads
  return L; // 40 in an 8×9 footprint
}

function buildButterfly() {
  const L = [];
  for (let r = 0; r <= 9; r++) R(L, 0, r, 3, 4);                    // body
  const wing = [[1, 1, 2], [2, 0, 2], [3, 0, 2], [4, 0, 2], [5, 0, 2], [6, 1, 2]];
  for (const [r, c0, c1] of wing) {
    R(L, 0, r, c0, c1);                                             // left wing
    for (let c = c0; c <= c1; c++) P(L, 0, 14 - c * 2, r * 2);      // mirrored right wing
  }
  for (let r = 2; r <= 7; r++) R(L, 1, r, 3, 4);                    // thorax
  R(L, 1, 3, 1, 2); R(L, 1, 4, 1, 2); R(L, 1, 3, 5, 6); R(L, 1, 4, 5, 6);   // wing spots
  R(L, 2, 4, 3, 4); R(L, 2, 5, 3, 4);                               // crest
  return L; // 76 in an 8×10 footprint
}

/* Procedural generator: symmetric even-width rows, layers strictly nested,
   so the result is always supported and has an even tile count. */
function buildRandom(rnd) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const L = [];
    const rows = 7 + Math.floor(rnd() * 2);
    const hw0 = [];
    for (let r = 0; r < rows; r++) {
      const hw = 3 + Math.floor(rnd() * 4);          // half-width 3..6 → width 6..12
      hw0.push(hw);
      R(L, 0, r, 7 - hw, 6 + hw);
    }
    const hw1 = [];
    for (let r = 0; r < rows; r++) {
      let h = 0;
      if (hw0[r] >= 3 && rnd() < 0.75) h = Math.max(1, hw0[r] - 1 - Math.floor(rnd() * 2));
      hw1.push(h);
      if (h) R(L, 1, r, 7 - h, 6 + h);
    }
    for (let r = 0; r < rows; r++) {
      if (hw1[r] >= 2 && rnd() < 0.55) {
        const h = hw1[r] - 1;
        R(L, 2, r, 7 - h, 6 + h);
      }
    }
    if (L.length >= 60 && L.length <= 144) return L;
  }
  return buildPyramid();
}

const LAYOUTS = {
  turtle:    { name: 'Turtle',         diff: 2, build: buildTurtle },
  dragon:    { name: 'Dragon',         diff: 3, build: buildDragon },
  pyramid:   { name: 'Pyramid',        diff: 1, build: buildPyramid },
  castle:    { name: 'Castle',         diff: 3, build: buildCastle },
  lotus:     { name: 'Lotus',          diff: 1, build: buildLotus },
  garden:    { name: 'Flower Garden',  diff: 1, build: buildGarden },
  butterfly: { name: 'Butterfly',      diff: 2, build: buildButterfly },
  turtle2:   { name: 'Turtle II',      diff: 3, build: buildTurtle2 },
  random:    { name: 'Surprise Me',    diff: 2, build: null }       // procedural
};
const CLASSIC_LAYOUTS = ['random', 'turtle', 'pyramid', 'lotus', 'garden', 'butterfly', 'dragon', 'castle', 'turtle2'];
const EXPERT_LAYOUTS = ['turtle', 'dragon', 'castle', 'turtle2', 'random'];
const DAILY_LAYOUTS = ['turtle', 'dragon', 'pyramid', 'castle', 'lotus', 'garden', 'butterfly', 'turtle2'];

/* Orient a layout for the screen: portrait screens get tall boards (e.g. the
   12×6 pyramid becomes 6×12), landscape screens get wide ones. */
function orientLayout(pos, portrait) {
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (const p of pos) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x + 2);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y + 2);
  }
  const wide = (maxX - minX) > (maxY - minY);
  if ((portrait && wide) || (!portrait && !wide)) {
    return pos.map(p => ({ x: p.y, y: p.x, z: p.z }));
  }
  return pos;
}

function buildLayout(key, rnd, portrait) {
  const pos = key === 'random' ? buildRandom(rnd || Math.random) : LAYOUTS[key].build();
  return orientLayout(pos, portrait !== false);
}

/* Structural sanity check (used by QA and the procedural generator). */
function validateLayout(pos) {
  if (pos.length < 2 || pos.length % 2 !== 0) return 'odd or tiny count';
  for (let i = 0; i < pos.length; i++) {
    for (let j = i + 1; j < pos.length; j++) {
      if (pos[i].z === pos[j].z && Math.abs(pos[i].x - pos[j].x) < 2 && Math.abs(pos[i].y - pos[j].y) < 2) {
        return 'overlap at ' + JSON.stringify([pos[i], pos[j]]);
      }
    }
  }
  for (const t of pos) {
    if (t.z === 0) continue;
    const ok = pos.some(o => o.z === t.z - 1 && Math.abs(o.x - t.x) < 2 && Math.abs(o.y - t.y) < 2);
    if (!ok) return 'floating tile ' + JSON.stringify(t);
  }
  return null;
}

/* ───────────────────────── 5. Board core ───────────────────────── */

/* A tile is open when nothing overlaps it from above and at least one of
   its left/right sides has no touching same-layer neighbour. */
function isOpenAt(i, pos, present) {
  const t = pos[i];
  let left = false, right = false;
  for (let j = 0; j < pos.length; j++) {
    if (j === i || !present[j]) continue;
    const o = pos[j];
    const dy = Math.abs(o.y - t.y);
    if (dy >= 2) continue;
    if (o.z > t.z && Math.abs(o.x - t.x) < 2) return false;
    if (o.z === t.z) {
      if (o.x === t.x - 2) left = true;
      else if (o.x === t.x + 2) right = true;
    }
  }
  return !(left && right);
}

/* Deal by reversing a legal removal sequence — the board is solvable by
   construction (the recorded sequence is itself a winning line). Optional
   `pairs` re-deals a fixed multiset (used by shuffle).                   */
function dealSolvable(positions, rnd, pairs) {
  const n = positions.length;
  for (let attempt = 0; attempt < 200; attempt++) {
    const present = new Array(n).fill(true);
    const order = [];
    let remaining = n, ok = true;
    while (remaining > 0) {
      const free = [];
      for (let i = 0; i < n; i++) if (present[i] && isOpenAt(i, positions, present)) free.push(i);
      if (free.length < 2) { ok = false; break; }
      const a = free[Math.floor(rnd() * free.length)];
      let b = a, guard = 0;
      while (b === a && guard++ < 50) b = free[Math.floor(rnd() * free.length)];
      if (b === a) { ok = false; break; }
      order.push([a, b]);
      present[a] = present[b] = false;
      remaining -= 2;
    }
    if (!ok) continue;
    const pp = pairs ? shuffleArr(pairs.slice(), rnd) : buildPairPool(n / 2, rnd);
    const kinds = new Array(n);
    for (let k = 0; k < order.length; k++) {
      kinds[order[k][0]] = pp[k][0];
      kinds[order[k][1]] = pp[k][1];
    }
    return { kinds, order };
  }
  return null;
}

/* Verify a recorded solution replays legally (QA safety net). */
function verifySolution(positions, kinds, order) {
  const present = new Array(positions.length).fill(true);
  for (const [a, b] of order) {
    if (!present[a] || !present[b]) return false;
    if (matchKeyOf(kinds[a]) !== matchKeyOf(kinds[b])) return false;
    if (!isOpenAt(a, positions, present) || !isOpenAt(b, positions, present)) return false;
    present[a] = present[b] = false;
  }
  return present.every(p => !p);
}

/* Helpers over live game tiles ({x,y,z,kind,removed}). */
function tilesPresent(tiles) { return tiles.map(t => !t.removed); }
function tileIsOpen(tiles, i) {
  if (tiles[i].removed) return false;
  return isOpenAt(i, tiles, tilesPresent(tiles));
}
function findMoves(tiles) {
  const present = tilesPresent(tiles);
  const free = [];
  for (let i = 0; i < tiles.length; i++) {
    if (present[i] && isOpenAt(i, tiles, present)) free.push(i);
  }
  const byKey = new Map();
  for (const i of free) {
    const k = matchKeyOf(tiles[i].kind);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(i);
  }
  const moves = [];
  for (const idxs of byKey.values()) {
    for (let a = 0; a < idxs.length; a++) {
      for (let b = a + 1; b < idxs.length; b++) moves.push([idxs[a], idxs[b]]);
    }
  }
  return moves;
}

/* ── difficulty engine ──────────────────────────────────────────────
   A deal's difficulty ≈ how rarely greedy random play wins it. Candidate
   deals are generated deterministically from the seed, scored with seeded
   playouts, sorted easiest→hardest, and the mode's target (0..1) picks the
   percentile. Runs in a Worker built from these functions' source, so they
   must stay self-contained (no closures over module state).             */

function playoutOnce(positions, kinds, rnd) {
  const n = positions.length;
  const present = new Array(n).fill(true);
  let remaining = n;
  while (remaining > 0) {
    const byKey = {};
    const pairs = [];
    for (let i = 0; i < n; i++) {
      if (!present[i] || !isOpenAt(i, positions, present)) continue;
      const k = matchKeyOf(kinds[i]);
      (byKey[k] = byKey[k] || []).push(i);
    }
    for (const k in byKey) {
      const l = byKey[k];
      for (let a = 0; a < l.length; a++) {
        for (let b = a + 1; b < l.length; b++) pairs.push([l[a], l[b]]);
      }
    }
    if (!pairs.length) return { won: false, left: remaining };
    const p = pairs[Math.floor(rnd() * pairs.length)];
    present[p[0]] = present[p[1]] = false;
    remaining -= 2;
  }
  return { won: true, left: 0 };
}

function scoreDeal(positions, kinds, rnd, plays) {
  let wins = 0, leftSum = 0;
  for (let i = 0; i < plays; i++) {
    const r = playoutOnce(positions, kinds, rnd);
    if (r.won) wins++; else leftSum += r.left;
  }
  return { winRate: wins / plays, avgLeft: wins === plays ? 0 : leftSum / (plays - wins) };
}

function chooseDeal(positions, seed, target, count) {
  const cands = [];
  for (let c = 0; c < count; c++) {
    const deal = dealSolvable(positions, makeRng(seed + '#c' + c));
    if (!deal) continue;
    const sc = scoreDeal(positions, deal.kinds, makeRng(seed + '#p' + c), 5);
    cands.push({ kinds: deal.kinds, winRate: sc.winRate, avgLeft: sc.avgLeft });
  }
  if (!cands.length) return null;
  // easiest first: high win rate, then getting stuck with fewer tiles left
  cands.sort((a, b) => (b.winRate - a.winRate) || (a.avgLeft - b.avgLeft));
  const idx = Math.min(cands.length - 1, Math.max(0, Math.round(target * (cands.length - 1))));
  return { kinds: cands[idx].kinds, winRate: cands[idx].winRate };
}

/* ───────────────────────── 6. Themes & tile faces ─────────────────────────
   Fully pictorial faces — no numerals, no letters. Ranks read the classic
   mahjong way: count the symbols, laid out in canonical tight arrangements.
   Suits: Blossoms (count the flowers) · Sprigs (count the stems) · Pearls
   (count the circles). Winds = four garden friends (butterfly, dragonfly,
   ladybug, bee). Dragons = three grand butterflies (1/2/3 wing spots).
   Flowers/Seasons = one large bloom or season icon under a silk ribbon —
   pink ribbon = flowers, blue ribbon = seasons, in every theme.          */

const FLOWER_RIBBON = '#e64980';
const SEASON_RIBBON = '#4dabf7';

const THEMES = {
  gem: {
    name: 'Gem Luxury', sub: 'Ruby blooms · aqua pearls',
    suits: [
      { key: 'blossom', letter: 'B', colors: ['#e0316b', '#c2255c', '#f06595'] },
      { key: 'sprig',   letter: 'S', colors: ['#0ca678', '#099268', '#12b886'], leaf: '#94d82d' },
      { key: 'pearl',   letter: 'P', colors: ['#1098ad', '#4263eb', '#e8b339'] }
    ],
    wings: ['#e0316b', '#7048e8', '#1098ad']
  },
  zen: {
    name: 'Flower Zen', sub: 'Sakura · lavender · soft pearls',
    suits: [
      { key: 'blossom', letter: 'B', colors: ['#f06595', '#e8467c', '#f783ac'] },
      { key: 'sprig',   letter: 'S', colors: ['#7048e8', '#845ef7', '#9775fa'], leaf: '#69db7c' },
      { key: 'pearl',   letter: 'P', colors: ['#9775fa', '#748ffc', '#f783ac'] }
    ],
    wings: ['#f06595', '#9775fa', '#3bc9db']
  },
  nature: {
    name: 'Nature Calm', sub: 'Poppy · bamboo · sky pearls',
    suits: [
      { key: 'blossom', letter: 'B', colors: ['#e8590c', '#e03131', '#f08c00'] },
      { key: 'sprig',   letter: 'S', colors: ['#2f9e44', '#37b24d', '#2b8a3e'], leaf: '#a9e34b' },
      { key: 'pearl',   letter: 'P', colors: ['#1c7ed6', '#0ca678', '#fab005'] }
    ],
    wings: ['#e8590c', '#7048e8', '#1c7ed6']
  },
  gold: {
    name: 'Royal Gold', sub: 'Enamel blooms on gold',
    suits: [
      { key: 'blossom', letter: 'B', colors: ['#c2255c', '#a61e4d', '#e64980'] },
      { key: 'sprig',   letter: 'S', colors: ['#1e8449', '#2b8a3e', '#0b7235'], leaf: '#74b816' },
      { key: 'pearl',   letter: 'P', colors: ['#1f4e9c', '#1971c2', '#b8860b'] }
    ],
    wings: ['#a61e4d', '#364fc7', '#0b7285']
  },
  ocean: {
    name: 'Ocean Depths', sub: 'Shells · fish · sea pearls',
    suits: [
      { key: 'shell', letter: 'H', colors: ['#f06595', '#e8590c', '#e8467c'] },
      { key: 'fish',  letter: 'F', colors: ['#0ca678', '#1c7ed6', '#15aabf'] },
      { key: 'pearl', letter: 'P', colors: ['#15aabf', '#4263eb', '#3bc9db'] }
    ],
    wings: ['#15aabf', '#f06595', '#7048e8']
  },
  night: {
    name: 'Starry Night', sub: 'Stars · moons · stardust',
    suits: [
      { key: 'star',  letter: 'S', colors: ['#f59f00', '#fab005', '#e8b339'] },
      { key: 'moon',  letter: 'M', colors: ['#9775fa', '#845ef7', '#b197fc'] },
      { key: 'pearl', letter: 'P', colors: ['#748ffc', '#f783ac', '#3bc9db'] }
    ],
    wings: ['#f59f00', '#9775fa', '#3bc9db']
  }
};

/* themes earned with pearls from the Bonus Dive */
const THEME_LOCKS = { ocean: 3, night: 6 };
function themeUnlocked(key) {
  const need = THEME_LOCKS[key];
  return !need || (Stats && (Stats.pearls | 0) >= need);
}

/* classic counting arrangements: [x, y, glyphSize] per rank (viewBox 100×120).
   Glyphs bleed almost to the rim — like real mahjong faces — so they stay
   readable at phone sizes without numerals. */
const RANK_LAYOUT = {
  1: [[50, 60, 34]],
  2: [[50, 34, 21], [50, 86, 21]],
  3: [[28, 32, 17], [50, 60, 17], [72, 88, 17]],
  4: [[30, 34, 18], [70, 34, 18], [30, 86, 18], [70, 86, 18]],
  5: [[29, 32, 15.5], [71, 32, 15.5], [50, 60, 15.5], [29, 88, 15.5], [71, 88, 15.5]],
  6: [[30, 32, 13.4], [70, 32, 13.4], [30, 60, 13.4], [70, 60, 13.4], [30, 88, 13.4], [70, 88, 13.4]],
  7: [[34, 30, 13.5], [66, 30, 13.5], [24, 60, 13.5], [50, 60, 13.5], [76, 60, 13.5], [34, 90, 13.5], [66, 90, 13.5]],
  8: [[26, 30, 13], [50, 30, 13], [74, 30, 13], [36, 60, 13], [64, 60, 13], [26, 90, 13], [50, 90, 13], [74, 90, 13]],
  9: [[26, 30, 12.8], [50, 30, 12.8], [74, 30, 12.8], [26, 60, 12.8], [50, 60, 12.8], [74, 60, 12.8], [26, 90, 12.8], [50, 90, 12.8], [74, 90, 12.8]]
};

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = i => clamp(Math.round(((n >> i) & 255) * f + (f > 1 ? 18 : 0)), 0, 255);
  return 'rgb(' + ch(16) + ',' + ch(8) + ',' + ch(0) + ')';
}

/* ---- glyph library — everything centred at (cx,cy) with size r ---- */

function blossomG(cx, cy, r, c) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    s += `<ellipse cx="${cx}" cy="${cy - r * 0.52}" rx="${r * 0.37}" ry="${r * 0.54}" fill="${c}" stroke="${shade(c, 0.6)}" stroke-width="1.2" transform="rotate(${i * 72} ${cx} ${cy})"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * 0.27}" fill="#f8ce5a" stroke="#c9921e" stroke-width="1"/>`;
}

function sprigG(cx, cy, r, c, leaf) {
  const w = Math.max(3.6, r * 0.36), h = r * 2.05;
  let s = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${w / 2}" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="1.6"/>` +
    `<line x1="${cx - w / 2}" y1="${cy + h * 0.18}" x2="${cx + w / 2}" y2="${cy + h * 0.18}" stroke="${shade(c, 0.5)}" stroke-width="1.6"/>` +
    `<line x1="${cx - w / 2}" y1="${cy - h * 0.18}" x2="${cx + w / 2}" y2="${cy - h * 0.18}" stroke="${shade(c, 0.5)}" stroke-width="1.6"/>`;
  if (r > 14) {
    s += `<ellipse cx="${cx - r * 0.52}" cy="${cy - r * 0.3}" rx="${r * 0.4}" ry="${r * 0.18}" fill="${leaf}" transform="rotate(-30 ${cx - r * 0.52} ${cy - r * 0.3})"/>` +
         `<ellipse cx="${cx + r * 0.52}" cy="${cy + r * 0.22}" rx="${r * 0.4}" ry="${r * 0.18}" fill="${leaf}" transform="rotate(30 ${cx + r * 0.52} ${cy + r * 0.22})"/>`;
  }
  return s;
}

function pearlG(cx, cy, r, c) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 0.92}" fill="${c}" stroke="${shade(c, 0.52)}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="${shade(c, 1.5)}" opacity="0.85"/>` +
    `<circle cx="${cx - r * 0.3}" cy="${cy - r * 0.33}" r="${Math.max(1.4, r * 0.16)}" fill="#fff" opacity="0.95"/>`;
}

function shellG(cx, cy, r, c) {
  let s = `<path d="M ${cx - r * 0.85} ${cy + r * 0.35} A ${r * 0.88} ${r * 0.88} 0 0 1 ${cx + r * 0.85} ${cy + r * 0.35} L ${cx + r * 0.2} ${cy + r * 0.8} L ${cx - r * 0.2} ${cy + r * 0.8} Z" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="1.8" stroke-linejoin="round"/>`;
  for (let i = -2; i <= 2; i++) {
    s += `<line x1="${cx}" y1="${cy + r * 0.72}" x2="${cx + i * r * 0.36}" y2="${cy - r * 0.38 + Math.abs(i) * r * 0.1}" stroke="${shade(c, 0.62)}" stroke-width="1.4"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy + r * 0.82}" r="${Math.max(1.6, r * 0.12)}" fill="${shade(c, 0.6)}"/>`;
}

function fishG(cx, cy, r, c) {
  return `<path d="M ${cx - r * 0.9} ${cy} Q ${cx - r * 0.25} ${cy - r * 0.62} ${cx + r * 0.45} ${cy} Q ${cx - r * 0.25} ${cy + r * 0.62} ${cx - r * 0.9} ${cy} Z" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M ${cx + r * 0.4} ${cy} L ${cx + r * 0.92} ${cy - r * 0.45} L ${cx + r * 0.92} ${cy + r * 0.45} Z" fill="${shade(c, 1.3)}" stroke="${shade(c, 0.55)}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<circle cx="${cx - r * 0.55}" cy="${cy - r * 0.12}" r="${Math.max(1.5, r * 0.1)}" fill="#243140"/>` +
    `<path d="M ${cx - r * 0.3} ${cy - r * 0.05} Q ${cx - r * 0.05} ${cy - r * 0.3} ${cx + r * 0.15} ${cy - r * 0.05}" fill="none" stroke="${shade(c, 0.6)}" stroke-width="1.3"/>`;
}

function starG(cx, cy, r, c) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
  }
  return `<polygon points="${pts.join(' ')}" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="2" stroke-linejoin="round"/>` +
    `<circle cx="${cx - r * 0.18}" cy="${cy - r * 0.2}" r="${Math.max(1.4, r * 0.11)}" fill="#fff" opacity="0.9"/>`;
}

function moonG(cx, cy, r, c) {
  return `<path d="M ${cx + r * 0.42} ${cy - r * 0.72} A ${r * 0.85} ${r * 0.85} 0 1 0 ${cx + r * 0.42} ${cy + r * 0.72} A ${r * 0.6} ${r * 0.6} 0 1 1 ${cx + r * 0.42} ${cy - r * 0.72} Z" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<circle cx="${cx - r * 0.45}" cy="${cy - r * 0.25}" r="${Math.max(1.3, r * 0.09)}" fill="${shade(c, 0.62)}" opacity="0.7"/>`;
}

/* suit glyph dispatch — each theme's suit picks one of these families */
const SUIT_GLYPHS = {
  blossom: (x, y, r, c) => blossomG(x, y, r * 0.94, c),
  sprig:   (x, y, r, c, set) => sprigG(x, y, r, c, set.leaf),
  pearl:   (x, y, r, c) => pearlG(x, y, r, c),
  shell:   (x, y, r, c) => shellG(x, y, r, c),
  fish:    (x, y, r, c) => fishG(x, y, r * 0.95, c),
  star:    (x, y, r, c) => starG(x, y, r * 0.92, c),
  moon:    (x, y, r, c) => moonG(x, y, r * 0.95, c)
};

function butterflyG(cx, cy, r, c, spots) {
  const dk = shade(c, 0.55), lt = shade(c, 1.35);
  let s =
    `<ellipse cx="${cx - r * 0.5}" cy="${cy - r * 0.34}" rx="${r * 0.5}" ry="${r * 0.62}" fill="${c}" stroke="${dk}" stroke-width="2" transform="rotate(-26 ${cx - r * 0.5} ${cy - r * 0.34})"/>` +
    `<ellipse cx="${cx + r * 0.5}" cy="${cy - r * 0.34}" rx="${r * 0.5}" ry="${r * 0.62}" fill="${c}" stroke="${dk}" stroke-width="2" transform="rotate(26 ${cx + r * 0.5} ${cy - r * 0.34})"/>` +
    `<ellipse cx="${cx - r * 0.42}" cy="${cy + r * 0.46}" rx="${r * 0.36}" ry="${r * 0.46}" fill="${lt}" stroke="${dk}" stroke-width="1.6" transform="rotate(22 ${cx - r * 0.42} ${cy + r * 0.46})"/>` +
    `<ellipse cx="${cx + r * 0.42}" cy="${cy + r * 0.46}" rx="${r * 0.36}" ry="${r * 0.46}" fill="${lt}" stroke="${dk}" stroke-width="1.6" transform="rotate(-22 ${cx + r * 0.42} ${cy + r * 0.46})"/>` +
    `<line x1="${cx}" y1="${cy - r * 0.78}" x2="${cx}" y2="${cy + r * 0.85}" stroke="#5c4a52" stroke-width="${Math.max(2.6, r * 0.15)}" stroke-linecap="round"/>` +
    `<path d="M ${cx} ${cy - r * 0.78} Q ${cx - r * 0.3} ${cy - r * 1.05} ${cx - r * 0.42} ${cy - r * 0.98}" fill="none" stroke="#5c4a52" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path d="M ${cx} ${cy - r * 0.78} Q ${cx + r * 0.3} ${cy - r * 1.05} ${cx + r * 0.42} ${cy - r * 0.98}" fill="none" stroke="#5c4a52" stroke-width="1.8" stroke-linecap="round"/>`;
  for (let i = 0; i < (spots || 0); i++) {
    const sy = cy - r * 0.55 + i * r * 0.3;
    s += `<circle cx="${cx - r * 0.5}" cy="${sy}" r="${r * 0.1}" fill="#fff" opacity="0.95"/>` +
         `<circle cx="${cx + r * 0.5}" cy="${sy}" r="${r * 0.1}" fill="#fff" opacity="0.95"/>`;
  }
  return s;
}

function ladybugG(cx, cy, r, c) {
  return `<circle cx="${cx}" cy="${cy + r * 0.1}" r="${r * 0.74}" fill="${c}" stroke="${shade(c, 0.5)}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy - r * 0.58}" r="${r * 0.3}" fill="#473b36"/>` +
    `<line x1="${cx}" y1="${cy - r * 0.55}" x2="${cx}" y2="${cy + r * 0.82}" stroke="#473b36" stroke-width="2.2"/>` +
    `<circle cx="${cx - r * 0.34}" cy="${cy - r * 0.1}" r="${r * 0.13}" fill="#473b36"/>` +
    `<circle cx="${cx + r * 0.34}" cy="${cy - r * 0.1}" r="${r * 0.13}" fill="#473b36"/>` +
    `<circle cx="${cx - r * 0.3}" cy="${cy + r * 0.42}" r="${r * 0.13}" fill="#473b36"/>` +
    `<circle cx="${cx + r * 0.3}" cy="${cy + r * 0.42}" r="${r * 0.13}" fill="#473b36"/>` +
    `<path d="M ${cx - r * 0.14} ${cy - r * 0.82} Q ${cx - r * 0.34} ${cy - r * 1.05} ${cx - r * 0.46} ${cy - r * 1}" fill="none" stroke="#473b36" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path d="M ${cx + r * 0.14} ${cy - r * 0.82} Q ${cx + r * 0.34} ${cy - r * 1.05} ${cx + r * 0.46} ${cy - r * 1}" fill="none" stroke="#473b36" stroke-width="1.8" stroke-linecap="round"/>`;
}

function beeG(cx, cy, r, c) {
  const dk = '#473b36';
  return `<ellipse cx="${cx - r * 0.42}" cy="${cy - r * 0.52}" rx="${r * 0.42}" ry="${r * 0.26}" fill="#cfe8ff" stroke="#8fb8dd" stroke-width="1.4" transform="rotate(-30 ${cx - r * 0.42} ${cy - r * 0.52})"/>` +
    `<ellipse cx="${cx + r * 0.42}" cy="${cy - r * 0.52}" rx="${r * 0.42}" ry="${r * 0.26}" fill="#cfe8ff" stroke="#8fb8dd" stroke-width="1.4" transform="rotate(30 ${cx + r * 0.42} ${cy - r * 0.52})"/>` +
    `<ellipse cx="${cx}" cy="${cy + r * 0.12}" rx="${r * 0.5}" ry="${r * 0.68}" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="2"/>` +
    `<rect x="${cx - r * 0.46}" y="${cy - r * 0.1}" width="${r * 0.92}" height="${r * 0.17}" fill="${dk}"/>` +
    `<rect x="${cx - r * 0.42}" y="${cy + r * 0.26}" width="${r * 0.84}" height="${r * 0.17}" fill="${dk}"/>` +
    `<circle cx="${cx}" cy="${cy - r * 0.6}" r="${r * 0.26}" fill="${dk}"/>` +
    `<path d="M ${cx} ${cy + r * 0.8} L ${cx} ${cy + r * 1}" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>`;
}

function dragonflyG(cx, cy, r, c) {
  const wing = (dx, dy, rot) =>
    `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="${r * 0.62}" ry="${r * 0.17}" fill="${shade(c, 1.55)}" opacity="0.8" stroke="${c}" stroke-width="1.3" transform="rotate(${rot} ${cx + dx} ${cy + dy})"/>`;
  return wing(-r * 0.58, -r * 0.28, -16) + wing(r * 0.58, -r * 0.28, 16) +
    wing(-r * 0.55, r * 0.06, -6) + wing(r * 0.55, r * 0.06, 6) +
    `<rect x="${cx - r * 0.09}" y="${cy - r * 0.5}" width="${r * 0.18}" height="${r * 1.45}" rx="${r * 0.09}" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="1.4"/>` +
    `<circle cx="${cx}" cy="${cy - r * 0.66}" r="${r * 0.22}" fill="${shade(c, 0.7)}"/>`;
}

function roseG(cx, cy, r, c) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 0.78}" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="2"/>` +
    `<path d="M ${cx} ${cy - r * 0.5} A ${r * 0.5} ${r * 0.5} 0 1 1 ${cx - r * 0.5} ${cy}" fill="none" stroke="${shade(c, 0.6)}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M ${cx} ${cy - r * 0.24} A ${r * 0.24} ${r * 0.24} 0 1 1 ${cx - r * 0.24} ${cy}" fill="none" stroke="${shade(c, 0.6)}" stroke-width="1.8" stroke-linecap="round"/>` +
    `<ellipse cx="${cx - r * 0.6}" cy="${cy + r * 0.72}" rx="${r * 0.34}" ry="${r * 0.16}" fill="#37b24d" transform="rotate(-28 ${cx - r * 0.6} ${cy + r * 0.72})"/>` +
    `<ellipse cx="${cx + r * 0.6}" cy="${cy + r * 0.72}" rx="${r * 0.34}" ry="${r * 0.16}" fill="#37b24d" transform="rotate(28 ${cx + r * 0.6} ${cy + r * 0.72})"/>`;
}

function lotusG(cx, cy, r, c) {
  const lt = shade(c, 1.3);
  return `<path d="M ${cx - r * 0.95} ${cy + r * 0.3} Q ${cx - r * 0.55} ${cy - r * 0.25} ${cx - r * 0.2} ${cy + r * 0.42} Z" fill="${lt}" stroke="${shade(c, 0.6)}" stroke-width="1.4"/>` +
    `<path d="M ${cx + r * 0.95} ${cy + r * 0.3} Q ${cx + r * 0.55} ${cy - r * 0.25} ${cx + r * 0.2} ${cy + r * 0.42} Z" fill="${lt}" stroke="${shade(c, 0.6)}" stroke-width="1.4"/>` +
    `<path d="M ${cx - r * 0.6} ${cy + r * 0.4} Q ${cx - r * 0.5} ${cy - r * 0.6} ${cx} ${cy + r * 0.45} Z" fill="${c}" stroke="${shade(c, 0.6)}" stroke-width="1.4"/>` +
    `<path d="M ${cx + r * 0.6} ${cy + r * 0.4} Q ${cx + r * 0.5} ${cy - r * 0.6} ${cx} ${cy + r * 0.45} Z" fill="${c}" stroke="${shade(c, 0.6)}" stroke-width="1.4"/>` +
    `<path d="M ${cx - r * 0.28} ${cy + r * 0.42} Q ${cx} ${cy - r * 0.95} ${cx + r * 0.28} ${cy + r * 0.42} Z" fill="${c}" stroke="${shade(c, 0.6)}" stroke-width="1.4"/>` +
    `<path d="M ${cx - r * 0.85} ${cy + r * 0.55} Q ${cx} ${cy + r * 0.95} ${cx + r * 0.85} ${cy + r * 0.55}" fill="none" stroke="#37b24d" stroke-width="2.4" stroke-linecap="round"/>`;
}

function tulipG(cx, cy, r, c) {
  return `<path d="M ${cx - r * 0.62} ${cy - r * 0.55} Q ${cx - r * 0.68} ${cy + r * 0.32} ${cx} ${cy + r * 0.42} Q ${cx + r * 0.68} ${cy + r * 0.32} ${cx + r * 0.62} ${cy - r * 0.55} Q ${cx + r * 0.3} ${cy - r * 0.12} ${cx} ${cy - r * 0.66} Q ${cx - r * 0.3} ${cy - r * 0.12} ${cx - r * 0.62} ${cy - r * 0.55} Z" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="2" stroke-linejoin="round"/>` +
    `<line x1="${cx}" y1="${cy + r * 0.42}" x2="${cx}" y2="${cy + r}" stroke="#37b24d" stroke-width="${Math.max(2.6, r * 0.14)}" stroke-linecap="round"/>` +
    `<ellipse cx="${cx + r * 0.4}" cy="${cy + r * 0.78}" rx="${r * 0.34}" ry="${r * 0.14}" fill="#37b24d" transform="rotate(32 ${cx + r * 0.4} ${cy + r * 0.78})"/>`;
}

function sunflowerG(cx, cy, r, c) {
  let s = '';
  for (let i = 0; i < 12; i++) {
    s += `<ellipse cx="${cx}" cy="${cy - r * 0.62}" rx="${r * 0.2}" ry="${r * 0.42}" fill="${c}" stroke="${shade(c, 0.65)}" stroke-width="1" transform="rotate(${i * 30} ${cx} ${cy})"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * 0.38}" fill="#7c4a12" stroke="#5b3409" stroke-width="1.4"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="none" stroke="#9a6420" stroke-width="1.6"/>`;
}

function sproutG(cx, cy, r, c) {
  return `<path d="M ${cx} ${cy + r * 0.85} Q ${cx - r * 0.08} ${cy} ${cx} ${cy - r * 0.3}" fill="none" stroke="${shade(c, 0.7)}" stroke-width="${Math.max(2.6, r * 0.14)}" stroke-linecap="round"/>` +
    `<path d="M ${cx} ${cy - r * 0.25} Q ${cx - r * 0.9} ${cy - r * 0.55} ${cx - r * 0.55} ${cy - r * 0.95} Q ${cx - r * 0.05} ${cy - r * 0.7} ${cx} ${cy - r * 0.25} Z" fill="${c}" stroke="${shade(c, 0.6)}" stroke-width="1.6"/>` +
    `<path d="M ${cx} ${cy - r * 0.25} Q ${cx + r * 0.9} ${cy - r * 0.55} ${cx + r * 0.55} ${cy - r * 0.95} Q ${cx + r * 0.05} ${cy - r * 0.7} ${cx} ${cy - r * 0.25} Z" fill="${shade(c, 1.25)}" stroke="${shade(c, 0.6)}" stroke-width="1.6"/>` +
    `<path d="M ${cx - r * 0.6} ${cy + r * 0.85} Q ${cx} ${cy + r * 1.05} ${cx + r * 0.6} ${cy + r * 0.85}" fill="none" stroke="#8a6a4a" stroke-width="2.6" stroke-linecap="round"/>`;
}

function sunG(cx, cy, r, c) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r * 0.52}" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="2.2"/>`;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    s += `<line x1="${cx + Math.cos(a) * r * 0.68}" y1="${cy + Math.sin(a) * r * 0.68}" x2="${cx + Math.cos(a) * r * 0.98}" y2="${cy + Math.sin(a) * r * 0.98}" stroke="${c}" stroke-width="${Math.max(3, r * 0.15)}" stroke-linecap="round"/>`;
  }
  return s;
}

function mapleG(cx, cy, r, c) {
  return `<path d="M ${cx} ${cy - r * 0.95} L ${cx + r * 0.3} ${cy - r * 0.4} L ${cx + r * 0.85} ${cy - r * 0.5} L ${cx + r * 0.6} ${cy + r * 0.05} L ${cx + r * 0.75} ${cy + r * 0.5} L ${cx + r * 0.2} ${cy + r * 0.42} L ${cx} ${cy + r * 0.95} L ${cx - r * 0.2} ${cy + r * 0.42} L ${cx - r * 0.75} ${cy + r * 0.5} L ${cx - r * 0.6} ${cy + r * 0.05} L ${cx - r * 0.85} ${cy - r * 0.5} L ${cx - r * 0.3} ${cy - r * 0.4} Z" fill="${c}" stroke="${shade(c, 0.55)}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<line x1="${cx}" y1="${cy - r * 0.5}" x2="${cx}" y2="${cy + r * 0.6}" stroke="${shade(c, 0.5)}" stroke-width="1.6"/>`;
}

function snowflakeG(cx, cy, r, c) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r * 0.14}" fill="${c}"/>`;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const x2 = cx + Math.cos(a) * r * 0.95, y2 = cy + Math.sin(a) * r * 0.95;
    const xm = cx + Math.cos(a) * r * 0.55, ym = cy + Math.sin(a) * r * 0.55;
    const p = a + Math.PI / 2;
    s += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${Math.max(2.6, r * 0.13)}" stroke-linecap="round"/>` +
      `<line x1="${xm}" y1="${ym}" x2="${xm + Math.cos(p) * r * 0.22 + Math.cos(a) * r * 0.18}" y2="${ym + Math.sin(p) * r * 0.22 + Math.sin(a) * r * 0.18}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>` +
      `<line x1="${xm}" y1="${ym}" x2="${xm - Math.cos(p) * r * 0.22 + Math.cos(a) * r * 0.18}" y2="${ym - Math.sin(p) * r * 0.22 + Math.sin(a) * r * 0.18}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return s;
}

/* the four garden friends (winds) — fixed colours, distinct silhouettes */
const FRIENDS = [
  { glyph: butterflyG, color: '#4c6ef5', extra: 0 },
  { glyph: dragonflyG, color: '#0ca678' },
  { glyph: ladybugG,   color: '#e03131' },
  { glyph: beeG,       color: '#f59f00' }
];
/* flower group (34-37) and season group (38-41) — one grand motif each */
const BLOOMS = [
  { glyph: roseG,      color: '#d6336c' },
  { glyph: lotusG,     color: '#f06595' },
  { glyph: tulipG,     color: '#f08c00' },
  { glyph: sunflowerG, color: '#fab005' }
];
const SEASONS_ART = [
  { glyph: sproutG,    color: '#37b24d' },
  { glyph: sunG,       color: '#f59f00' },
  { glyph: mapleG,     color: '#e8590c' },
  { glyph: snowflakeG, color: '#4dabf7' }
];

function ribbon(color) {
  return `<rect x="7" y="5" width="86" height="15" rx="7.5" fill="${color}"/>` +
    `<circle cx="42" cy="12.5" r="2.1" fill="#fff" opacity="0.9"/>` +
    `<circle cx="50" cy="12.5" r="2.1" fill="#fff" opacity="0.9"/>` +
    `<circle cx="58" cy="12.5" r="2.1" fill="#fff" opacity="0.9"/>`;
}

const FACE_FONT = `font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"`;
const faceCache = new Map();

/* White-marble tile bodies, baked into the face image. Faces ship as <img>
   data-URIs because browser "force dark" modes rewrite CSS and inline SVG
   colours but never repaint image content — this makes the tiles immune to
   Chrome/Samsung auto-dark on any device.                                 */
const TILE_BODY = {
  gem:    { f1: '#ffffff', f2: '#e9e7de', rim: '#c2b28b', vein: '#b4bcc8' },
  zen:    { f1: '#fffdfd', f2: '#f3e5df', rim: '#d0a89a', vein: '#d3b4be' },
  nature: { f1: '#fdfff8', f2: '#eaeeda', rim: '#aab784', vein: '#b9c4a6' },
  gold:   { f1: '#ffeec2', f2: '#eac160', rim: '#a4791f', vein: '#d8b765' },
  ocean:  { f1: '#fbfeff', f2: '#e1edf3', rim: '#93b3c2', vein: '#b6cdd9' },
  night:  { f1: '#fffdf4', f2: '#ece2c8', rim: '#bfa45e', vein: '#cab98a' }
};

function tileBodySVG(themeKey) {
  const b = TILE_BODY[themeKey] || TILE_BODY.gem;
  return `<defs><linearGradient id="f" x1="0" y1="0" x2="0.55" y2="1">` +
    `<stop offset="0" stop-color="${b.f1}"/><stop offset="1" stop-color="${b.f2}"/></linearGradient></defs>` +
    `<rect x="1.2" y="1.2" width="97.6" height="117.6" rx="10" fill="url(#f)" stroke="${b.rim}" stroke-width="2.2"/>` +
    `<path d="M8,32 Q34,42 52,26 T96,32" fill="none" stroke="${b.vein}" stroke-width="1.6" opacity="0.45"/>` +
    `<path d="M4,88 Q30,74 58,86 T98,76" fill="none" stroke="${b.vein}" stroke-width="1.3" opacity="0.35"/>` +
    `<path d="M62,4 Q72,28 94,38" fill="none" stroke="${b.vein}" stroke-width="1.1" opacity="0.3"/>` +
    `<ellipse cx="30" cy="17" rx="33" ry="12" fill="#ffffff" opacity="0.55"/>`;
}

function faceSVG(kind) {
  const themeKey = Settings ? Settings.theme : 'gem';
  const cb = Settings ? Settings.colorblind : false;
  const cacheKey = themeKey + '|' + kind + '|' + (cb ? 1 : 0);
  if (faceCache.has(cacheKey)) return faceCache.get(cacheKey);

  const th = THEMES[themeKey];
  const k = KINDS[kind];
  let body = '';

  if (k.t === 's') {
    const set = th.suits[k.s];
    RANK_LAYOUT[k.r].forEach(([x, y, r], i) => {
      const c = set.colors[i % set.colors.length];
      body += SUIT_GLYPHS[set.key](x, y, r, c, set);
    });
    if (cb) body += `<text x="91" y="19" font-size="14" font-weight="800" text-anchor="end" ${FACE_FONT} fill="${shade(set.colors[0], 0.5)}">${set.letter}</text>`;
  } else if (k.t === 'w') {
    const fr = FRIENDS[k.i];
    body = `<circle cx="50" cy="60" r="44" fill="${fr.color}" opacity="0.1"/>` +
      fr.glyph(50, 60, 33, fr.color);
    if (cb) body += `<text x="91" y="19" font-size="14" font-weight="800" text-anchor="end" ${FACE_FONT} fill="${fr.color}">W</text>`;
  } else if (k.t === 'd') {
    body = butterflyG(50, 58, 36, th.wings[k.i], k.i + 1);
    if (cb) body += `<text x="91" y="19" font-size="14" font-weight="800" text-anchor="end" ${FACE_FONT} fill="${th.wings[k.i]}">D</text>`;
  } else {
    const isF = k.t === 'f';
    const art = isF ? BLOOMS[k.i] : SEASONS_ART[k.i];
    body = ribbon(isF ? FLOWER_RIBBON : SEASON_RIBBON) + art.glyph(50, 71, 33, art.color);
    if (cb) body += `<text x="91" y="38" font-size="14" font-weight="800" text-anchor="end" ${FACE_FONT} fill="${art.color}">${isF ? 'F' : 'S'}</text>`;
  }

  const svg = `<svg viewBox="0 0 100 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">` +
    tileBodySVG(themeKey) + body + `</svg>`;
  const img = `<img alt="" draggable="false" src="data:image/svg+xml,${encodeURIComponent(svg)}">`;
  faceCache.set(cacheKey, img);
  return img;
}

/* mini layout preview for the picker */
function layoutPreviewSVG(key) {
  const pos = buildLayout(key, makeRng('preview'));
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (const p of pos) {
    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + 2); maxY = Math.max(maxY, p.y + 2);
  }
  const w = maxX - minX, h = maxY - minY;
  let s = `<svg viewBox="-1 -1 ${w + 2} ${h + 2}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  const sorted = pos.slice().sort((a, b) => a.z - b.z || a.y - b.y);
  for (const p of sorted) {
    const op = 0.45 + p.z * 0.16;
    s += `<rect x="${p.x - minX - p.z * 0.25}" y="${p.y - minY - p.z * 0.25}" width="1.8" height="1.8" rx="0.35" fill="rgba(140,225,240,${clamp(op, 0, 1)})"/>`;
  }
  return s + '</svg>';
}

/* ───────────────────────── 7. Renderer & FX ───────────────────────── */

const UI = {};

function cacheUI() {
  const ids = ['splash', 'bg', 'petals', 'screen-menu', 'screen-game', 'board-wrap', 'board',
    'hud-mode', 'hud-timer', 'hud-moves', 'hud-score', 'hud-tiles',
    'btn-continue', 'continue-sub', 'btn-challenge', 'daily-badge', 'daily-sub', 'btn-install',
    'btn-igmenu', 'btn-home', 'btn-undo', 'btn-hint', 'btn-shuffle', 'btn-pause', 'hint-count', 'shuffle-count',
    'modal-root', 'modal-close', 'modal-backdrop', 'layout-grid', 'theme-grid', 'audio-panel',
    'settings-panel', 'stats-panel', 'btn-reset-stats', 'win-title',
    'win-stars', 'win-tally', 'win-best', 'btn-win-next', 'win-next-label',
    'win-nudge-row', 'btn-win-gentler', 'btn-win-harder', 'btn-win-ritual',
    'win-rate-row', 'btn-win-rate', 'btn-win-rate-dismiss',
    'voyage-sub', 'voyage-map', 'cal-prev', 'cal-next', 'cal-title', 'cal-week', 'cal-grid',
    'daily-streak', 'daily-total', 'daily-trophies', 'btn-daily-today',
    'daily-today-label', 'daily-today-sub', 'dealing',
    'btn-resume', 'btn-restart', 'btn-newboard', 'btn-quit', 'btn-pause-audio',
    'btn-win-new', 'btn-win-menu', 'btn-win-bonus', 'btn-win-share', 'btn-timeup-retry', 'btn-timeup-menu',
    'btn-stuck-shuffle', 'btn-stuck-undo', 'btn-stuck-restart',
    'btn-stuck-menu', 'stuck-note', 'stuck-shuffle-sub', 'fx-canvas', 'toast'];
  for (const id of ids) UI[id.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = document.getElementById(id);
}

const Renderer = {
  els: [],
  metrics: null,

  computeMetrics() {
    const tiles = Game.tiles;
    if (!tiles.length) return;
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, maxZ = 0;
    for (const t of tiles) {
      minX = Math.min(minX, t.x); minY = Math.min(minY, t.y);
      maxX = Math.max(maxX, t.x + 2); maxY = Math.max(maxY, t.y + 2);
      maxZ = Math.max(maxZ, t.z);
    }
    const wrap = UI.boardWrap;
    const availW = wrap.clientWidth - 4, availH = wrap.clientHeight - 4;
    const cols = (maxX - minX) / 2, rows = (maxY - minY) / 2;
    const ratio = 1.18;
    let tw = Math.min(availW / (cols + maxZ * 0.11 + 0.04), (availH / (rows + maxZ * 0.1 + 0.04)) / ratio);
    tw = Math.floor(clamp(tw * (Settings.tileScale || 1), 24, 170));
    const th = Math.floor(tw * ratio);
    const offX = tw * 0.12, offY = th * 0.105;
    this.metrics = { tw, th, offX, offY, minX, minY, maxZ };
    UI.board.style.width = (cols * tw + maxZ * offX + 8) + 'px';
    UI.board.style.height = (rows * th + maxZ * offY + 8) + 'px';
    UI.board.style.setProperty('--tw', tw + 'px');
  },

  place(el, t) {
    const m = this.metrics;
    el.style.left = (((t.x - m.minX) / 2) * m.tw + m.maxZ * m.offX - t.z * m.offX + 4) + 'px';
    el.style.top = (((t.y - m.minY) / 2) * m.th - t.z * m.offY + 4) + 'px';
    el.style.width = m.tw + 'px';
    el.style.height = m.th + 'px';
    el.style.zIndex = t.z * 100000 + (t.y + 20) * 100 + t.x;
    el.style.setProperty('--tw', m.tw + 'px');
  },

  buildBoard(animateIn) {
    this.computeMetrics();
    UI.board.textContent = '';
    this.els = [];
    const frag = document.createDocumentFragment();
    for (const t of Game.tiles) {
      const el = document.createElement('button');
      el.className = 'tile';
      el.dataset.i = t.i;
      el.innerHTML = faceSVG(t.kind);
      this.place(el, t);
      if (t.removed) el.classList.add('gone');
      else if (animateIn && !Settings.reducedMotion) {
        el.classList.add('in');
        el.style.animationDelay = Math.min(t.i * 4, 480) + 'ms';
      }
      frag.appendChild(el);
      this.els.push(el);
    }
    UI.board.appendChild(frag);
    this.updateOpenStates();
    this.centerScroll();
  },

  relayout() {
    if (!Game.tiles.length) return;
    this.computeMetrics();
    for (let i = 0; i < this.els.length; i++) this.place(this.els[i], Game.tiles[i]);
    this.centerScroll();
  },

  centerScroll() {
    const w = UI.boardWrap;
    w.scrollLeft = Math.max(0, (w.scrollWidth - w.clientWidth) / 2);
    w.scrollTop = Math.max(0, (w.scrollHeight - w.clientHeight) / 2);
  },

  refreshFaces() {
    for (let i = 0; i < this.els.length; i++) this.els[i].innerHTML = faceSVG(Game.tiles[i].kind);
  },

  setClass(i, cls, on) { const el = this.els[i]; if (el) el.classList.toggle(cls, on); },

  /* fade tiles that can't be played yet (assist, toggleable in Options) */
  updateOpenStates() {
    if (!Game.tiles.length || !this.els.length) return;
    const dim = Settings.dimBlocked;
    const present = tilesPresent(Game.tiles);
    for (let i = 0; i < this.els.length; i++) {
      const t = Game.tiles[i];
      const blocked = dim && !t.removed && !isOpenAt(i, Game.tiles, present);
      this.els[i].classList.toggle('blocked', blocked);
    }
  },

  /* match sequence: golden charge-up → tiles slam together → blast there */
  removePair(a, b) {
    const ca = this.tileCenter(a), cb = this.tileCenter(b);
    const mx = (ca[0] + cb[0]) / 2, my = (ca[1] + cb[1]) / 2;
    const rm = Settings.reducedMotion;
    [[a, ca], [b, cb]].forEach(([i, c]) => {
      const el = this.els[i];
      el.classList.remove('sel', 'hint');
      el.style.zIndex = 1000000;
      if (rm) { el.classList.add('out', 'gone'); return; }
      el.classList.add('flash');
      el.style.setProperty('--fx', (mx - c[0]) + 'px');
      el.style.setProperty('--fy', (my - c[1]) + 'px');
      setTimeout(() => el.classList.add('out'), 130);
      setTimeout(() => el.classList.add('gone'), 470);
    });
    return [mx, my];
  },

  restoreTile(i) {
    const el = this.els[i];
    el.classList.remove('gone', 'out', 'sel', 'hint', 'flash');
    el.style.removeProperty('--fx');
    el.style.removeProperty('--fy');
    this.place(el, Game.tiles[i]);                 // also resets the boosted zIndex
    if (!Settings.reducedMotion) {
      el.classList.add('in');
      el.style.animationDelay = '0ms';
      setTimeout(() => el.classList.remove('in'), 360);
    }
  },

  clearMarks() {
    for (const el of this.els) el.classList.remove('sel', 'hint');
  },

  tileCenter(i) {
    const el = this.els[i];
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  }
};

/* particle bursts — canvas only runs while particles are alive */
const FX = {
  cv: null, ctx: null, parts: [], raf: 0,

  init() {
    this.cv = UI.fxCanvas;
    this.ctx = this.cv.getContext('2d');
    this.resize();
  },
  resize() {
    if (!this.cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = Math.round(innerWidth * dpr);
    this.cv.height = Math.round(innerHeight * dpr);
    this.cv.style.width = innerWidth + 'px';
    this.cv.style.height = innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },
  burst(x, y, colors, n, spMin, spMax) {
    if (Settings.reducedMotion) return;
    const lo = spMin != null ? spMin : 1.4, hi = spMax != null ? spMax : 4.6;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = lo + Math.random() * (hi - lo);
      this.parts.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.6,
        life: 1, decay: 0.018 + Math.random() * 0.02,
        r: 1.6 + Math.random() * 2.6,
        c: colors[(Math.random() * colors.length) | 0],
        spin: Math.random() * Math.PI
      });
    }
    if (!this.raf) this.loop();
  },

  /* fast white streaks shooting out of the blast core */
  streaks(x, y, n) {
    if (Settings.reducedMotion) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 5 + Math.random() * 3.5;
      this.parts.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, decay: 0.05 + Math.random() * 0.03,
        r: 1.4, c: '#fff', spin: 0, streak: true
      });
    }
    if (!this.raf) this.loop();
  },

  /* the Solitaire-Mahjong-style detonation at the meeting point */
  blast(x, y) {
    if (Settings.reducedMotion) return;
    spawnFx(x, y, 'match-ring');
    spawnFx(x, y, 'blast-glow');
    this.burst(x, y, ['#ffd86b', '#ffe9a8', '#fff'], 18, 2.2, 5.6);
    this.burst(x, y, ['#7be8f4', '#ff9ec6', '#c9a7ff'], 14, 1.1, 3);
    this.streaks(x, y, 10);
  },
  confetti() {
    if (Settings.reducedMotion) return;
    const cols = ['#7be8f4', '#ffd86b', '#ff9ec6', '#8ef29a', '#c9a7ff'];
    for (let k = 0; k < 5; k++) {
      setTimeout(() => this.burst(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.15 + Math.random() * 0.3), cols, 26), k * 180);
    }
  },
  loop() {
    this.raf = requestAnimationFrame(() => this.loop());
    const ctx = this.ctx;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const alive = [];
    for (const p of this.parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.09;
      p.life -= p.decay; p.spin += 0.1;
      if (p.life <= 0) continue;
      alive.push(p);
      ctx.globalAlpha = Math.max(0, p.life);
      if (p.streak) {
        ctx.strokeStyle = p.c;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2.6, p.y - p.vy * 2.6);
        ctx.stroke();
        continue;
      }
      ctx.fillStyle = p.c;
      ctx.beginPath();
      const r = p.r * (0.5 + p.life * 0.6);
      ctx.moveTo(p.x, p.y - r * 1.6);
      ctx.lineTo(p.x + r * 0.55, p.y); ctx.lineTo(p.x, p.y + r * 1.6); ctx.lineTo(p.x - r * 0.55, p.y);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.parts = alive;
    if (!alive.length) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }
};

/* decorative petals — pure CSS animation, spawned once */
function spawnPetals() {
  const host = UI.petals;
  host.textContent = '';
  const palettes = {
    gem: ['#9fe9f4', '#5fc9dd'], zen: ['#ffd9e8', '#e892b9'],
    nature: ['#cdebb3', '#9ccf86'], gold: ['#f4df9f', '#d9b45e'],
    ocean: ['#a8e4f4', '#5fb3dd'], night: ['#ffe9a8', '#b9a2e8']
  };
  const [c1, c2] = palettes[Settings.theme] || palettes.gem;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    p.style.setProperty('--x', (4 + Math.random() * 92) + 'vw');
    p.style.setProperty('--s', (9 + Math.random() * 12) + 'px');
    p.style.setProperty('--d', (13 + Math.random() * 14) + 's');
    p.style.setProperty('--dl', (-Math.random() * 20) + 's');
    p.style.setProperty('--sw', (Math.random() * 12 - 6) + 'vw');
    p.style.setProperty('--pc1', c1);
    p.style.setProperty('--pc2', c2);
    host.appendChild(p);
  }
}

/* ───────────────────────── 8. Audio engine ─────────────────────────
   Everything is synthesized live with the Web Audio API — no files, no
   network, fully offline. Mix buses: master → rain/thunder/nature/zen/fx.
   Each ambient sound is a "voice": fade-in on start, fade-out on stop,
   schedulers are cancelled immediately so nothing leaks.              */

const AudioEngine = {
  ctx: null, buses: null, noise: {}, active: new Map(), unlocked: false,

  ensure() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    const mk = () => { const g = this.ctx.createGain(); return g; };
    const master = mk(); master.connect(this.ctx.destination);
    this.buses = { master };
    for (const b of ['rain', 'thunder', 'nature', 'zen', 'music', 'fx']) {
      const g = mk(); g.connect(master); this.buses[b] = g;
    }
    for (const b of Object.keys(this.buses)) this.applyBus(b);
    this.noise.white = this.makeNoise(false);
    this.noise.pink = this.makeNoise(true);
    return true;
  },

  makeNoise(pink) {
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    if (!pink) {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } else {
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + 0.0299 * w;
        b1 = 0.985 * b1 + 0.0563 * w;
        b2 = 0.95 * b2 + 0.115 * w;
        d[i] = (b0 + b1 + b2 + w * 0.05) * 2.1;
      }
    }
    return buf;
  },

  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => { }); },

  applyBus(name) {
    if (!this.ctx) return;
    const v = Settings.vol[name] != null ? Settings.vol[name] : 1;
    this.buses[name].gain.setTargetAtTime(v * v, this.ctx.currentTime, 0.06);
  },

  unlock() {
    if (!this.ensure()) return;
    this.resume();
    if (!this.unlocked) {
      this.unlocked = true;
      for (const id of (Settings.activeSounds || [])) {
        if (SOUND_DEFS.some(s => s.id === id) && !this.active.has(id)) this.start(id, true);
      }
    }
  },

  toggle(id) {
    if (!this.ensure()) { showToast('Audio is not available on this device'); return false; }
    this.resume();
    if (this.active.has(id)) { this.stop(id); return false; }
    this.start(id);
    return true;
  },

  start(id, silentFail) {
    const def = SOUND_DEFS.find(s => s.id === id);
    if (!def || this.active.has(id)) return;
    try {
      const voice = makeVoice(this.ctx, this.buses[def.bus], def.level);
      def.make(this, voice);
      this.active.set(id, voice);
    } catch (e) { if (!silentFail) showToast('Could not start that sound'); }
  },

  stop(id) {
    const v = this.active.get(id);
    if (!v) return;
    this.active.delete(id);
    killVoice(this.ctx, v);
  },

  /* ——— short game SFX (fx bus) ——— */
  sfx(name, opt) {
    if (!Settings || Settings.vol.fx <= 0) return;
    if (!this.ensure()) return;
    this.resume();
    const ctx = this.ctx, out = this.buses.fx, t = ctx.currentTime;
    const tone = (freq, t0, dur, peak, type, slideTo) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(out);
      o.start(t0); o.stop(t0 + dur + 0.05);
    };
    switch (name) {
      case 'click': tone(1250, t, 0.05, 0.022, 'triangle'); break;
      case 'select': tone(740, t, 0.09, 0.05); break;
      case 'match': {
        // pentatonic ladder — each chained match plays the next step up
        const LADDER = [587.33, 659.25, 783.99, 880, 987.77, 1174.66, 1318.51, 1567.98];
        const f = LADDER[Math.min(Math.max((opt || 1) - 1, 0), LADDER.length - 1)];
        tone(f, t, 0.3, 0.1);
        tone(f * 1.5, t + 0.06, 0.34, 0.07);
        break;
      }
      case 'invalid': tone(170, t, 0.16, 0.07, 'triangle', 120); break;
      case 'undo': tone(520, t, 0.14, 0.05, 'sine', 380); break;
      case 'shuffle': {
        const src = ctx.createBufferSource(); src.buffer = this.noise.white;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4;
        f.frequency.setValueAtTime(420, t);
        f.frequency.exponentialRampToValueAtTime(2600, t + 0.32);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        src.connect(f); f.connect(g); g.connect(out);
        src.start(t); src.stop(t + 0.45);
        break;
      }
      case 'win': {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          tone(f, t + i * 0.13, 0.6, 0.09);
          tone(f * 2, t + i * 0.13, 0.3, 0.025);
        });
        break;
      }
      case 'star': {
        const f = 659.25 * Math.pow(1.335, opt || 0);   // rising fourth per star
        tone(f, t, 0.55, 0.12);
        tone(f * 2, t + 0.02, 0.3, 0.04);
        break;
      }
    }
  }
};

function makeVoice(ctx, bus, level) {
  const out = ctx.createGain();
  out.gain.value = 0;
  out.connect(bus);
  out.gain.setTargetAtTime(level != null ? level : 1, ctx.currentTime, 1.2);
  return { out, srcs: [], slots: [], alive: true };
}
function killVoice(ctx, v) {
  v.alive = false;
  for (const s of v.slots) clearTimeout(s.id);
  v.out.gain.cancelScheduledValues(ctx.currentTime);
  v.out.gain.setTargetAtTime(0, ctx.currentTime, 0.45);
  setTimeout(() => {
    for (const s of v.srcs) { try { s.stop(); } catch (e) { } try { s.disconnect(); } catch (e) { } }
    try { v.out.disconnect(); } catch (e) { }
  }, 2200);
}
/* recurring randomized scheduler bound to a voice's lifetime */
function vSchedule(voice, fn, minMs, maxMs, firstMaxMs) {
  const slot = { id: 0 };
  voice.slots.push(slot);
  const next = (ms) => {
    slot.id = setTimeout(() => {
      if (!voice.alive) return;
      fn();
      next(minMs + Math.random() * (maxMs - minMs));
    }, ms);
  };
  next(400 + Math.random() * (firstMaxMs != null ? firstMaxMs : Math.min(maxMs, 4000)));
}
/* looped noise through a filter chain, returns the output gain node */
function noiseChain(E, voice, pink, filters, gainVal) {
  const src = E.ctx.createBufferSource();
  src.buffer = pink ? E.noise.pink : E.noise.white;
  src.loop = true;
  let node = src;
  for (const f of filters) {
    const bq = E.ctx.createBiquadFilter();
    bq.type = f.type; bq.frequency.value = f.freq;
    if (f.q != null) bq.Q.value = f.q;
    node.connect(bq); node = bq;
    if (f.ref) f.ref(bq);
  }
  const g = E.ctx.createGain();
  g.gain.value = gainVal;
  node.connect(g); g.connect(voice.out);
  src.start();
  voice.srcs.push(src);
  return g;
}
function lfo(E, voice, rateHz, depth, target, type) {
  const o = E.ctx.createOscillator(), g = E.ctx.createGain();
  o.type = type || 'sine'; o.frequency.value = rateHz;
  g.gain.value = depth;
  o.connect(g); g.connect(target);
  o.start();
  voice.srcs.push(o);
}
/* one-shot percussive noise burst (drips, rustles, patter) */
function noiseBurst(E, voice, opts) {
  const ctx = E.ctx, t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = E.noise.white;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = opts.type || 'bandpass';
  f.frequency.value = opts.freq; f.Q.value = opts.q || 2;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(opts.peak, t + (opts.attack || 0.01));
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  src.connect(f); f.connect(g); g.connect(voice.out);
  src.start(t, Math.random() * 1.5);
  src.stop(t + opts.dur + 0.1);
}
function pannedTone(E, voice, opts) {
  const ctx = E.ctx, t0 = opts.at != null ? opts.at : ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = opts.type || 'sine';
  o.frequency.setValueAtTime(opts.freq, t0);
  if (opts.bend) {
    for (const [dt, f] of opts.bend) o.frequency.linearRampToValueAtTime(f, t0 + dt);
  }
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(opts.peak, t0 + (opts.attack || 0.015));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
  o.connect(g);
  let tail = g;
  if (opts.pan != null && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner(); p.pan.value = opts.pan;
    g.connect(p); tail = p;
  }
  tail.connect(voice.out);
  o.start(t0); o.stop(t0 + opts.dur + 0.1);
}

/* Thunder is double-layered: a deep rumble for real speakers AND a pink-noise
   mid band (~200–500 Hz) so it still carries on phone speakers, which cannot
   reproduce energy below ~200 Hz at all. Closer storms add an onset crack.  */
function thunderRumble(E, voice, opts) {
  const ctx = E.ctx, t = ctx.currentTime;
  const dur = opts.decMin + Math.random() * (opts.decMax - opts.decMin);
  const strike = (t0, peak) => {
    const src = ctx.createBufferSource();
    src.buffer = E.noise.white; src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(opts.freq + 60 + Math.random() * 80, t0);
    lp.frequency.exponentialRampToValueAtTime(Math.max(50, opts.freq * 0.45), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.07 + Math.random() * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(lp); lp.connect(g); g.connect(voice.out);
    src.start(t0, Math.random() * 1.5); src.stop(t0 + dur + 0.2);

    const src2 = ctx.createBufferSource();
    src2.buffer = E.noise.pink; src2.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(420 + Math.random() * 120, t0);
    bp.frequency.exponentialRampToValueAtTime(190, t0 + dur * 0.8);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, t0);
    g2.gain.linearRampToValueAtTime(peak * 0.6, t0 + 0.05 + Math.random() * 0.15);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.85);
    src2.connect(bp); bp.connect(g2); g2.connect(voice.out);
    src2.start(t0, Math.random() * 1.5); src2.stop(t0 + dur);
  };
  strike(t + 0.02, opts.gain * (0.75 + Math.random() * 0.35));
  if (Math.random() < 0.55) strike(t + 0.5 + Math.random() * 1.2, opts.gain * 0.45);
  if (opts.crack) {
    noiseBurst(E, voice, { freq: 2400 + Math.random() * 1200, peak: opts.gain * 0.28, dur: 0.18, q: 1.2, attack: 0.005 });
  }
}

/* soft piano voice: slightly inharmonic partials, fast attack, long decay */
function pianoNote(E, v, freq, t0, peak, dur, pan) {
  const ctx = E.ctx;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 2400;
  g.connect(lp);
  let tail = lp;
  if (pan != null && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner(); p.pan.value = pan;
    lp.connect(p); tail = p;
  }
  tail.connect(v.out);
  for (const [m, a] of [[1, 1], [2.001, 0.45], [2.997, 0.16], [4.003, 0.06]]) {
    const o = ctx.createOscillator();
    o.frequency.value = freq * m;
    const og = ctx.createGain(); og.gain.value = a;
    o.connect(og); og.connect(g);
    o.start(t0); o.stop(t0 + dur + 0.1);
  }
}

const SOUND_DEFS = [
  /* ——— Rain ——— */
  {
    id: 'rain-light', label: 'Light Rain', bus: 'rain', level: 1,
    make(E, v) {
      noiseChain(E, v, false, [{ type: 'highpass', freq: 4200 }, { type: 'lowpass', freq: 9500 }], 0.16);
      vSchedule(v, () => noiseBurst(E, v, { freq: 3200 + Math.random() * 4000, peak: 0.035, dur: 0.05, q: 6 }), 180, 700, 1000);
    }
  },
  {
    id: 'rain-forest', label: 'Forest Rain', bus: 'rain', level: 1,
    make(E, v) {
      const g = noiseChain(E, v, false, [{ type: 'bandpass', freq: 3600, q: 0.6 }], 0.26);
      lfo(E, v, 4.7, 0.05, g.gain);
      noiseChain(E, v, true, [{ type: 'lowpass', freq: 900 }], 0.07);
      vSchedule(v, () => noiseBurst(E, v, { freq: 1400 + Math.random() * 1800, peak: 0.05, dur: 0.08, q: 4 }), 250, 1100, 1500);
    }
  },
  {
    id: 'rain-window', label: 'Window Rain', bus: 'rain', level: 1,
    make(E, v) {
      noiseChain(E, v, true, [{ type: 'lowpass', freq: 1500 }], 0.34);
      vSchedule(v, () => pannedTone(E, v, {
        freq: 1100 + Math.random() * 800, bend: [[0.12, 420 + Math.random() * 200]],
        peak: 0.035, dur: 0.15, pan: Math.random() * 1.4 - 0.7
      }), 350, 2200, 2000);
    }
  },
  {
    id: 'rain-heavy', label: 'Heavy Rain', bus: 'rain', level: 1,
    make(E, v) {
      noiseChain(E, v, false, [{ type: 'lowpass', freq: 6800 }], 0.4);
      noiseChain(E, v, false, [{ type: 'lowpass', freq: 280 }], 0.14);
      vSchedule(v, () => noiseBurst(E, v, { freq: 2000 + Math.random() * 5000, peak: 0.06, dur: 0.05, q: 5 }), 90, 320, 600);
    }
  },
  /* ——— Thunder (first rumble lands within ~1.5s so the toggle feels alive) ——— */
  {
    id: 'thunder-distant', label: 'Distant Thunder', bus: 'thunder', level: 1,
    make(E, v) { vSchedule(v, () => thunderRumble(E, v, { freq: 140, gain: 0.42, decMin: 2.5, decMax: 5 }), 14000, 36000, 1100); }
  },
  {
    id: 'thunder-rolling', label: 'Rolling Storm', bus: 'thunder', level: 1,
    make(E, v) {
      noiseChain(E, v, true, [{ type: 'bandpass', freq: 240, q: 0.5 }], 0.07);
      vSchedule(v, () => thunderRumble(E, v, { freq: 210, gain: 0.62, decMin: 3.5, decMax: 7, crack: true }), 9000, 22000, 900);
    }
  },
  {
    id: 'thunder-night', label: 'Night Thunder', bus: 'thunder', level: 1,
    make(E, v) { vSchedule(v, () => thunderRumble(E, v, { freq: 115, gain: 0.5, decMin: 4, decMax: 8 }), 22000, 55000, 1400); }
  },
  /* ——— Nature ——— */
  {
    id: 'nat-forest', label: 'Forest', bus: 'nature', level: 1,
    make(E, v) {
      let windF = null;
      noiseChain(E, v, true, [{ type: 'lowpass', freq: 1000, ref: f => windF = f }], 0.22);
      lfo(E, v, 0.06, 320, windF.frequency);
      vSchedule(v, () => noiseBurst(E, v, { freq: 2700, peak: 0.04, dur: 0.4, q: 1.5, attack: 0.15 }), 5000, 14000);
      vSchedule(v, () => birdChirp(E, v, 0.03), 9000, 24000);
    }
  },
  {
    id: 'nat-ocean', label: 'Ocean Waves', bus: 'nature', level: 1,
    make(E, v) {
      let f = null;
      const g = noiseChain(E, v, false, [{ type: 'lowpass', freq: 520, q: 0.4, ref: x => f = x }], 0.3);
      lfo(E, v, 0.065, 280, f.frequency);
      lfo(E, v, 0.065, 0.17, g.gain);
      const g2 = noiseChain(E, v, false, [{ type: 'lowpass', freq: 1400 }], 0.05);
      lfo(E, v, 0.11, 0.04, g2.gain);
    }
  },
  {
    id: 'nat-waterfall', label: 'Waterfall', bus: 'nature', level: 1,
    make(E, v) {
      noiseChain(E, v, false, [{ type: 'bandpass', freq: 950, q: 0.5 }], 0.34);
      noiseChain(E, v, true, [{ type: 'lowpass', freq: 240 }], 0.12);
    }
  },
  {
    id: 'nat-birds', label: 'Birdsong', bus: 'nature', level: 1,
    make(E, v) {
      vSchedule(v, () => {
        const n = 1 + (Math.random() * 3 | 0);
        for (let i = 0; i < n; i++) setTimeout(() => v.alive && birdChirp(E, v, 0.05), i * (140 + Math.random() * 240));
      }, 1800, 6500, 1500);
    }
  },
  /* ——— Zen ——— */
  {
    id: 'zen-chimes', label: 'Wind Chimes', bus: 'zen', level: 1,
    make(E, v) {
      const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
      vSchedule(v, () => {
        const n = 1 + (Math.random() * 4 | 0);
        for (let i = 0; i < n; i++) {
          setTimeout(() => {
            if (!v.alive) return;
            const f = notes[(Math.random() * notes.length) | 0];
            const pan = Math.random() * 1.2 - 0.6;
            pannedTone(E, v, { freq: f, peak: 0.075, dur: 3.5 + Math.random() * 1.8, pan });
            pannedTone(E, v, { freq: f * 2.41, peak: 0.02, dur: 1.8, pan });
          }, i * (110 + Math.random() * 420));
        }
      }, 4500, 13000, 2500);
    }
  },
  {
    id: 'zen-tones', label: 'Meditation Tones', bus: 'zen', level: 1,
    make(E, v) {
      const ctx = E.ctx;
      const drone = (freq, gv) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = freq; g.gain.value = gv;
        o.connect(g); g.connect(v.out);
        o.start(); v.srcs.push(o);
        return g;
      };
      const g1 = drone(110, 0.085); drone(110.6, 0.06); drone(220, 0.028);
      lfo(E, v, 0.03, 0.025, g1.gain);
      vSchedule(v, () => {
        pannedTone(E, v, { freq: 264, peak: 0.06, dur: 7, attack: 0.04 });
        pannedTone(E, v, { freq: 528, peak: 0.02, dur: 5 });
        pannedTone(E, v, { freq: 792.5, peak: 0.008, dur: 3.5 });
      }, 22000, 42000, 9000);
    }
  },
  /* ——— Spa ——— */
  {
    id: 'zen-stream', label: 'Stream', bus: 'zen', level: 1,
    make(E, v) {
      let bp = null;
      noiseChain(E, v, false, [{ type: 'bandpass', freq: 1100, q: 0.8, ref: f => bp = f }], 0.22);
      lfo(E, v, 0.27, 160, bp.frequency);
      noiseChain(E, v, true, [{ type: 'lowpass', freq: 500 }], 0.1);
      vSchedule(v, () => pannedTone(E, v, {
        freq: 520 + Math.random() * 260, bend: [[0.09, 240 + Math.random() * 120]],
        peak: 0.028, dur: 0.12, pan: Math.random() * 1.2 - 0.6
      }), 280, 1100, 800);
    }
  },
  {
    id: 'zen-crickets', label: 'Night Crickets', bus: 'zen', level: 1,
    make(E, v) {
      noiseChain(E, v, true, [{ type: 'lowpass', freq: 420 }], 0.05);
      const trill = () => {
        const t0 = E.ctx.currentTime + 0.03;
        const f = 4100 + Math.random() * 500, pan = Math.random() * 1.2 - 0.6;
        const pulses = 4 + (Math.random() * 4 | 0);
        for (let k = 0; k < pulses; k++) {
          pannedTone(E, v, { at: t0 + k * 0.045, freq: f, peak: 0.016, dur: 0.03, attack: 0.005, pan });
        }
      };
      vSchedule(v, trill, 700, 1900, 900);
      vSchedule(v, trill, 1100, 2600, 1500);
    }
  },
  {
    id: 'zen-breeze', label: 'Soft Breeze', bus: 'zen', level: 1,
    make(E, v) {
      let lp = null;
      const g = noiseChain(E, v, true, [{ type: 'lowpass', freq: 640, ref: f => lp = f }], 0.2);
      lfo(E, v, 0.05, 260, lp.frequency);
      lfo(E, v, 0.08, 0.07, g.gain);
    }
  },
  /* ——— Music ——— */
  {
    id: 'music-piano', label: 'Gentle Piano', bus: 'music', level: 1,
    make(E, v) {
      const ctx = E.ctx;
      const CHORDS = [
        { bass: 130.81, tones: [261.63, 329.63, 392, 493.88] },   // Cmaj7
        { bass: 110,    tones: [220, 261.63, 329.63, 392] },      // Am7
        { bass: 87.31,  tones: [174.61, 220, 261.63, 329.63] },   // Fmaj7
        { bass: 98,     tones: [196, 246.94, 293.66, 392] }       // G
      ];
      const PENTA = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];
      let ci = 0, mi = 4;
      const chordPlay = () => {
        const ch = CHORDS[ci % CHORDS.length]; ci++;
        const t0 = ctx.currentTime + 0.05;
        pianoNote(E, v, ch.bass, t0, 0.05, 6);
        ch.tones.slice(0, 3).forEach((f, k) => pianoNote(E, v, f, t0 + 0.25 + k * 0.35, 0.03, 5, (k - 1) * 0.3));
      };
      chordPlay();
      vSchedule(v, chordPlay, 9000, 14000, 9000);
      vSchedule(v, () => {
        const t0 = ctx.currentTime + 0.05;
        const n = 1 + (Math.random() * 3 | 0);
        for (let k = 0; k < n; k++) {
          mi = clamp(mi + ((Math.random() * 5 | 0) - 2), 0, PENTA.length - 1);
          pianoNote(E, v, PENTA[mi], t0 + k * (0.45 + Math.random() * 0.4), 0.055, 4, Math.random() * 0.8 - 0.4);
        }
      }, 2200, 5200, 1200);
    }
  },
  {
    id: 'music-box', label: 'Music Box', bus: 'music', level: 1,
    make(E, v) {
      const NOTES = [1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093];
      vSchedule(v, () => {
        const t0 = E.ctx.currentTime + 0.05;
        const len = 2 + (Math.random() * 3 | 0);
        let idx = 2 + (Math.random() * 3 | 0);
        for (let k = 0; k < len; k++) {
          idx = clamp(idx + (Math.random() < 0.65 ? -1 : 1), 0, NOTES.length - 1);
          const pan = Math.random() * 0.8 - 0.4;
          pannedTone(E, v, { at: t0 + k * 0.42, freq: NOTES[idx], peak: 0.05, dur: 2.6, pan });
          pannedTone(E, v, { at: t0 + k * 0.42, freq: NOTES[idx] * 2.41, peak: 0.012, dur: 1.2, pan });
        }
      }, 3800, 7600, 1500);
    }
  },
  {
    id: 'zen-pads', label: 'Ambient Pads', bus: 'zen', level: 1,
    make(E, v) {
      const ctx = E.ctx;
      const CHORDS = [
        [110, 220, 329.63, 440],
        [98, 196, 293.66, 392],
        [87.31, 174.61, 261.63, 349.23]
      ];
      let ci = 0, current = null;
      const playChord = () => {
        const old = current;
        const cg = ctx.createGain();
        cg.gain.value = 0;
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass'; f.frequency.value = 750;
        cg.connect(f); f.connect(v.out);
        lfo(E, v, 0.045, 220, f.frequency);
        const oscs = [];
        for (const fr of CHORDS[ci]) {
          for (const det of [-4, 4]) {
            const o = ctx.createOscillator();
            o.type = 'triangle'; o.frequency.value = fr; o.detune.value = det;
            const og = ctx.createGain(); og.gain.value = 0.03;
            o.connect(og); og.connect(cg);
            o.start(); v.srcs.push(o); oscs.push(o);
          }
        }
        cg.gain.setTargetAtTime(1, ctx.currentTime, 3.2);
        if (old) {
          old.g.gain.setTargetAtTime(0, ctx.currentTime, 3.2);
          setTimeout(() => { for (const o of old.oscs) { try { o.stop(); } catch (e) { } } try { old.g.disconnect(); } catch (e) { } }, 14000);
        }
        current = { g: cg, oscs };
        ci = (ci + 1) % CHORDS.length;
      };
      playChord();
      vSchedule(v, playChord, 26000, 34000, 28000);
    }
  }
];

function birdChirp(E, v, peak) {
  const f0 = 2300 + Math.random() * 1900;
  const dur = 0.1 + Math.random() * 0.12;
  pannedTone(E, v, {
    freq: f0,
    bend: [[dur * 0.4, f0 * (1.15 + Math.random() * 0.2)], [dur, f0 * 0.92]],
    peak, dur, pan: Math.random() * 1.4 - 0.7
  });
}

const SOUND_GROUPS = [
  { bus: 'master', icon: '🔊', label: 'Master' },
  { bus: 'rain', icon: '🌧️', label: 'Rain' },
  { bus: 'thunder', icon: '⛈️', label: 'Thunder' },
  { bus: 'nature', icon: '🌿', label: 'Nature' },
  { bus: 'zen', icon: '🧘', label: 'Zen & Spa' },
  { bus: 'music', icon: '🎹', label: 'Music' },
  { bus: 'fx', icon: '✨', label: 'Effects' }
];

/* ───────────────────────── 9. Game controller ───────────────────────── */

const MODE_CFG = {
  classic: { label: 'Classic', hints: -1, shuffles: -1, hintPenalty: 50, shufflePenalty: 200, mult: 1 },
  daily: { label: 'Daily', hints: 3, shuffles: 2, hintPenalty: 100, shufflePenalty: 300, mult: 1.5 },
  relax: { label: 'Relax', hints: -1, shuffles: -1, hintPenalty: 0, shufflePenalty: 0, mult: 1 },
  expert: { label: 'Expert', hints: 3, shuffles: 1, hintPenalty: 150, shufflePenalty: 400, mult: 2 },
  voyage: { label: 'Voyage', hints: -1, shuffles: -1, hintPenalty: 75, shufflePenalty: 250, mult: 1.5 },
  bonus: { label: 'Bonus Dive', hints: 1, shuffles: -1, hintPenalty: 0, shufflePenalty: 0, mult: 2 }
};
const BONUS_TIME = 90;   // seconds to clear the dive and surface with a pearl

/* ── Ocean Voyage: 30 levels, calm waters → tempest ── */
const VOYAGE_SEQ = ['garden', 'lotus', 'pyramid', 'butterfly', 'dragon', 'castle', 'turtle2', 'turtle', 'random'];
const VOYAGE_LEVELS = [];
for (let i = 0; i < 30; i++) {
  VOYAGE_LEVELS.push({
    layout: VOYAGE_SEQ[Math.floor(i * VOYAGE_SEQ.length / 30)],
    target: i / 29,
    hints: i < 10 ? -1 : i < 20 ? 5 : 3,
    shuffles: i < 10 ? -1 : i < 20 ? 2 : 1
  });
}
function voyageCurrentLevel() {
  for (let i = 0; i < VOYAGE_LEVELS.length; i++) if (!(Stats.voyage[i] > 0)) return i;
  return VOYAGE_LEVELS.length - 1;
}
function voyageTotalStars() {
  let n = 0;
  for (const k in Stats.voyage) n += Stats.voyage[k] | 0;
  return n;
}

/* ── Dealer: difficulty-curated deals off the main thread ──
   The Worker is assembled from the engine functions' own source; if Workers
   are unavailable the same chooseDeal runs synchronously, so results are
   identical (and daily boards stay deterministic) either way.            */
const DEAL_CANDIDATES = 12;

function dealerWorkerSrc() {
  const fns = [xmur3, mulberry32, makeRng, shuffleArr, matchKeyOf, buildPairPool,
    isOpenAt, dealSolvable, playoutOnce, scoreDeal, chooseDeal];
  return fns.map(f => f.toString()).join('\n') +
    '\nself.onmessage=function(e){var d=e.data;var r=chooseDeal(d.positions,d.seed,d.target,d.count);' +
    'self.postMessage({id:d.id,ok:!!r,kinds:r&&r.kinds,winRate:r?r.winRate:null});};';
}

const Dealer = {
  worker: null, failed: false, pending: new Map(), nextId: 1,

  init() {
    if (this.worker || this.failed) return;
    try {
      if (typeof Worker !== 'function' || typeof Blob !== 'function') { this.failed = true; return; }
      const url = URL.createObjectURL(new Blob([dealerWorkerSrc()], { type: 'text/javascript' }));
      this.worker = new Worker(url);
      this.worker.onmessage = e => {
        const cb = this.pending.get(e.data.id);
        if (!cb) return;
        this.pending.delete(e.data.id);
        cb(e.data.ok ? { kinds: e.data.kinds, winRate: e.data.winRate } : null);
      };
      this.worker.onerror = () => {
        this.failed = true;
        try { this.worker.terminate(); } catch (e) { }
        this.worker = null;   // in-flight requests fall back via their timeout
      };
    } catch (e) { this.failed = true; }
  },

  choose(positions, seed, target, cb) {
    this.init();
    if (this.worker) {
      const id = this.nextId++;
      this.pending.set(id, cb);
      this.worker.postMessage({ id, positions, seed, target, count: DEAL_CANDIDATES });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        cb(chooseDeal(positions, seed, target, DEAL_CANDIDATES));
      }, 4000);
    } else {
      // let the dealing overlay paint before the synchronous crunch
      setTimeout(() => cb(chooseDeal(positions, seed, target, DEAL_CANDIDATES)), 30);
    }
  }
};

const Game = {
  state: 'idle', mode: 'classic', layoutKey: 'turtle', seed: '', dailyDate: null,
  tiles: [], sel: -1, undoStack: [], moves: 0, score: 0, elapsed: 0,
  hintsLeft: -1, shufflesLeft: -1, hintsUsed: 0, shufflesUsed: 0, combo: 0, lastMatchAt: 0, hintIdx: 0, timerId: 0, hintTimer: 0,
  voyageIdx: -1, nextVoyageLevel: -1, diffLabel: '', target: 0.45, winRate: null, lastStars: 0, timePercentile: null
};

/* stars: 3 for a brisk clear, scaled to board size */
function starsFor(tileCount, elapsed) {
  if (elapsed <= tileCount * 1.8) return 3;
  if (elapsed <= tileCount * 3.4) return 2;
  return 1;
}

/* backend-less "leaderboard": your pace vs. your own recent history on this
   layout — honest (no fabricated field), needs no accounts or server. */
const TIME_HISTORY_CAP = 20;
function timePercentile(history, t) {
  const beaten = history.filter(h => h > t).length;
  return Math.round((beaten / history.length) * 100);
}
function recordLayoutTime(layoutKey, elapsed) {
  const hist = Stats.times[layoutKey] || [];
  const pct = hist.length >= 3 ? timePercentile(hist, elapsed) : null;
  hist.push(elapsed);
  if (hist.length > TIME_HISTORY_CAP) hist.shift();
  Stats.times[layoutKey] = hist;
  return pct;
}

/* consecutive days ending today. Up to 2 missed days per calendar month are
   silently bridged (a "calm day" grace) so one lapse never zeroes a streak —
   reward presence, never punish absence. `frozenOut`, if given, collects the
   bridged date strings so the UI can mark them distinctly. */
function computeDailyStreak(dates, today, frozenOut) {
  let streak = 0;
  const freezeUsed = {};
  const d = new Date(today + 'T12:00:00');
  if (!dates[today]) d.setDate(d.getDate() - 1);
  for (;;) {
    const ds = dateToStr(d);
    if (dates[ds]) { streak++; d.setDate(d.getDate() - 1); continue; }
    const ym = ds.slice(0, 7);
    if ((freezeUsed[ym] || 0) < 2) {
      freezeUsed[ym] = (freezeUsed[ym] || 0) + 1;
      if (frozenOut) frozenOut.push(ds);
      d.setDate(d.getDate() - 1);
      continue;
    }
    break;
  }
  return streak;
}

/* graded monthly trophies — bronze/silver/gold by share of days completed,
   instead of all-or-nothing for the full month. */
function monthTier(doneCount, daysInMonth) {
  if (doneCount >= daysInMonth) return 'gold';
  if (doneCount >= Math.ceil(daysInMonth * 0.66)) return 'silver';
  if (doneCount >= Math.ceil(daysInMonth * 0.33)) return 'bronze';
  return null;
}
function dailyTrophies(dates) {
  const byMonth = {};
  for (const k in dates) { const ym = k.slice(0, 7); byMonth[ym] = (byMonth[ym] || 0) + 1; }
  const tiers = { bronze: 0, silver: 0, gold: 0 };
  for (const ym in byMonth) {
    const y = +ym.slice(0, 4), m = +ym.slice(5, 7);
    const tier = monthTier(byMonth[ym], new Date(y, m, 0).getDate());
    if (tier) tiers[tier]++;
  }
  return tiers;
}
function formatTrophies(t) {
  const parts = [];
  if (t.gold) parts.push('🥇' + t.gold);
  if (t.silver) parts.push('🥈' + t.silver);
  if (t.bronze) parts.push('🥉' + t.bronze);
  return parts.length ? parts.join(' ') : '0';
}

function dailyLayoutKey(seed) { return DAILY_LAYOUTS[seedHash(seed) % DAILY_LAYOUTS.length]; }

let dealingNow = false;

function newGame(mode, layoutKey, seed, opts) {
  if (dealingNow) return;
  opts = opts || {};
  const cfg = MODE_CFG[mode];
  let hints = cfg.hints, shuffles = cfg.shuffles;
  let target = mode === 'relax' ? 0.05 : mode === 'expert' ? 0.95 : 0.45;
  let voyageIdx = -1, dailyDate = null;

  if (mode === 'daily') {
    dailyDate = opts.date || todayStr();
    seed = 'daily-' + dailyDate;
    layoutKey = dailyLayoutKey(seed);
    const dow = (new Date(dailyDate + 'T12:00:00').getDay() + 6) % 7;   // Mon=0 … Sun=6
    target = 0.3 + 0.6 * (dow / 6);                                     // gentle Mondays, stormy Sundays
  }
  if (mode === 'voyage') {
    voyageIdx = opts.level != null ? opts.level : voyageCurrentLevel();
    const lv = VOYAGE_LEVELS[voyageIdx];
    layoutKey = lv.layout;
    target = lv.target;
    hints = lv.hints;
    shuffles = lv.shuffles;
  }
  if (mode === 'bonus') {
    layoutKey = 'garden';   // small, fast board — race the clock
    target = 0.25;
  }
  // an explicit target reproduces someone else's exact deal (challenge links)
  if (opts.target != null) target = opts.target;
  seed = seed || (mode + '-' + Date.now() + '-' + ((Math.random() * 1e9) | 0));

  const portrait = innerHeight >= innerWidth;
  const positions = buildLayout(layoutKey, makeRng(seed), portrait);
  dealingNow = true;
  setDealing(true);
  clearFinale();
  Dealer.choose(positions, seed, target, res => {
    dealingNow = false;
    setDealing(false);
    if (!res) { showToast('Could not deal this board'); return; }
    Object.assign(Game, {
      state: 'playing', mode, layoutKey, seed, dailyDate, voyageIdx, target,
      tiles: positions.map((p, i) => ({ i, x: p.x, y: p.y, z: p.z, kind: res.kinds[i], removed: false })),
      sel: -1, undoStack: [], moves: 0, score: 0, elapsed: 0,
      hintsLeft: hints, shufflesLeft: shuffles, hintsUsed: 0, shufflesUsed: 0,
      combo: 0, lastMatchAt: 0, hintIdx: 0,
      winRate: res.winRate, diffLabel: diffLabelFor(res.winRate)
    });
    Stats.played++;
    saveStats();
    showScreen('game');
    Renderer.buildBoard(true);
    updateHUD();
    startTimer();
    saveGame();
    closeModal(true);
  });
}

function diffLabelFor(wr) {
  if (wr == null) return '';
  return wr >= 0.7 ? 'Calm' : wr >= 0.4 ? 'Steady' : wr >= 0.15 ? 'Stormy' : 'Tempest';
}

function restartGame() {
  if (Game.mode === 'voyage') newGame('voyage', null, Game.seed, { level: Game.voyageIdx });
  else if (Game.mode === 'daily') newGame('daily', null, null, { date: Game.dailyDate });
  else newGame(Game.mode, Game.layoutKey, Game.seed);
}
function newBoardGame() {
  if (Game.mode === 'voyage') newGame('voyage', null, null, { level: Game.voyageIdx });
  else if (Game.mode === 'daily') newGame('daily', null, null, { date: Game.dailyDate });
  else newGame(Game.mode, Game.layoutKey);
}

function setDealing(on) { UI.dealing.classList.toggle('hidden', !on); }

function selectTile(i) {
  if (Game.state !== 'playing') return;
  const t = Game.tiles[i];
  if (!t || t.removed) return;
  clearHintMarks();
  if (!tileIsOpen(Game.tiles, i)) {
    Renderer.setClass(i, 'nope', false);
    void Renderer.els[i].offsetWidth;            // restart the shake animation
    Renderer.setClass(i, 'nope', true);
    AudioEngine.sfx('invalid');
    haptic(18);
    return;
  }
  if (Game.sel === i) {
    Game.sel = -1;
    Renderer.setClass(i, 'sel', false);
    return;
  }
  if (Game.sel >= 0 && matchKeyOf(Game.tiles[Game.sel].kind) === matchKeyOf(t.kind)) {
    removePair(Game.sel, i);
    return;
  }
  if (Game.sel >= 0) Renderer.setClass(Game.sel, 'sel', false);
  Game.sel = i;
  Renderer.setClass(i, 'sel', true);
  AudioEngine.sfx('select');
  haptic(8);
}

function removePair(a, b) {
  const cfg = MODE_CFG[Game.mode];
  const now = Date.now();
  const prevCombo = Game.combo, prevLast = Game.lastMatchAt;
  Game.combo = (now - Game.lastMatchAt <= 10000) ? Game.combo + 1 : 1;
  Game.lastMatchAt = now;
  const pts = Math.round((100 + Game.tiles[a].z * 25 + (Game.combo - 1) * 15) * cfg.mult);

  Game.tiles[a].removed = Game.tiles[b].removed = true;
  const [mx, my] = Renderer.removePair(a, b);
  const rm = Settings.reducedMotion;
  const comboNow = Game.combo;
  setTimeout(() => {                                     // detonate where they meet
    FX.blast(mx, my);
    AudioEngine.sfx('match', comboNow);
    haptic([12, 30, 12]);
  }, rm ? 0 : 440);
  setTimeout(() => {                                     // …then the points emerge
    spawnFx(mx, my - 14, 'score-pop', '+' + pts);
    if (comboNow > 1) spawnFx(mx, my + 24, 'score-pop combo', 'COMBO ×' + comboNow, 120);
  }, rm ? 0 : 580);
  Game.sel = -1;
  Game.moves++;
  Game.score += pts;
  Game.undoStack.push({ t: 'p', a, b, pts, combo: prevCombo, last: prevLast });
  Renderer.updateOpenStates();
  AudioEngine.sfx('select');              // soft tick on the tap; the chime rides the blast
  haptic(10);
  updateHUD(true);

  if (Game.tiles.every(t => t.removed)) { onWin(); return; }
  saveGame();
  if (findMoves(Game.tiles).length === 0) onStuck();
}

function undoMove() {
  if (Game.state !== 'playing' && Game.state !== 'stuck') return;
  const e = Game.undoStack.pop();
  if (!e) { showToast('Nothing to undo'); return; }
  if (e.t === 'p') {
    Game.tiles[e.a].removed = Game.tiles[e.b].removed = false;
    Renderer.restoreTile(e.a);
    Renderer.restoreTile(e.b);
    Game.score = Math.max(0, Game.score - e.pts);
    Game.moves = Math.max(0, Game.moves - 1);
    Game.combo = e.combo;
    Game.lastMatchAt = e.last;
  } else {
    for (const [i, kind] of e.kinds) Game.tiles[i].kind = kind;
    Game.shufflesLeft = e.left;
    Game.score += e.pen;
    Renderer.refreshFaces();
  }
  if (Game.sel >= 0) Renderer.setClass(Game.sel, 'sel', false);
  Game.sel = -1;
  clearHintMarks();
  Renderer.updateOpenStates();
  Game.state = 'playing';
  AudioEngine.sfx('undo');
  updateHUD();
  saveGame();
  closeModal(true);
}

function clearHintMarks() {
  if (Game.hintTimer) { clearTimeout(Game.hintTimer); Game.hintTimer = 0; }
  for (const el of Renderer.els) el.classList.remove('hint');
}

function showHint() {
  if (Game.state !== 'playing') return;
  if (Game.hintsLeft === 0) { showToast('No hints left in ' + MODE_CFG[Game.mode].label + ' mode'); return; }
  const moves = findMoves(Game.tiles);
  if (!moves.length) { showToast('No moves available — try a shuffle'); return; }
  clearHintMarks();
  Game.hintIdx = Game.hintIdx % moves.length;
  const [a, b] = moves[Game.hintIdx++];
  Renderer.setClass(a, 'hint', true);
  Renderer.setClass(b, 'hint', true);
  Game.hintTimer = setTimeout(clearHintMarks, 2400);
  if (Game.hintsLeft > 0) Game.hintsLeft--;
  Game.hintsUsed++;
  Game.score = Math.max(0, Game.score - MODE_CFG[Game.mode].hintPenalty);
  AudioEngine.sfx('select');
  updateHUD();
  saveGame();
}

function doShuffle(auto) {
  if (Game.state !== 'playing' && Game.state !== 'stuck') return false;
  if (Game.shufflesLeft === 0) { showToast('No shuffles left'); return false; }
  const active = [];
  for (let i = 0; i < Game.tiles.length; i++) if (!Game.tiles[i].removed) active.push(i);
  if (active.length < 2) return false;

  const byKey = new Map();
  for (const i of active) {
    const k = matchKeyOf(Game.tiles[i].kind);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(Game.tiles[i].kind);
  }
  const pairs = [];
  for (const kinds of byKey.values()) {
    for (let j = 0; j + 1 < kinds.length; j += 2) pairs.push([kinds[j], kinds[j + 1]]);
  }
  const positions = active.map(i => Game.tiles[i]);
  const deal = dealSolvable(positions, mulberry32((Math.random() * 2 ** 31) | 0), pairs);
  if (!deal) {
    // Only possible when the remaining tiles physically can't expose a pair
    // (e.g. two tiles stacked on one column) — no arrangement can help.
    if (!auto) showToast('These last tiles cannot be rearranged — undo a move instead');
    return false;
  }
  const snapshot = active.map(i => [i, Game.tiles[i].kind]);
  // record only what is actually deducted, so a shuffle+undo can't mint points
  const pen = Math.min(MODE_CFG[Game.mode].shufflePenalty, Game.score);
  Game.undoStack.push({ t: 'sh', kinds: snapshot, pen, left: Game.shufflesLeft });
  for (let k = 0; k < active.length; k++) Game.tiles[active[k]].kind = deal.kinds[k];
  if (Game.shufflesLeft > 0) Game.shufflesLeft--;
  if (!auto) Game.shufflesUsed++;
  Game.score -= pen;
  if (Game.sel >= 0) Renderer.setClass(Game.sel, 'sel', false);
  Game.sel = -1;
  clearHintMarks();
  Renderer.refreshFaces();
  if (!Settings.reducedMotion) {
    for (const i of active) {
      const el = Renderer.els[i];
      el.classList.remove('in');
      void el.offsetWidth;
      el.classList.add('in');
      el.style.animationDelay = Math.random() * 200 + 'ms';
    }
  }
  Game.state = 'playing';
  AudioEngine.sfx('shuffle');
  updateHUD();
  saveGame();
  closeModal(true);
  showToast(auto ? 'No moves left — tiles reshuffled 🌊' : 'Reshuffled — a winning path still exists');
  return true;
}

function onStuck() {
  if (Game.mode === 'relax' || Game.mode === 'bonus') {
    // If the leftovers physically can't be rearranged (e.g. stacked on one
    // column), quietly take back moves until a shuffle becomes possible.
    let guard = 0;
    while (!doShuffle(true) && Game.undoStack.length && guard++ < 100) undoMove();
    return;
  }
  Game.state = 'stuck';
  const canShuffle = Game.shufflesLeft !== 0;
  const canUndo = Game.undoStack.length > 0;
  UI.btnStuckShuffle.disabled = !canShuffle;
  UI.btnStuckUndo.disabled = !canUndo;
  UI.stuckShuffleSub.textContent = Game.shufflesLeft < 0 ? 'Unlimited' : Game.shufflesLeft + ' left';
  if (!canShuffle && !canUndo) {
    UI.stuckNote.textContent = 'No moves, no shuffles, no undo — this voyage ends here.';
    Stats.streak = 0;
    saveStats();
    Store.del(SAVE_KEY);
  } else {
    UI.stuckNote.textContent = 'The tide has turned — but you still have options.';
  }
  openModal('stuck');
}

function onWin() {
  Game.state = 'won';
  stopTimer();
  const cfg = MODE_CFG[Game.mode];
  const matchScore = Game.score;
  const timeBonus = Math.round(Math.max(0, 600 - Game.elapsed) * 3 * cfg.mult);
  Game.score = matchScore + timeBonus;
  const stars = starsFor(Game.tiles.length, Game.elapsed);
  const newBestTime = !Stats.bestTime || Game.elapsed < Stats.bestTime;
  Game.timePercentile = recordLayoutTime(Game.layoutKey, Game.elapsed);

  Stats.won++;
  Stats.streak++;
  Stats.longestStreak = Math.max(Stats.longestStreak, Stats.streak);
  Stats.totalMoves += Game.moves;
  if (newBestTime) Stats.bestTime = Game.elapsed;
  if ((Stats.layoutStars[Game.layoutKey] | 0) < stars) Stats.layoutStars[Game.layoutKey] = stars;
  if (Game.mode === 'daily' && Game.dailyDate && !Stats.dailyDates[Game.dailyDate]) {
    Stats.dailyDates[Game.dailyDate] = true;
    Stats.dailyCount++;
  }
  let nextLevel = -1;
  if (Game.mode === 'voyage' && Game.voyageIdx >= 0) {
    if ((Stats.voyage[Game.voyageIdx] | 0) < stars) Stats.voyage[Game.voyageIdx] = stars;
    if (Game.voyageIdx + 1 < VOYAGE_LEVELS.length) nextLevel = Game.voyageIdx + 1;
  }
  if (Game.mode === 'bonus') {
    Stats.pearls = (Stats.pearls | 0) + 1;
    for (const k in THEME_LOCKS) {
      if (Stats.pearls === THEME_LOCKS[k]) {
        const name = THEMES[k].name;
        fl(() => showToast('✨ ' + name + ' theme unlocked! Find it under Themes.', 3600), 2800);
      }
    }
  }
  saveStats();
  Store.del(SAVE_KEY);
  Game.lastStars = stars;
  runWinFinale(matchScore, timeBonus, stars, newBestTime, nextLevel);
  updateMenuState();
}

/* a URL that reproduces this exact deal: same seed + layout + difficulty
   target picks the same candidate out of the dealer's pool, every time. */
function buildChallengeURL() {
  const u = new URL(location.href);
  u.search = '';
  u.hash = '';
  u.searchParams.set('c', Game.seed);
  u.searchParams.set('l', Game.layoutKey);
  u.searchParams.set('t', Game.target.toFixed(2));
  return u.toString();
}

function buildShareText() {
  const cfg = MODE_CFG[Game.mode];
  const title = Game.mode === 'daily' ? "Ocean's Mahjong 🌊 Daily · " + Game.dailyDate
    : Game.mode === 'voyage' ? "Ocean's Mahjong 🌊 Voyage " + (Game.voyageIdx + 1)
    : "Ocean's Mahjong 🌊 " + cfg.label;
  const starLine = '★'.repeat(Game.lastStars) + '☆'.repeat(3 - Game.lastStars);
  return [
    title,
    '⏱ ' + fmtTime(Game.elapsed) + '  ' + starLine,
    '💡 ' + Game.hintsUsed + '   🔀 ' + Game.shufflesUsed,
    buildChallengeURL()
  ].join('\n');
}

async function shareResult() {
  const text = buildShareText();
  if (navigator.share) {
    try { await navigator.share({ text }); } catch (e) { /* cancelled — not an error */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast('Result copied — paste it anywhere');
  } catch (e) {
    showToast('Could not share — try again');
  }
}

/* true only when launched as the installed Play Store app (TWA), never in
   a plain browser tab — that's the one context where "rate us" is relevant. */
function isTWA() {
  return document.referrer.startsWith('android-app://');
}

/* ask at most twice, ever: once at the 3rd win, once more at the 10th if the
   first ask was deferred — then stay silent regardless of outcome. */
function updateRateNudge() {
  if (!isTWA() || Stats.ratePromptStage >= 2) { UI.winRateRow.classList.add('hidden'); return; }
  const ask = (Stats.ratePromptStage === 0 && Stats.won === 3) || (Stats.ratePromptStage === 1 && Stats.won === 10);
  UI.winRateRow.classList.toggle('hidden', !ask);
}

/* one gentle nudge toward whichever ritual item is still open today —
   friction removal, not reward escalation. */
function updateWinRitual() {
  if (!Stats.dailyDates[todayStr()] && Game.mode !== 'daily') {
    UI.btnWinRitual.textContent = "📅 Today's Daily is still waiting";
    UI.btnWinRitual.onclick = () => newGame('daily');
    UI.btnWinRitual.classList.remove('hidden');
    return;
  }
  const cur = voyageCurrentLevel();
  if (Game.mode !== 'voyage' && !(Stats.voyage[cur] > 0)) {
    UI.btnWinRitual.textContent = '🧭 Continue Voyage — level ' + (cur + 1);
    UI.btnWinRitual.onclick = () => newGame('voyage', null, null, { level: cur });
    UI.btnWinRitual.classList.remove('hidden');
    return;
  }
  UI.btnWinRitual.classList.add('hidden');
}

/* ── staged win finale: flash → stars stamp in → tally rolls up ── */
const finaleTimers = [];
function clearFinale() { while (finaleTimers.length) clearTimeout(finaleTimers.pop()); }
function fl(fn, ms) { finaleTimers.push(setTimeout(fn, ms)); }
function tallyRow(label, value, extra) {
  return `<div class="tally-row ${extra || ''}"><span>${label}</span><b>${value}</b></div>`;
}

function runWinFinale(matchScore, timeBonus, stars, newBestTime, nextLevel) {
  clearFinale();
  const rm = Settings.reducedMotion;
  UI.winTitle.textContent =
    Game.mode === 'bonus' ? 'Pearl earned! 🦪' :
    Game.mode === 'daily' ? 'Daily challenge complete!' :
    Game.mode === 'voyage' ? 'Level ' + (Game.voyageIdx + 1) + ' cleared!' :
    'Board cleared!';
  UI.winNudgeRow.classList.toggle('hidden', !['classic', 'relax', 'expert'].includes(Game.mode));
  updateWinRitual();
  updateRateNudge();
  UI.winStars.innerHTML = [0, 1, 2].map(i => `<span class="star" data-s="${i}">★</span>`).join('');
  UI.winTally.innerHTML =
    tallyRow('Time', fmtTime(Game.elapsed)) +
    (Game.diffLabel && Game.winRate != null ? tallyRow('Board rarity', Game.diffLabel + ' · ' + Math.round(Game.winRate * 100) + '% solve it') : '') +
    (Game.timePercentile != null ? tallyRow('Your pace', 'Faster than ' + Game.timePercentile + '% of your ' + LAYOUTS[Game.layoutKey].name + ' games') : '') +
    tallyRow('Matches', Game.moves) +
    tallyRow('Match score', '+' + matchScore.toLocaleString()) +
    tallyRow('Time bonus', '+' + timeBonus.toLocaleString()) +
    (Game.mode === 'bonus' ? tallyRow('Pearls collected', '🦪 ' + (Stats.pearls | 0)) : '') +
    tallyRow('Total', '<i id="win-total">0</i>', 'total');
  UI.winBest.classList.add('hidden');
  UI.btnWinNext.classList.toggle('hidden', nextLevel < 0);
  if (nextLevel >= 0) UI.winNextLabel.textContent = 'Sail to level ' + (nextLevel + 1);
  Game.nextVoyageLevel = nextLevel;
  // a 3-star win earns a shot at the Bonus Dive
  UI.btnWinBonus.classList.toggle('hidden', !(stars === 3 && Game.mode !== 'bonus'));

  if (!rm) {
    const flash = document.createElement('div');
    flash.className = 'win-flash';
    document.body.appendChild(flash);
    fl(() => flash.remove(), 1000);
  }
  FX.confetti();
  AudioEngine.sfx('win');
  haptic([20, 60, 20, 60, 40]);

  const t0 = rm ? 30 : 700;
  fl(() => openModal('win'), t0);
  for (let i = 0; i < stars; i++) {
    fl(() => {
      if (currentPanel !== 'win') return;
      const el = UI.winStars.querySelector(`[data-s="${i}"]`);
      if (el) el.classList.add('lit');
      AudioEngine.sfx('star', i);
      haptic(24);
    }, rm ? 30 : t0 + 500 + i * 380);
  }
  const tRows = rm ? 40 : t0 + 500 + stars * 380 + 250;
  const rowCount = UI.winTally.querySelectorAll('.tally-row').length;
  for (let i = 0; i < rowCount; i++) {
    fl(() => {
      if (currentPanel !== 'win') return;
      const row = UI.winTally.querySelectorAll('.tally-row')[i];
      if (row) row.classList.add('show');
      if (i === rowCount - 1) tickWinTotal(Game.score, rm);
      else if (!rm) AudioEngine.sfx('select');
    }, rm ? 40 : tRows + i * 320);
  }
  if (newBestTime && Stats.won > 1) {
    fl(() => { if (currentPanel === 'win') UI.winBest.classList.remove('hidden'); }, rm ? 50 : tRows + rowCount * 320 + 450);
  }
}

function tickWinTotal(total, rm) {
  const el = document.getElementById('win-total');
  if (!el) return;
  if (rm || typeof requestAnimationFrame !== 'function') { el.textContent = total.toLocaleString(); return; }
  const t0 = performance.now(), dur = 800;
  (function step(now) {
    const k = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(total * (1 - Math.pow(1 - k, 3))).toLocaleString();
    if (k < 1 && currentPanel === 'win') requestAnimationFrame(step);
  })(t0);
}

/* ——— timer / persistence ——— */

function hudTimeText() {
  return Game.mode === 'bonus'
    ? fmtTime(Math.max(0, BONUS_TIME - Game.elapsed))
    : fmtTime(Game.elapsed);
}

function startTimer() {
  stopTimer();
  Game.timerId = setInterval(() => {
    if (Game.state === 'playing' && !document.hidden) {
      Game.elapsed++;
      UI.hudTimer.textContent = hudTimeText();
      if (Game.mode === 'bonus' && Game.elapsed >= BONUS_TIME) { bonusTimeUp(); return; }
      if (Game.elapsed % 15 === 0) saveGame();
    }
  }, 1000);
}

function bonusTimeUp() {
  stopTimer();
  Game.state = 'lost';
  Store.del(SAVE_KEY);
  AudioEngine.sfx('invalid');
  haptic([40, 60, 40]);
  openModal('timeup');
  updateMenuState();
}
function stopTimer() { if (Game.timerId) { clearInterval(Game.timerId); Game.timerId = 0; } }

function saveGame() {
  if (Game.state !== 'playing' && Game.state !== 'paused' && Game.state !== 'stuck') return;
  Store.set(SAVE_KEY, {
    v: 1, mode: Game.mode, layoutKey: Game.layoutKey, seed: Game.seed, dailyDate: Game.dailyDate,
    tiles: Game.tiles.map(t => ({ x: t.x, y: t.y, z: t.z, kind: t.kind, removed: t.removed })),
    undoStack: Game.undoStack, moves: Game.moves, score: Game.score, elapsed: Game.elapsed,
    hintsLeft: Game.hintsLeft, shufflesLeft: Game.shufflesLeft,
    hintsUsed: Game.hintsUsed, shufflesUsed: Game.shufflesUsed,
    voyageIdx: Game.voyageIdx, diffLabel: Game.diffLabel, target: Game.target, winRate: Game.winRate, ts: Date.now()
  });
}

function resumeSavedGame() {
  const s = Store.get(SAVE_KEY, null);
  if (!s || s.v !== 1 || !Array.isArray(s.tiles) || !s.tiles.length) return false;
  Object.assign(Game, {
    state: 'playing', mode: s.mode, layoutKey: s.layoutKey, seed: s.seed, dailyDate: s.dailyDate || null,
    tiles: s.tiles.map((t, i) => ({ i, x: t.x, y: t.y, z: t.z, kind: t.kind, removed: !!t.removed })),
    undoStack: Array.isArray(s.undoStack) ? s.undoStack : [],
    moves: s.moves | 0, score: s.score | 0, elapsed: s.elapsed | 0,
    hintsLeft: typeof s.hintsLeft === 'number' ? s.hintsLeft : -1,
    shufflesLeft: typeof s.shufflesLeft === 'number' ? s.shufflesLeft : -1,
    hintsUsed: s.hintsUsed | 0, shufflesUsed: s.shufflesUsed | 0,
    voyageIdx: typeof s.voyageIdx === 'number' ? s.voyageIdx : -1,
    diffLabel: s.diffLabel || '', target: typeof s.target === 'number' ? s.target : 0.45,
    winRate: typeof s.winRate === 'number' ? s.winRate : null,
    sel: -1, combo: 0, lastMatchAt: 0, hintIdx: 0
  });
  showScreen('game');
  Renderer.buildBoard(false);
  updateHUD();
  startTimer();
  if (findMoves(Game.tiles).length === 0 && !Game.tiles.every(t => t.removed)) onStuck();
  return true;
}

function quitToMenu() {
  stopTimer();
  if (Game.state === 'playing' || Game.state === 'paused') saveGame();
  Game.state = 'idle';
  closeModal(true);
  showScreen('menu');
  updateMenuState();
}

function pauseGame() {
  if (Game.state !== 'playing') return;
  Game.state = 'paused';
  saveGame();
  openModal('pause');
}
function resumeGame() {
  if (Game.state === 'paused') Game.state = 'playing';
  closeModal(true);
}

/* ───────────────────────── 10. UI wiring ───────────────────────── */

let currentPanel = null;
let pendingMode = 'classic';
let toastTimer = 0;
let deferredInstall = null;

function showScreen(name) {
  UI.screenMenu.classList.toggle('active', name === 'menu');
  UI.screenGame.classList.toggle('active', name === 'game');
}

function openModal(panel) {
  currentPanel = panel;
  for (const p of document.querySelectorAll('.panel')) p.classList.remove('active');
  const el = document.getElementById('panel-' + panel);
  if (el) el.classList.add('active');
  if (panel === 'stats') renderStats();
  if (panel === 'themes') buildThemeGrid();   // lock states may have changed
  UI.modalRoot.classList.remove('hidden');
}

function closeModal(force) {
  if (!force) {
    // closing a sub-panel while paused returns to the pause sheet;
    // closing the pause sheet itself resumes play
    if (Game.state === 'paused' && currentPanel !== 'pause') { openModal('pause'); return; }
    if (Game.state === 'paused' && currentPanel === 'pause') { Game.state = 'playing'; }
    if (Game.state === 'stuck' && currentPanel === 'stuck') {
      const canRecover = Game.shufflesLeft !== 0 || Game.undoStack.length > 0;
      if (canRecover) Game.state = 'playing'; // let them study the board
    }
  }
  currentPanel = null;
  UI.modalRoot.classList.add('hidden');
}

function showToast(msg, ms) {
  UI.toast.textContent = msg;
  UI.toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => UI.toast.classList.add('hidden'), ms || 2400);
}

function haptic(p) { if (Settings.haptics && navigator.vibrate) { try { navigator.vibrate(p); } catch (e) { } } }

/* one-shot floating effect (score popups, combo badges, burst rings) */
function spawnFx(x, y, cls, text, delay) {
  if (Settings.reducedMotion) return;
  const d = document.createElement('div');
  d.className = cls;
  if (text) d.textContent = text;
  d.style.left = x + 'px';
  d.style.top = y + 'px';
  if (delay) d.style.animationDelay = delay + 'ms';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1500 + (delay || 0));
}

/* HUD score counts up instead of jumping */
let scoreShown = 0, scoreAnim = 0;
function renderScore(animate) {
  const target = Game.score;
  cancelAnimationFrame(scoreAnim);
  if (!animate || Settings.reducedMotion || typeof requestAnimationFrame !== 'function') {
    scoreShown = target;
    UI.hudScore.textContent = target.toLocaleString();
    return;
  }
  const from = scoreShown, t0 = performance.now(), dur = 500;
  const step = now => {
    const k = Math.min(1, (now - t0) / dur);
    scoreShown = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
    UI.hudScore.textContent = scoreShown.toLocaleString();
    if (k < 1) scoreAnim = requestAnimationFrame(step);
  };
  scoreAnim = requestAnimationFrame(step);
}

function updateHUD(animateScore) {
  const cfg = MODE_CFG[Game.mode];
  const name = LAYOUTS[Game.layoutKey].name;
  UI.hudMode.textContent = Game.mode === 'voyage'
    ? 'Voyage ' + (Game.voyageIdx + 1) + ' · ' + name
    : cfg.label + ' · ' + name;
  UI.hudTimer.textContent = hudTimeText();
  UI.hudMoves.textContent = Game.moves;
  renderScore(!!animateScore);
  UI.hudTiles.textContent = Game.tiles.filter(t => !t.removed).length;
  UI.hintCount.textContent = Game.hintsLeft < 0 ? '' : Game.hintsLeft;
  UI.hintCount.classList.toggle('hidden', Game.hintsLeft < 0);
  UI.shuffleCount.textContent = Game.shufflesLeft < 0 ? '' : Game.shufflesLeft;
  UI.shuffleCount.classList.toggle('hidden', Game.shufflesLeft < 0);
  UI.btnUndo.disabled = Game.undoStack.length === 0;
  UI.btnHint.disabled = Game.hintsLeft === 0;
  UI.btnShuffle.disabled = Game.shufflesLeft === 0;
}

/* seed-in-URL friend challenge — read once at boot, cleared from the URL
   immediately so a refresh doesn't keep re-triggering it. */
let pendingChallenge = null;
function checkChallengeLink() {
  const params = new URLSearchParams(location.search);
  const seed = params.get('c'), layoutKey = params.get('l'), t = params.get('t');
  if (seed && layoutKey && LAYOUTS[layoutKey]) {
    pendingChallenge = { seed, layoutKey, target: t != null ? clamp(parseFloat(t), 0, 1) : 0.45 };
    history.replaceState(null, '', location.pathname);
  }
}

/* manifest "shortcuts" — long-press the installed app icon to jump straight
   into a mode, same URL-param pattern as the friend-challenge link. */
function checkShortcutLink() {
  const shortcut = new URLSearchParams(location.search).get('shortcut');
  if (!shortcut) return;
  history.replaceState(null, '', location.pathname);
  if (shortcut === 'daily') newGame('daily');
  else if (shortcut === 'continue') resumeSavedGame();
  else if (shortcut === 'voyage') newGame('voyage');
}

function updateMenuState() {
  const s = Store.get(SAVE_KEY, null);
  const has = !!(s && s.v === 1 && Array.isArray(s.tiles) && s.tiles.some(t => !t.removed));
  UI.btnContinue.classList.toggle('hidden', !has);
  if (has) {
    UI.continueSub.textContent = MODE_CFG[s.mode].label + ' · ' + LAYOUTS[s.layoutKey].name + ' · ' + fmtTime(s.elapsed);
  }
  UI.btnChallenge.classList.toggle('hidden', !pendingChallenge);
  const todaySeed = 'daily-' + todayStr();
  UI.dailyBadge.classList.toggle('hidden', !Stats.dailyDates[todayStr()]);
  const streak = computeDailyStreak(Stats.dailyDates, todayStr());
  UI.dailySub.textContent = (Stats.dailyDates[todayStr()]
    ? 'Completed — new board at midnight'
    : 'Today: ' + LAYOUTS[dailyLayoutKey(todaySeed)].name) + (streak > 1 ? ' · 🔥 ' + streak : '');
  UI.voyageSub.textContent = 'Level ' + (voyageCurrentLevel() + 1) + ' of ' + VOYAGE_LEVELS.length +
    ' · ' + voyageTotalStars() + ' ★ collected';
}

function statCard(value, label) {
  return `<div class="stat-card"><b>${value}</b><small>${label}</small></div>`;
}

function renderStats() {
  const winRate = Stats.played ? Math.round((Stats.won / Stats.played) * 100) : 0;
  UI.statsPanel.innerHTML = '<div class="stats-grid">' +
    statCard(Stats.played, 'Games played') +
    statCard(Stats.won, 'Games won') +
    statCard(winRate + '%', 'Win rate') +
    statCard(Stats.bestTime ? fmtTime(Stats.bestTime) : '—', 'Best time') +
    statCard(Stats.streak, 'Current streak') +
    statCard(Stats.longestStreak, 'Longest streak') +
    statCard(Stats.totalMoves.toLocaleString(), 'Total matches') +
    statCard(Stats.dailyCount, 'Daily challenges won') +
    statCard('🦪 ' + (Stats.pearls | 0), 'Pearls collected') +
    '</div>';
}

function buildLayoutGrid(keys) {
  UI.layoutGrid.innerHTML = '';
  for (const key of keys) {
    const lay = LAYOUTS[key];
    const card = document.createElement('button');
    card.className = 'layout-card';
    const count = key === 'random' ? '60–144' : buildLayout(key).length;
    const earned = Stats.layoutStars[key] | 0;
    card.innerHTML = layoutPreviewSVG(key) +
      `<b>${lay.name}</b><span class="diff">${'★'.repeat(lay.diff)}${'☆'.repeat(3 - lay.diff)} · ${count} tiles</span>` +
      `<span class="earned">${earned ? '★'.repeat(earned) : ''}</span>`;
    card.addEventListener('click', () => newGame(pendingMode, key));
    UI.layoutGrid.appendChild(card);
  }
}

/* ── daily challenge calendar ── */
let calY = 0, calM = 0;

function openDailyPanel() {
  const t = new Date();
  calY = t.getFullYear();
  calM = t.getMonth();
  renderDailyCal();
  openModal('daily');
}

function renderDailyCal() {
  const today = todayStr();
  const now = new Date();
  const frozen = [];
  const streak = computeDailyStreak(Stats.dailyDates, today, frozen);
  const frozenSet = new Set(frozen);
  UI.calTitle.textContent = new Date(calY, calM, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  UI.calWeek.innerHTML = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<span>${d}</span>`).join('');
  const lead = (new Date(calY, calM, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calY, calM + 1, 0).getDate();
  let html = '';
  for (let i = 0; i < lead; i++) html += '<button class="cal-day blank" tabindex="-1"></button>';
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = dateToStr(new Date(calY, calM, d));
    const cls = ['cal-day'];
    if (Stats.dailyDates[ds]) cls.push('done');
    else if (frozenSet.has(ds)) cls.push('frozen');
    if (ds === today) cls.push('today');
    if (ds > today) cls.push('future');
    html += `<button class="${cls.join(' ')}" data-date="${ds}">${d}</button>`;
  }
  UI.calGrid.innerHTML = html;
  UI.dailyStreak.textContent = streak;
  UI.dailyTotal.textContent = Stats.dailyCount;
  UI.dailyTrophies.textContent = formatTrophies(dailyTrophies(Stats.dailyDates));
  const shown = calY * 12 + calM, cur = now.getFullYear() * 12 + now.getMonth();
  UI.calPrev.disabled = shown <= cur - 24;
  UI.calNext.disabled = shown >= cur;
  const done = !!Stats.dailyDates[today];
  UI.dailyTodayLabel.textContent = done ? "Today's challenge complete ✓" : "Play today's challenge";
  UI.dailyTodaySub.textContent = 'Today: ' + LAYOUTS[dailyLayoutKey('daily-' + today)].name;
}

/* ── voyage map ── */
function renderVoyage() {
  const cur = voyageCurrentLevel();
  let html = '';
  for (let r = 0; r * 3 < VOYAGE_LEVELS.length; r++) {
    html += `<div class="voyage-row${r % 2 ? ' rev' : ''}">`;
    for (let c = 0; c < 3 && r * 3 + c < VOYAGE_LEVELS.length; c++) {
      const i = r * 3 + c;
      const st = Stats.voyage[i] | 0;
      const state = st > 0 ? 'done' : i === cur ? 'current' : 'locked';
      html += `<button class="voyage-node ${state}" data-level="${i}" ${state === 'locked' ? 'disabled' : ''}>` +
        `<span class="pearl">${state === 'locked' ? '🔒' : i + 1}</span>` +
        `<small>${LAYOUTS[VOYAGE_LEVELS[i].layout].name}</small>` +
        `<span class="vstars">${'★'.repeat(st)}</span></button>`;
    }
    html += '</div>';
  }
  UI.voyageMap.innerHTML = html;
}

function buildThemeGrid() {
  UI.themeGrid.innerHTML = '';
  const pearls = Stats.pearls | 0;
  const pearlNote = document.getElementById('pearl-note');
  if (pearlNote) {
    pearlNote.textContent = `🦪 Pearls: ${pearls} — finish any board with 3 stars, then clear the Bonus Dive to earn more.`;
  }
  for (const key of Object.keys(THEMES)) {
    const th = THEMES[key];
    const unlocked = themeUnlocked(key);
    const card = document.createElement('button');
    card.className = 'theme-card' + (Settings.theme === key ? ' on' : '') + (unlocked ? '' : ' locked');
    card.dataset.theme = key;
    const sampleKinds = [4, 27, 34];   // suit 5 · butterfly · rose
    let sw = '<span class="swatches">';
    for (const k of sampleKinds) {
      sw += `<span class="tile-mini">${faceSampleSVG(key, k)}</span>`;
    }
    sw += '</span>';
    card.innerHTML = sw + `<b>${th.name}</b>` +
      (unlocked ? `<small>${th.sub}</small>`
                : `<span class="lockline">🔒 ${THEME_LOCKS[key]} pearls to unlock</span>`);
    card.addEventListener('click', () => {
      if (!themeUnlocked(key)) {
        showToast(`Collect ${THEME_LOCKS[key]} pearls in Bonus Dives to unlock ${th.name}`);
        return;
      }
      Settings.theme = key;
      saveSettings();
      applyTheme();
      for (const c of UI.themeGrid.children) c.classList.toggle('on', c.dataset.theme === key);
    });
    UI.themeGrid.appendChild(card);
  }
}
/* sample face for theme cards regardless of current theme */
function faceSampleSVG(themeKey, kind) {
  const prev = Settings.theme;
  Settings.theme = themeKey;
  const svg = faceSVG(kind);
  Settings.theme = prev;
  return svg;
}

function applyTheme() {
  for (const k of Object.keys(THEMES)) document.body.classList.remove('theme-' + k);
  document.body.classList.add('theme-' + Settings.theme);
  if (Game.tiles.length) Renderer.refreshFaces();
  spawnPetals();
}

function buildAudioPanel() {
  UI.audioPanel.innerHTML = '';
  for (const grp of SOUND_GROUPS) {
    const div = document.createElement('div');
    div.className = 'mix-group';
    const head = document.createElement('div');
    head.className = 'mix-head';
    head.innerHTML = `<span class="gi">${grp.icon}</span><b>${grp.label}</b>`;
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = '0'; slider.max = '1'; slider.step = '0.01';
    slider.className = 'slider';
    slider.value = Settings.vol[grp.bus];
    slider.setAttribute('aria-label', grp.label + ' volume');
    slider.addEventListener('input', () => {
      Settings.vol[grp.bus] = parseFloat(slider.value);
      AudioEngine.unlock();
      AudioEngine.applyBus(grp.bus);
      saveSettings();
    });
    head.appendChild(slider);
    div.appendChild(head);
    const sounds = SOUND_DEFS.filter(s => s.bus === grp.bus);
    if (sounds.length) {
      const chips = document.createElement('div');
      chips.className = 'chips';
      for (const s of sounds) {
        const chip = document.createElement('button');
        chip.className = 'chip' + (Settings.activeSounds.includes(s.id) ? ' on' : '');
        chip.textContent = s.label;
        chip.addEventListener('click', () => {
          AudioEngine.unlock();
          const on = AudioEngine.toggle(s.id);
          chip.classList.toggle('on', on);
          Settings.activeSounds = Settings.activeSounds.filter(x => x !== s.id);
          if (on) Settings.activeSounds.push(s.id);
          saveSettings();
        });
        chips.appendChild(chip);
      }
      div.appendChild(chips);
    }
    UI.audioPanel.appendChild(div);
  }
}

function buildSettingsPanel() {
  UI.settingsPanel.innerHTML = '';
  const toggles = [
    ['largeText', 'Large text', 'Bigger labels and help text'],
    ['highContrast', 'High contrast', 'Stronger outlines and darker panels'],
    ['colorblind', 'Colorblind-safe tiles', 'Adds letter badges to every tile face'],
    ['reducedMotion', 'Reduced motion', 'Disables animations and particles'],
    ['dimBlocked', 'Dim blocked tiles', 'Playable tiles stay bright, locked ones fade'],
    ['petals', 'Floating petals', 'Decorative background drift'],
    ['haptics', 'Haptic feedback', 'Gentle vibration on matches']
  ];
  for (const [key, label, sub] of toggles) {
    const row = document.createElement('div');
    row.className = 'set-row';
    row.innerHTML = `<span class="st"><b>${label}</b><small>${sub}</small></span>`;
    const sw = document.createElement('label');
    sw.className = 'switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!Settings[key];
    input.addEventListener('change', () => {
      Settings[key] = input.checked;
      saveSettings();
      applyAccessibility();
    });
    sw.appendChild(input);
    const knob = document.createElement('span');
    knob.className = 'knob';
    sw.appendChild(knob);
    row.appendChild(sw);
    UI.settingsPanel.appendChild(row);
  }
  UI.settingsPanel.appendChild(tileSizeRow());
  UI.settingsPanel.appendChild(backupRow());
}

/* one-tap progress backup — a cache clear or browser reset can otherwise
   silently wipe streaks/stats that live only in localStorage. */
function backupRow() {
  const row = document.createElement('div');
  row.className = 'set-row';
  row.innerHTML = `<span class="st"><b>Backup progress</b><small>Save stats &amp; streaks to a file, or restore on another device</small></span>`;
  const chips = document.createElement('div');
  chips.className = 'chips';
  const exportBtn = document.createElement('button');
  exportBtn.className = 'chip';
  exportBtn.textContent = 'Export';
  exportBtn.addEventListener('click', exportProgress);
  const importBtn = document.createElement('button');
  importBtn.className = 'chip';
  importBtn.textContent = 'Import';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';
  fileInput.className = 'hidden';
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) importProgress(fileInput.files[0]);
    fileInput.value = '';
  });
  importBtn.addEventListener('click', () => fileInput.click());
  chips.appendChild(exportBtn);
  chips.appendChild(importBtn);
  row.appendChild(chips);
  row.appendChild(fileInput);
  return row;
}

function exportProgress() {
  const data = { v: 1, exportedAt: todayStr(), settings: Settings, stats: Stats, save: Store.get(SAVE_KEY, null) };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'oceans-mahjong-backup-' + todayStr() + '.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Progress exported');
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object' || !data.stats) throw new Error('bad file');
      if (data.settings) Store.set(SETTINGS_KEY, data.settings);
      if (data.stats) Store.set(STATS_KEY, data.stats);
      if (data.save) Store.set(SAVE_KEY, data.save);
      showToast('Progress imported — reloading…');
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      showToast('That file could not be read');
    }
  };
  reader.onerror = () => showToast('That file could not be read');
  reader.readAsText(file);
}

/* tile-size control — lives in Options AND the pause menu; all copies stay
   in sync. Past 100% the board overflows and scrolls, staying centred.   */
function tileSizeRow() {
  const row = document.createElement('div');
  row.className = 'set-row';
  row.innerHTML = `<span class="st"><b>Tile size</b><small>Bigger than 100% scrolls within the screen</small></span>`;
  const slider = document.createElement('input');
  slider.type = 'range'; slider.min = '0.85'; slider.max = '1.6'; slider.step = '0.05';
  slider.className = 'slider tile-size-slider'; slider.style.maxWidth = '150px';
  slider.value = Settings.tileScale;
  slider.addEventListener('input', () => {
    Settings.tileScale = parseFloat(slider.value);
    for (const s of document.querySelectorAll('.tile-size-slider')) s.value = Settings.tileScale;
    saveSettings();
    Renderer.relayout();
  });
  row.appendChild(slider);
  return row;
}

function applyAccessibility() {
  const html = document.documentElement;
  html.classList.toggle('large-text', Settings.largeText);
  html.classList.toggle('high-contrast', Settings.highContrast);
  html.classList.toggle('reduced-motion', Settings.reducedMotion);
  document.body.classList.toggle('no-petals', !Settings.petals);
  faceCache.clear();
  if (Game.tiles.length) {
    Renderer.refreshFaces();
    Renderer.updateOpenStates();
  }
}

/* ——— events & boot ——— */

function bindEvents() {
  UI.board.addEventListener('click', e => {
    const el = e.target.closest('.tile');
    if (el) selectTile(parseInt(el.dataset.i, 10));
  });

  for (const btn of document.querySelectorAll('.mode-btn')) {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'daily') { openDailyPanel(); return; }
      if (mode === 'voyage') { renderVoyage(); openModal('voyage'); return; }
      pendingMode = mode;
      buildLayoutGrid(mode === 'expert' ? EXPERT_LAYOUTS : CLASSIC_LAYOUTS);
      openModal('layouts');
    });
  }

  UI.calPrev.addEventListener('click', () => { calM--; if (calM < 0) { calM = 11; calY--; } renderDailyCal(); });
  UI.calNext.addEventListener('click', () => { calM++; if (calM > 11) { calM = 0; calY++; } renderDailyCal(); });
  UI.btnDailyToday.addEventListener('click', () => newGame('daily'));
  UI.calGrid.addEventListener('click', e => {
    const day = e.target.closest('.cal-day[data-date]');
    if (day && !day.classList.contains('future')) newGame('daily', null, null, { date: day.dataset.date });
  });
  UI.voyageMap.addEventListener('click', e => {
    const node = e.target.closest('.voyage-node[data-level]');
    if (node && !node.disabled) newGame('voyage', null, null, { level: +node.dataset.level });
  });
  UI.btnWinNext.addEventListener('click', () => {
    if (Game.nextVoyageLevel >= 0) newGame('voyage', null, null, { level: Game.nextVoyageLevel });
  });
  for (const btn of document.querySelectorAll('[data-modal]')) {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
  }

  UI.btnContinue.addEventListener('click', () => { if (!resumeSavedGame()) updateMenuState(); });
  UI.btnChallenge.addEventListener('click', () => {
    if (!pendingChallenge) return;
    const c = pendingChallenge;
    pendingChallenge = null;
    newGame('classic', c.layoutKey, c.seed, { target: c.target });
  });
  UI.btnWinShare.addEventListener('click', shareResult);
  UI.btnWinGentler.addEventListener('click', () => newGame(Game.mode, Game.layoutKey, null, { target: clamp(Game.target - 0.15, 0, 1) }));
  UI.btnWinHarder.addEventListener('click', () => newGame(Game.mode, Game.layoutKey, null, { target: clamp(Game.target + 0.15, 0, 1) }));
  UI.btnWinRate.addEventListener('click', () => {
    Stats.ratePromptStage = 2;
    saveStats();
    UI.winRateRow.classList.add('hidden');
    window.open(PLAY_STORE_URL, '_blank');
  });
  UI.btnWinRateDismiss.addEventListener('click', () => {
    Stats.ratePromptStage = Stats.ratePromptStage === 0 ? 1 : 2;
    saveStats();
    UI.winRateRow.classList.add('hidden');
  });
  UI.btnIgmenu.addEventListener('click', () => openModal('audio'));
  UI.btnHome.addEventListener('click', quitToMenu);
  UI.btnPause.addEventListener('click', pauseGame);

  // soft tick on every UI button (tiles play their own sounds)
  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b && !b.classList.contains('tile')) AudioEngine.sfx('click');
  }, true);

  // Android hardware/gesture back: close modal → leave game → exit app
  try { history.replaceState({ om: 0 }, ''); history.pushState({ om: 1 }, ''); } catch (e) { }
  window.addEventListener('popstate', () => {
    if (!UI.modalRoot.classList.contains('hidden')) {
      closeModal(false);
      try { history.pushState({ om: 1 }, ''); } catch (e) { }
    } else if (UI.screenGame.classList.contains('active')) {
      quitToMenu();
      try { history.pushState({ om: 1 }, ''); } catch (e) { }
    }
    // at the menu the sentinel is consumed — the next back exits the app
  });
  UI.btnResume.addEventListener('click', resumeGame);
  UI.btnUndo.addEventListener('click', undoMove);
  UI.btnHint.addEventListener('click', showHint);
  UI.btnShuffle.addEventListener('click', () => doShuffle(false));
  UI.btnRestart.addEventListener('click', restartGame);
  UI.btnNewboard.addEventListener('click', newBoardGame);
  UI.btnQuit.addEventListener('click', quitToMenu);
  UI.btnPauseAudio.addEventListener('click', () => openModal('audio'));
  UI.btnWinNew.addEventListener('click', newBoardGame);
  UI.btnWinMenu.addEventListener('click', quitToMenu);
  UI.btnWinBonus.addEventListener('click', () => newGame('bonus'));
  UI.btnTimeupRetry.addEventListener('click', () => newGame('bonus'));
  UI.btnTimeupMenu.addEventListener('click', quitToMenu);
  UI.btnStuckShuffle.addEventListener('click', () => doShuffle(false));
  UI.btnStuckUndo.addEventListener('click', undoMove);
  UI.btnStuckRestart.addEventListener('click', restartGame);
  UI.btnStuckMenu.addEventListener('click', quitToMenu);
  UI.modalClose.addEventListener('click', () => closeModal(false));
  UI.modalBackdrop.addEventListener('click', () => closeModal(false));

  let resetArmed = false;
  UI.btnResetStats.addEventListener('click', () => {
    if (!resetArmed) {
      resetArmed = true;
      UI.btnResetStats.textContent = 'Tap again to erase all statistics';
      setTimeout(() => { resetArmed = false; UI.btnResetStats.textContent = 'Reset statistics'; }, 2600);
      return;
    }
    Stats = Object.assign({}, DEFAULT_STATS, { dailyDates: {}, layoutStars: {}, voyage: {}, times: {} });
    saveStats();
    renderStats();
    updateMenuState();
    resetArmed = false;
    UI.btnResetStats.textContent = 'Reset statistics';
    showToast('Statistics cleared');
  });

  document.addEventListener('pointerdown', () => AudioEngine.unlock(), { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (Game.state === 'playing') pauseGame();
      saveGame();
    }
  });
  window.addEventListener('pagehide', saveGame);

  let resizeT = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { FX.resize(); Renderer.relayout(); }, 120);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!UI.modalRoot.classList.contains('hidden')) closeModal(false);
      else if (Game.state === 'playing') pauseGame();
    }
  });

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstall = e;
    UI.btnInstall.classList.remove('hidden');
  });
  UI.btnInstall.addEventListener('click', async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    await deferredInstall.userChoice.catch(() => { });
    deferredInstall = null;
    UI.btnInstall.classList.add('hidden');
  });
  window.addEventListener('appinstalled', () => UI.btnInstall.classList.add('hidden'));
}

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => { });
  });
}

function boot() {
  cacheUI();
  loadSettings();
  if (!Store.get(SETTINGS_KEY, null) && typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Settings.reducedMotion = true;
  }
  if (!THEMES[Settings.theme] || !themeUnlocked(Settings.theme)) Settings.theme = 'gem';
  for (const k of Object.keys(THEMES)) document.body.classList.remove('theme-' + k);
  document.body.classList.add('theme-' + Settings.theme);
  applyAccessibility();
  buildThemeGrid();
  buildAudioPanel();
  buildSettingsPanel();
  const pausePanel = document.getElementById('panel-pause');
  pausePanel.insertBefore(tileSizeRow(), pausePanel.querySelector('.stack'));
  bindEvents();
  FX.init();
  spawnPetals();
  checkChallengeLink();
  checkShortcutLink();
  updateMenuState();
  document.getElementById('app-version').textContent = 'v' + APP_VERSION;
  registerSW();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
  const splash = UI.splash;
  setTimeout(() => {
    splash.classList.add('gone');
    setTimeout(() => splash.remove(), 600);
  }, 320);
}

/* ───────────────────────── exports / start ───────────────────────── */

const OM = {
  KINDS, matchKeyOf, buildPairPool, LAYOUTS, CLASSIC_LAYOUTS, EXPERT_LAYOUTS, DAILY_LAYOUTS,
  buildLayout, buildRandom, validateLayout, isOpenAt, dealSolvable, verifySolution,
  findMoves, makeRng, seedHash,
  playoutOnce, scoreDeal, chooseDeal, starsFor, computeDailyStreak, dailyTrophies,
  VOYAGE_LEVELS, dateToStr
};

if (typeof window !== 'undefined') {
  window.OM = OM;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}
if (typeof module !== 'undefined' && module.exports) module.exports = OM;
