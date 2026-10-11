#!/usr/bin/env node
/* FIRST-PASS ART (dev only). Cut-paper SVG for every slot in docs/art/ASSET-LIST.md, rendered
   through Chromium and cut to 512 WebP by tools/webp.py. These are placeholders with the right
   silhouettes so the game reads as a town before Stephen's Blender renders land; his files
   replace these one by one (same names, docs/ART-BRIEF.md). Rules kept: no text in any image,
   no coins, arrows, numbers, gold or sparkle; busy means more customers, quiet means fewer;
   a closed shop looks like a fresh start; nobody looks sad, greedy or triumphant.

     node tools/gen_art.mjs                 # all slots into art/, then art/manifest.json
     node tools/gen_art.mjs --only shop-bake-busy,keeper-bram-talking
     node tools/gen_art.mjs --sheet         # also writes renders/sheet.html for a visual check  */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'art'), TMP = path.join(ROOT, 'renders');
const INK = '#2B2420', PAPER = '#F4ECDC', CREAM = '#FBF6EA', WOOD = '#C9A878', GREEN = '#8CC084', DARKGREEN = '#4E7D5B', GREY = '#B9B2A6', SKY = '#DCE9F2';
const SHOP = {
  lemn: { wall: '#F3D56A', roof: '#D9834F', trim: '#E86A5C', sign: '#FBF6EA' },
  bake: { wall: '#EAC39A', roof: '#B5533C', trim: '#8E3B2A', sign: '#FBF6EA' },
  toys: { wall: '#8FBFE6', roof: '#E07A6C', trim: '#3F6FA3', sign: '#FBF6EA' },
  bike: { wall: '#A9CF9A', roof: '#4E7D5B', trim: '#2F5A3D', sign: '#FBF6EA' },
  paws: { wall: '#EFB7D1', roof: '#8E5A7C', trim: '#6B3F5C', sign: '#FBF6EA' },
  robo: { wall: '#B4C4DB', roof: '#4C5F7C', trim: '#2E3D55', sign: '#FBF6EA' } };
const KEEPER = { lou: ['lemur', 'lemn'], bram: ['badger', 'bake'], ottilie: ['otter', 'toys'], hop: ['hare', 'bike'], hazel: ['hedgehog', 'paws'], fen: ['fox', 'robo'] };
const NEIGHBOR = { ada: ['owl', '#D8B4E2'], bo: ['tortoise', '#A8C7A1'], cass: ['magpie', '#9FC5E8'], dev: ['goat', '#F2C078'] };
const FUR = { lemur: '#B8B0A4', badger: '#6E6660', otter: '#A9733F', hare: '#D9B98A', hedgehog: '#B98A5E', fox: '#E08A3C', owl: '#B48A5A', tortoise: '#8FA86A', magpie: '#3A3F4A', goat: '#E8E2D2' };

/* ---- svg helpers: every shape is cut paper, so ink outline plus a soft shadow ---- */
const DEFS = `<defs>
  <filter id="grain" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0.10 0" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>
  <filter id="lift" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#2B2420" flood-opacity="0.18"/></filter>
</defs>`;
const A = o => Object.entries(o).map(([k, v]) => ` ${k}="${v}"`).join('');
const P = (fill, extra = {}) => A({ fill, stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...extra });
const rect = (x, y, w, h, fill, r = 6, extra = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"${P(fill, extra)}/>`;
const circ = (cx, cy, r, fill, extra = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}"${P(fill, extra)}/>`;
const ell = (cx, cy, rx, ry, fill, extra = {}) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${P(fill, extra)}/>`;
const poly = (pts, fill, extra = {}) => `<polygon points="${pts}"${P(fill, extra)}/>`;
const pth = (d, fill = 'none', extra = {}) => `<path d="${d}"${P(fill, extra)}/>`;
const ln = (x1, y1, x2, y2, extra = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${A({ stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round', ...extra })}/>`;
const lift = inner => `<g filter="url(#lift)">${inner}</g>`;
const grain = inner => `<g filter="url(#grain)">${inner}</g>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;
const groundShadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="12" fill="#2B2420" opacity="0.10"/>`;

/* ---- small props shared across slots ---- */
const face = (cx, cy, open = false, scale = 1) => `${circ(cx - 14 * scale, cy - 4 * scale, 4 * scale, INK)}${circ(cx + 14 * scale, cy - 4 * scale, 4 * scale, INK)}${open ? ell(cx, cy + 14 * scale, 7 * scale, 5 * scale, '#7A3B3B') : pth(`M${cx - 10 * scale} ${cy + 10 * scale} Q${cx} ${cy + 20 * scale} ${cx + 10 * scale} ${cy + 10 * scale}`)}`;
const smallAnimal = (x, y, fill, ears = 'round') => { /* a customer in the queue: body, head, two ears */
  const e = ears === 'long' ? `${ell(x - 10, y - 42, 5, 14, fill)}${ell(x + 10, y - 42, 5, 14, fill)}` : ears === 'point' ? `${poly(`${x - 18},${y - 26} ${x - 10},${y - 44} ${x - 2},${y - 28}`, fill)}${poly(`${x + 2},${y - 28} ${x + 10},${y - 44} ${x + 18},${y - 26}`, fill)}` : `${circ(x - 13, y - 36, 7, fill)}${circ(x + 13, y - 36, 7, fill)}`;
  return `${ell(x, y + 6, 18, 22, fill)}${e}${circ(x, y - 24, 17, fill)}${face(x, y - 24, false, 0.5)}`; };
const cat = (x, y) => `${ell(x, y, 30, 14, '#8C8076')}${circ(x + 22, y - 6, 11, '#8C8076')}${poly(`${x + 14},${y - 12} ${x + 17},${y - 24} ${x + 23},${y - 14}`, '#8C8076')}${poly(`${x + 24},${y - 14} ${x + 30},${y - 24} ${x + 32},${y - 12}`, '#8C8076')}${pth(`M${x - 28} ${y + 2} q-14 -18 2 -26`)}`;
const broom = (x, y) => `${ln(x, y - 110, x + 14, y)}${poly(`${x + 2},${y - 30} ${x + 34},${y - 22} ${x + 28},${y + 4} ${x + 6},${y + 2}`, WOOD)}`;
const crate = (x, y, w = 56, h = 40, fill = WOOD) => `${rect(x, y, w, h, fill, 3)}${ln(x + 6, y + h / 2, x + w - 6, y + h / 2)}${ln(x + w / 2, y + 6, x + w / 2, y + h - 6)}`;
const openSign = (x, y) => `${ln(x, y, x, y - 70)}${rect(x - 34, y - 70, 68, 36, CREAM, 4)}${circ(x, y - 52, 9, '#E9B949')}`;   /* a hanging board with a sun, no letters */
const flag = (x, y, fill) => `${ln(x, y, x, y - 70)}${poly(`${x},${y - 70} ${x + 44},${y - 58} ${x},${y - 44}`, fill)}`;
const bunting = (x1, y1, x2, y2, shapes = 'tri', n = 7) => { let s = pth(`M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 36} ${x2} ${y2}`); const cols = ['#E86A5C', '#6EA7D9', '#F2C078', '#8CC084', '#EFB7D1'];
  for (let i = 1; i < n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (Math.max(y1, y2) + 36) + t * t * y2, c = cols[i % cols.length];
    s += shapes === 'tri' ? poly(`${x - 14},${y} ${x + 14},${y} ${x},${y + 30}`, c) : shapes === 'circ' ? circ(x, y + 14, 12, c) : pth(`M${x} ${y} q-18 14 0 34 q18 -20 0 -34`, c); } return s; };
const sapling = (x, y, fill = GREEN) => `${rect(x - 22, y - 30, 44, 34, '#C9825F', 6)}${ln(x, y - 30, x, y - 80)}${ell(x - 14, y - 78, 14, 9, fill)}${ell(x + 14, y - 90, 14, 9, fill)}${ell(x, y - 104, 12, 9, fill)}`;

/* ---- storefronts ---- */
function building(id) {
  const c = SHOP[id]; let s = '';
  s += groundShadow(256, 452, 200);
  s += rect(96, 236, 320, 206, c.wall, 8);                                    /* facade */
  s += poly('80,240 256,140 432,240', c.roof);                                 /* roof */
  s += rect(112, 300, 120, 86, CREAM, 6);                                       /* left window */
  s += ln(172, 300, 172, 386); s += ln(112, 343, 232, 343);
  s += rect(300, 300, 100, 86, CREAM, 6);                                      /* right window */
  s += ln(350, 300, 350, 386); s += ln(300, 343, 400, 343);
  s += rect(236, 344, 56, 98, c.trim, 6);                                      /* door, open: a lighter inner panel */
  s += rect(246, 354, 36, 78, CREAM, 4);
  s += rect(176, 252, 160, 40, c.sign, 6);                                     /* sign board, no text */
  s += ell(256, 272, 10, 6, c.trim);
  return s;
}
function shopProps(id) {
  const c = SHOP[id];
  switch (id) {
    case 'lemn': return `${poly('96,296 128,236 384,236 416,296', c.trim)}${[0, 1, 2, 3, 4, 5].map(i => rect(104 + i * 52, 240, 26, 56, CREAM, 0, { stroke: 'none' })).join('')}${pth('M96 296 L416 296', 'none')}${rect(110, 392, 110, 50, WOOD, 4)}${rect(140, 352, 42, 44, '#FBE49A', 10)}${ell(161, 352, 14, 6, CREAM)}${crate(330, 400, 64, 42)}${circ(346, 392, 9, '#F3D56A')}${circ(366, 388, 9, '#F3D56A')}${circ(384, 394, 9, '#F3D56A')}`;
    case 'bake': return `${circ(350, 343, 44, CREAM)}${ln(350, 299, 350, 387)}${ln(306, 343, 394, 343)}${rect(340, 150, 34, 70, '#8E5A4A', 4)}${ell(176, 426, 40, 16, WOOD)}${ell(166, 414, 12, 8, '#D9A66A')}${ell(186, 412, 12, 8, '#D9A66A')}${ell(176, 420, 12, 8, '#D9A66A')}`;
    case 'toys': return `${rect(112, 262, 120, 124, CREAM, 6)}${circ(146, 346, 16, '#E86A5C')}${rect(176, 330, 40, 40, '#6EA7D9', 4)}${rect(188, 300, 28, 28, '#F2C078', 4)}${poly('256,150 290,186 256,222 222,186', '#E86A5C')}${pth('M256 222 q-10 30 10 44 q-16 16 0 30')}`;
    case 'bike': return `${circ(256, 196, 34, CREAM)}${[0, 45, 90, 135].map(a => ln(256 + 30 * Math.cos(a * Math.PI / 180), 196 + 30 * Math.sin(a * Math.PI / 180), 256 - 30 * Math.cos(a * Math.PI / 180), 196 - 30 * Math.sin(a * Math.PI / 180))).join('')}${ln(110, 442, 110, 400)}${ln(150, 442, 150, 400)}${ln(190, 442, 190, 400)}${ln(100, 400, 200, 400)}${circ(340, 422, 20, CREAM)}${circ(396, 422, 20, CREAM)}${pth('M340 422 L362 388 L396 422 M362 388 L384 388 M356 388 L352 380', 'none')}`;
    case 'paws': return `${pth('M236 442 V372 a20 20 0 0 1 56 0 V442 Z', c.trim)}${circ(256, 272, 14, c.trim)}${circ(246, 258, 5, c.trim)}${circ(256, 254, 5, c.trim)}${circ(266, 258, 5, c.trim)}${circ(239, 266, 5, c.trim)}${ell(356, 432, 30, 10, '#6EA7D9')}${ell(356, 428, 22, 6, '#DCE9F2')}`;
    case 'robo': return `${ln(256, 140, 256, 96)}${circ(256, 90, 14, '#E86A5C')}${rect(312, 318, 76, 52, '#DCE9F2', 6)}${circ(334, 344, 8, '#E86A5C')}${circ(366, 344, 8, '#6EA7D9')}${ln(312, 358, 388, 358)}`;
  }
  return '';
}
function queue(id) { const fills = ['#D9B98A', '#E08A3C', '#B8B0A4']; return smallAnimal(190, 430, fills[0], 'long') + smallAnimal(150, 436, fills[1], 'point') + smallAnimal(110, 440, fills[2], 'round'); }
function storefront(id, state) {
  let s = lift(building(id) + shopProps(id));
  if (state === 'busy') s += openSign(430, 440) + queue(id) + crate(336, 402, 56, 40);
  if (state === 'quiet') s += cat(176, 436) + broom(440, 440);
  if (state === 'special') s += flag(256, 140, SHOP[id].trim) + bunting(96, 232, 416, 232, 'tri', 8) + queue(id) + smallAnimal(360, 440, '#8FA86A', 'round');
  if (state === 'closed') {
    s = lift(building(id).replace(rect(246, 354, 36, 78, CREAM, 4), rect(246, 354, 36, 78, SHOP[id].trim, 4)) + shopProps(id));
    s += poly('106,318 238,372 232,388 100,334', WOOD) + poly('100,370 232,316 238,332 106,386', WOOD) + poly('294,318 406,372 400,388 288,334', WOOD) + poly('288,370 400,316 406,332 294,386', WOOD);
    s += circ(256, 272, 26, '#F2C078') + sapling(150, 442, GREEN) + circ(256, 272, 10, CREAM);
  }
  return svg(512, 512, grain(s));
}

/* ---- characters: waist-up portraits ---- */
function head(species, cx, cy, talking) {
  const f = FUR[species]; let s = '';
  switch (species) {
    case 'lemur': s += pth(`M${cx + 60} ${cy + 60} q60 -40 20 -120 q-30 -40 -60 -10`, '#8C8076', { 'stroke-dasharray': '18 10' }) + circ(cx, cy, 58, f) + circ(cx - 22, cy - 6, 16, '#4A4440') + circ(cx + 22, cy - 6, 16, '#4A4440') + circ(cx, cy + 22, 16, CREAM); break;
    case 'badger': s += circ(cx - 46, cy - 40, 14, f) + circ(cx + 46, cy - 40, 14, f) + circ(cx, cy, 58, CREAM) + poly(`${cx - 30},${cy - 56} ${cx - 10},${cy - 56} ${cx - 16},${cy + 30} ${cx - 34},${cy + 10}`, f) + poly(`${cx + 30},${cy - 56} ${cx + 10},${cy - 56} ${cx + 16},${cy + 30} ${cx + 34},${cy + 10}`, f); break;
    case 'otter': s += circ(cx - 44, cy - 34, 12, f) + circ(cx + 44, cy - 34, 12, f) + circ(cx, cy, 58, f) + ell(cx, cy + 18, 30, 20, '#D9B98A') + ln(cx - 46, cy + 16, cx - 28, cy + 20) + ln(cx + 28, cy + 20, cx + 46, cy + 16); break;
    case 'hare': s += ell(cx - 26, cy - 80, 14, 44, f) + ell(cx + 26, cy - 80, 14, 44, f) + ell(cx - 26, cy - 80, 6, 28, '#EFB7D1', { stroke: 'none' }) + ell(cx + 26, cy - 80, 6, 28, '#EFB7D1', { stroke: 'none' }) + circ(cx, cy, 58, f) + ell(cx, cy + 20, 22, 14, CREAM); break;
    case 'hedgehog': s += pth(`M${cx - 60} ${cy + 10} l-14 -40 l26 14 l-6 -44 l26 22 l2 -44 l22 30 l14 -36 l10 40 l24 -24 l-6 42 l24 -8 l-20 36`, '#6E5538') + ell(cx, cy + 6, 56, 50, f) + poly(`${cx + 40},${cy + 10} ${cx + 76},${cy + 26} ${cx + 44},${cy + 36}`, f) + circ(cx + 76, cy + 26, 6, INK); break;
    case 'fox': s += poly(`${cx - 58},${cy - 24} ${cx - 44},${cy - 96} ${cx - 10},${cy - 48}`, f) + poly(`${cx + 58},${cy - 24} ${cx + 44},${cy - 96} ${cx + 10},${cy - 48}`, f) + circ(cx, cy, 58, f) + ell(cx, cy + 24, 34, 24, CREAM) + circ(cx, cy + 14, 7, INK); break;
    case 'owl': s += circ(cx, cy, 60, f) + circ(cx - 22, cy - 6, 22, CREAM) + circ(cx + 22, cy - 6, 22, CREAM) + poly(`${cx - 8},${cy + 10} ${cx + 8},${cy + 10} ${cx},${cy + 28}`, '#F2C078') + poly(`${cx - 54},${cy - 36} ${cx - 44},${cy - 74} ${cx - 20},${cy - 50}`, f) + poly(`${cx + 54},${cy - 36} ${cx + 44},${cy - 74} ${cx + 20},${cy - 50}`, f); break;
    case 'tortoise': s += circ(cx, cy, 52, f) + ell(cx, cy + 24, 24, 12, '#C9D9B0'); break;
    case 'magpie': s += circ(cx, cy, 56, f) + ell(cx, cy + 20, 30, 22, CREAM) + poly(`${cx + 30},${cy + 2} ${cx + 78},${cy + 14} ${cx + 30},${cy + 26}`, '#F2C078'); break;
    case 'goat': s += pth(`M${cx - 40} ${cy - 50} q-30 -40 -4 -70`) + pth(`M${cx + 40} ${cy - 50} q30 -40 4 -70`) + ell(cx - 54, cy - 10, 14, 26, f) + ell(cx + 54, cy - 10, 14, 26, f) + circ(cx, cy, 56, f) + ell(cx, cy + 26, 26, 18, '#EFB7D1') + pth(`M${cx - 10} ${cy + 52} q10 30 20 0`, '#D9B98A'); break;
  }
  const open = talking; const fy = species === 'hedgehog' ? cy + 8 : cy;
  if (species === 'owl') s += circ(cx - 22, fy - 6, 6, INK) + circ(cx + 22, fy - 6, 6, INK) + (open ? ell(cx, fy + 44, 8, 5, '#7A3B3B') : '');
  else if (species === 'magpie') s += circ(cx - 18, fy - 10, 5, CREAM) + circ(cx + 18, fy - 10, 5, CREAM) + circ(cx - 18, fy - 10, 2, INK) + circ(cx + 18, fy - 10, 2, INK);
  else if (species === 'hedgehog') s += circ(cx + 20, fy - 2, 5, INK) + circ(cx + 48, fy + 2, 4, INK) + pth(`M${cx + 24} ${fy + 14} q14 10 26 0`);
  else s += face(cx, fy, open, 1);
  return s;
}
function body(cx, top, wear, color, pose, prop) {
  let s = ell(cx, top + 130, 86, 110, color);                                   /* torso */
  if (wear === 'apron') s += rect(cx - 48, top + 60, 96, 150, CREAM, 10) + ln(cx - 30, top + 60, cx - 10, top + 20) + ln(cx + 30, top + 60, cx + 10, top + 20);
  if (wear === 'cardigan') s += pth(`M${cx - 60} ${top + 60} q60 30 120 0 v140 h-120z`, '#D8B4E2') + ln(cx, top + 70, cx, top + 200) + circ(cx, top + 110, 5, INK) + circ(cx, top + 150, 5, INK);
  if (wear === 'scarf') s += rect(cx - 70, top + 44, 140, 34, '#E86A5C', 14) + rect(cx + 20, top + 70, 32, 80, '#E86A5C', 10);
  /* arms */
  const raised = pose === 'talking';
  s += ell(cx - 96, raised ? top + 60 : top + 150, 22, raised ? 60 : 50, color, raised ? { transform: `rotate(-30 ${cx - 96} ${top + 60})` } : {});
  s += ell(cx + 96, top + 150, 22, 50, color);
  if (raised) s += circ(cx - 118, top + 10, 16, color);
  /* a prop in the right hand */
  if (pose === 'busy' || prop) {
    const px = cx + 96, py = top + 110;
    switch (prop) {
      case 'tray': s += ell(px, py, 44, 14, WOOD) + ell(px - 18, py - 8, 12, 8, '#D9A66A') + ell(px + 6, py - 10, 12, 8, '#D9A66A') + ell(px + 26, py - 6, 10, 7, '#D9A66A'); break;
      case 'jug': s += rect(px - 20, py - 30, 40, 50, '#FBE49A', 10) + ell(px, py - 30, 14, 6, CREAM) + pth(`M${px + 20} ${py - 18} q22 10 0 30`); break;
      case 'kite': s += poly(`${px},${py - 60} ${px + 30},${py - 24} ${px},${py + 12} ${px - 30},${py - 24}`, '#E86A5C') + pth(`M${px} ${py + 12} q-10 24 8 36`); break;
      case 'wrench': s += rect(px - 8, py - 40, 16, 70, GREY, 6) + circ(px, py - 44, 16, GREY) + circ(px, py - 44, 6, PAPER); break;
      case 'brush': s += rect(px - 6, py - 30, 12, 64, WOOD, 4) + rect(px - 16, py - 50, 32, 24, '#6EA7D9', 6); break;
      case 'screwdriver': s += rect(px - 7, py - 36, 14, 40, '#E86A5C', 6) + ln(px, py + 4, px, py + 40); break;
      case 'basket': s += pth(`M${px - 30} ${py} h60 l-8 36 h-44 z`, WOOD) + pth(`M${px - 20} ${py} q20 -30 40 0`); break;
      case 'jar': s += rect(px - 22, py - 20, 44, 54, '#DCE9F2', 10) + rect(px - 26, py - 30, 52, 14, '#F2C078', 6); break;
      case 'newspaper': s += rect(px - 30, py - 10, 60, 40, CREAM, 4) + ln(px - 20, py + 2, px + 20, py + 2) + ln(px - 20, py + 12, px + 12, py + 12) + ln(px - 20, py + 22, px + 20, py + 22); break;
      case 'pennant': s += ln(px, py - 50, px, py + 30) + poly(`${px},${py - 50} ${px + 50},${py - 36} ${px},${py - 22}`, '#6EA7D9'); break;
    }
  }
  return s;
}
function portrait(species, wear, color, pose, prop, hat) {
  const cx = 256, cy = 190;
  let s = groundShadow(256, 500, 150) + body(cx, 250, wear, color, pose, pose === 'busy' ? prop : (pose !== 'busy' && wear !== 'apron' ? prop : null)) + head(species, cx, cy, pose === 'talking');
  if (hat === 'cap') s += pth(`M${cx - 62} ${cy - 50} q62 -50 124 0 l16 2 q-78 -18 -156 0 z`, '#8E5A4A');
  return svg(512, 512, grain(lift(s)));
}

/* ---- houses, stall, weather, plates ---- */
function house(color) { return svg(512, 512, grain(lift(groundShadow(256, 452, 170) + rect(116, 250, 280, 190, color, 8) + poly('100,254 256,150 412,254', '#8E5A4A') + rect(300, 170, 34, 60, '#8E5A4A', 4) + rect(150, 300, 70, 70, CREAM, 6) + ln(185, 300, 185, 370) + ln(150, 335, 220, 335) + rect(286, 330, 60, 110, '#6B4A3A', 6) + circ(334, 388, 5, '#F2C078') + sapling(416, 440, GREEN)))); }
function stall(ab) {
  let s = groundShadow(256, 460, 200) + rect(90, 330, 332, 110, WOOD, 6) + ln(110, 440, 110, 480) + ln(402, 440, 402, 480);
  s += ln(96, 326, 96, 200) + ln(416, 326, 416, 200) + poly('70,200 442,200 420,150 92,150', '#E86A5C');
  s += [0, 1, 2, 3, 4].map(i => rect(92 + i * 70 + 14, 150, 32, 50, CREAM, 0, { stroke: 'none' })).join('') + pth('M70 200 L442 200', 'none');
  s += rect(120, 220, 272, 96, CREAM, 6) + Object.values(SHOP).map((c, i) => rect(136 + i * 42, 244, 30, 48, c.wall, 4)).join('');
  if (ab) s += ln(150, 200, 150, 236) + rect(126, 236, 48, 56, '#6EA7D9', 8) + ln(362, 200, 362, 236) + rect(338, 236, 48, 56, '#F2C078', 8);
  return svg(512, 512, grain(lift(s)));
}
const cloud = (x, y, k = 1, fill = CREAM) => `${ell(x, y, 60 * k, 28 * k, fill)}${circ(x - 24 * k, y - 10 * k, 26 * k, fill)}${circ(x + 18 * k, y - 16 * k, 32 * k, fill)}${rect(x - 60 * k, y - 2 * k, 120 * k, 30 * k, fill, 14, { stroke: 'none' })}`;
function weather(kind) {
  let s = '';
  if (kind === 'sun') s += circ(410, 80, 44, '#E9B949') + [0, 45, 90, 135, 180, 225, 270, 315].map(a => ln(410 + 58 * Math.cos(a * Math.PI / 180), 80 + 58 * Math.sin(a * Math.PI / 180), 410 + 76 * Math.cos(a * Math.PI / 180), 80 + 76 * Math.sin(a * Math.PI / 180))).join('') + cloud(120, 90, 0.9) + cloud(260, 60, 0.7);
  if (kind === 'rain') { s += cloud(130, 70, 1.1, '#C9C3BA') + cloud(330, 60, 1.2, '#C9C3BA') + cloud(450, 90, 0.8, '#C9C3BA'); for (let i = 0; i < 14; i++) s += ln(60 + i * 32, 130 + (i % 3) * 20, 44 + i * 32, 170 + (i % 3) * 20, { stroke: '#6EA7D9' }); }
  if (kind === 'snow') { s += cloud(140, 70, 1.1) + cloud(340, 60, 1.2) + cloud(460, 90, 0.8); for (let i = 0; i < 12; i++) { const x = 50 + i * 40, y = 140 + (i % 4) * 22; s += [0, 60, 120].map(a => ln(x + 9 * Math.cos(a * Math.PI / 180), y + 9 * Math.sin(a * Math.PI / 180), x - 9 * Math.cos(a * Math.PI / 180), y - 9 * Math.sin(a * Math.PI / 180), { stroke: '#6EA7D9', 'stroke-width': 3 })).join(''); } }
  return svg(512, 256, grain(lift(s)));
}
function plate(kind) {
  if (kind === 'ground') return svg(512, 128, `<rect width="512" height="128" fill="${PAPER}" filter="url(#grain)"/><rect x="0" y="0" width="512" height="18" fill="#E4D7BF"/><rect x="0" y="18" width="512" height="6" fill="#8A7A5C"/>`);
  return svg(512, 128, `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY}"/><stop offset="1" stop-color="${PAPER}"/></linearGradient></defs><rect width="512" height="128" fill="url(#sky)"/><rect width="512" height="128" fill="${PAPER}" opacity="0" filter="url(#grain)"/>`);
}

/* ---- goal pictures ---- */
function goal(slug) {
  let s = groundShadow(256, 440, 170);
  switch (slug) {
    case 'art-supplies': s += rect(140, 220, 150, 190, '#DCE9F2', 16) + rect(132, 206, 166, 30, '#6EA7D9', 8) + ln(180, 206, 170, 110) + ln(214, 206, 220, 100) + ln(250, 206, 266, 120) + rect(160, 92, 22, 24, '#E86A5C', 4) + rect(210, 82, 22, 24, '#F2C078', 4) + rect(256, 102, 22, 24, '#8CC084', 4) + rect(300, 300, 120, 110, CREAM, 8) + ln(300, 330, 420, 330) + ln(320, 360, 400, 360) + rect(330, 240, 50, 60, '#E86A5C', 10); break;
    case 'nature-trip': s += rect(140, 170, 170, 230, '#8CC084', 26) + rect(170, 150, 110, 50, '#4E7D5B', 16) + rect(170, 300, 110, 70, '#4E7D5B', 12) + rect(330, 300, 60, 110, GREY, 10) + rect(300, 120, 150, 110, CREAM, 8) + pth('M320 200 q40 -60 80 -20 q20 20 40 -10', 'none', { stroke: '#6EA7D9' }) + circ(360, 400, 26, '#3A3F4A') + circ(410, 400, 26, '#3A3F4A') + rect(360, 374, 50, 20, '#3A3F4A', 4); break;
    case 'bicycle': s += circ(150, 350, 70, CREAM) + circ(362, 350, 70, CREAM) + [0, 45, 90, 135].map(a => ln(150 + 62 * Math.cos(a * Math.PI / 180), 350 + 62 * Math.sin(a * Math.PI / 180), 150 - 62 * Math.cos(a * Math.PI / 180), 350 - 62 * Math.sin(a * Math.PI / 180), { 'stroke-width': 2 }) + ln(362 + 62 * Math.cos(a * Math.PI / 180), 350 + 62 * Math.sin(a * Math.PI / 180), 362 - 62 * Math.cos(a * Math.PI / 180), 350 - 62 * Math.sin(a * Math.PI / 180), { 'stroke-width': 2 })).join('') + pth('M150 350 L230 230 L330 230 L362 350 M230 230 L270 350 M330 230 L310 190 L340 184 M210 200 L250 200', 'none', { stroke: '#E86A5C', 'stroke-width': 10 }) + pth('M100 250 h90 l-12 44 h-66 z', WOOD); break;
    case 'project-kit': s += rect(110, 240, 290, 170, WOOD, 10) + rect(100, 226, 310, 30, '#A88659', 6) + circ(180, 200, 36, GREY) + circ(180, 200, 12, PAPER) + [0, 60, 120, 180, 240, 300].map(a => rect(180 + 44 * Math.cos(a * Math.PI / 180) - 8, 200 + 44 * Math.sin(a * Math.PI / 180) - 8, 16, 16, GREY, 3)).join('') + pth('M240 220 q30 -60 60 -10 q20 30 50 -10', 'none', { stroke: '#E86A5C', 'stroke-width': 6 }) + rect(300, 150, 90, 80, CREAM, 6) + ln(316, 176, 374, 176) + ln(316, 198, 360, 198); break;
    case 'camp-week': s += poly('100,400 256,170 412,400', '#F2C078') + poly('256,170 256,400 180,400', '#D9A66A') + rect(60, 300, 60, 100, GREY, 12) + circ(90, 300, 20, '#E9B949') + ell(430, 390, 60, 24, '#6EA7D9') + ell(430, 390, 30, 12, '#DCE9F2'); break;
    case 'big-project': s += rect(120, 220, 270, 190, WOOD, 8) + ln(120, 280, 390, 280) + ln(255, 220, 255, 410) + ln(140, 236, 180, 236) + poly('380,150 450,150 460,200 420,240 380,200', CREAM) + pth('M405 170 q20 -14 30 6 q0 14 -14 18 v10 M421 214 v8', 'none', { 'stroke-width': 6 }); break;
  }
  return svg(512, 512, grain(lift(s)));
}

/* ---- decorations ---- */
function deco(family, n) {
  let s = groundShadow(256, 450, 150);
  if (family === 'plants') { s += rect(176, 320, 160, 120, '#C9825F', 10) + rect(166, 306, 180, 30, '#B5533C', 6);
    if (n === 1) for (let i = -2; i <= 2; i++) s += pth(`M256 310 q${i * 40} -80 ${i * 60} -150`, 'none', { stroke: DARKGREEN, 'stroke-width': 8 }) + pth(`M256 310 q${i * 30} -60 ${i * 60} -150`, 'none', { stroke: GREEN, 'stroke-width': 4 });
    if (n === 2) s += ln(256, 310, 256, 190) + ell(216, 200, 30, 16, GREEN) + ell(296, 180, 30, 16, GREEN) + ell(256, 150, 24, 16, GREEN) + circ(236, 236, 12, '#F3D56A') + circ(286, 220, 12, '#F3D56A');
    if (n === 3) for (let i = 0; i < 4; i++) { const x = 196 + i * 40; s += ln(x, 310, x, 240) + circ(x, 222, 22, '#F2C078') + circ(x, 222, 9, '#D9834F'); } }
  if (family === 'bunting') s = bunting(40, 150, 472, 220, n === 1 ? 'tri' : n === 2 ? 'circ' : 'leaf', 8);
  if (family === 'murals') { s += rect(96, 120, 320, 260, CREAM, 8) + ln(120, 380, 120, 440) + ln(392, 380, 392, 440);
    if (n === 1) s += circ(256, 250, 60, '#E9B949') + [0, 45, 90, 135, 180, 225, 270, 315].map(a => ln(256 + 76 * Math.cos(a * Math.PI / 180), 250 + 76 * Math.sin(a * Math.PI / 180), 256 + 96 * Math.cos(a * Math.PI / 180), 250 + 96 * Math.sin(a * Math.PI / 180))).join('');
    if (n === 2) s += circ(196, 290, 44, '#6EA7D9') + circ(316, 290, 44, '#6EA7D9') + pth('M196 290 L240 210 L300 210 L316 290 M240 210 L262 290', 'none', { stroke: '#E86A5C', 'stroke-width': 8 });
    if (n === 3) s += pth('M130 330 q60 -80 120 -40 q60 40 130 -60', 'none', { stroke: '#8CC084', 'stroke-width': 14 }) + rect(150, 180, 40, 40, '#E86A5C', 4) + rect(230, 240, 40, 40, '#F2C078', 4) + rect(320, 200, 40, 40, '#6EA7D9', 4); }
  if (family === 'benches') { s += rect(96, 300, 320, 30, WOOD, 6) + rect(96, 340, 320, 24, WOOD, 6) + rect(110, 230, 292, 30, WOOD, 6) + rect(110, 260, 292, 24, WOOD, 6) + ln(130, 364, 130, 440) + ln(382, 364, 382, 440) + ln(118, 230, 118, 300) + ln(394, 230, 394, 300);
    if (n === 2) s += cat(256, 290);
    if (n === 3) s += pth('M200 300 q56 -30 112 0 v-80 q-56 -30 -112 0 z', CREAM) + ln(256, 220, 256, 300); }
  if (family === 'paths') { s += rect(96, 200, 320, 200, n === 1 ? GREY : n === 2 ? '#C9825F' : WOOD, 8);
    if (n === 1) s += ell(170, 260, 40, 26, '#D5CFC4') + ell(280, 240, 46, 28, '#D5CFC4') + ell(370, 300, 36, 24, '#D5CFC4') + ell(200, 340, 44, 26, '#D5CFC4') + ell(310, 350, 40, 24, '#D5CFC4');
    if (n === 2) for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += rect(104 + c * 78 + (r % 2 ? 39 : 0), 208 + r * 48, 70, 40, '#D9834F', 2);
    if (n === 3) for (let i = 0; i < 6; i++) s += ln(110, 216 + i * 32, 402, 216 + i * 32, { stroke: '#A88659' }); }
  if (family === 'pinwheels') { s += ln(256, 300, 256, 460); const cols = n === 1 ? ['#E86A5C', '#E86A5C'] : n === 2 ? ['#6EA7D9', '#6EA7D9'] : ['#E86A5C', CREAM];
    for (let k = 0; k < 4; k++) { const a = k * 90 * Math.PI / 180, b = (k * 90 + 50) * Math.PI / 180; s += poly(`256,300 ${256 + 110 * Math.cos(a)},${300 + 110 * Math.sin(a)} ${256 + 110 * Math.cos(b)},${300 + 110 * Math.sin(b)}`, cols[k % 2]); }
    s += circ(256, 300, 14, '#F2C078'); }
  return svg(512, 512, grain(lift(s)));
}

/* ---- scrapbook frames, stamps, card back, trees ---- */
function frame(n) {
  const torn = 'M8 20 L40 10 L80 22 L130 8 L190 18 L250 6 L310 20 L370 8 L430 18 L470 6 L504 20 L504 110 L470 118 L420 106 L360 120 L300 108 L240 120 L180 108 L120 118 L60 106 L8 118 Z';
  let s = pth(torn, CREAM) + rect(20, 10, 60, 24, '#F2C078', 3, { opacity: 0.85, transform: 'rotate(-18 50 22)' }) + rect(432, 96, 60, 24, '#F2C078', 3, { opacity: 0.85, transform: 'rotate(14 462 108)' });
  const x = 448, y = 48;
  if (n === 1) s += ell(x, y, 30, 18, '#D9A66A') + pth(`M${x - 16} ${y - 4} q16 -10 32 0`);
  if (n === 2) s += Object.values(SHOP).map((c, i) => rect(x - 36 + (i % 3) * 24, y - 22 + Math.floor(i / 3) * 24, 20, 20, c.wall, 3)).join('');
  if (n === 3) s += rect(x - 20, y - 16, 40, 44, '#DCE9F2', 8) + rect(x - 24, y - 24, 48, 12, '#F2C078', 4);
  if (n === 4) s += rect(x - 32, y - 18, 64, 40, CREAM, 4) + pth(`M${x - 32} ${y - 18} l32 22 l32 -22`);
  if (n === 5) s += cloud(x, y, 0.5, '#C9C3BA') + ln(x - 10, y + 20, x - 16, y + 34, { stroke: '#6EA7D9' }) + ln(x + 10, y + 20, x + 4, y + 34, { stroke: '#6EA7D9' });
  if (n === 6) s += pth(`M${x - 44} ${y - 6} h36 l-6 26 h-24 z`, WOOD) + pth(`M${x + 8} ${y - 6} h36 l-6 26 h-24 z`, WOOD);
  return svg(512, 128, grain(lift(s)));
}
function stamp(dim) {
  let s = circ(256, 256, 200, '#F2C078', { 'stroke-width': 8 }) + circ(256, 256, 170, 'none', { 'stroke-dasharray': '14 12' });
  if (dim === 'goal-fit') s += circ(256, 256, 90, CREAM) + circ(256, 256, 56, '#E86A5C') + circ(256, 256, 22, CREAM) + rect(300, 280, 60, 70, '#DCE9F2', 10) + rect(294, 268, 72, 16, '#6EA7D9', 4);
  if (dim === 'readiness') s += pth('M136 270 a120 120 0 0 1 240 0 z', '#6EA7D9') + ln(256, 150, 256, 270) + ln(256, 270, 256, 350) + pth('M256 350 q0 30 -30 24', 'none') + ln(176, 270, 176, 250) + ln(216, 270, 216, 246) + ln(296, 270, 296, 246) + ln(336, 270, 336, 250);
  if (dim === 'spread') s += [0, 60, 120, 180, 240, 300].map((a, i) => circ(256 + 100 * Math.cos(a * Math.PI / 180), 256 + 100 * Math.sin(a * Math.PI / 180), 26, Object.values(SHOP)[i].wall)).join('');
  if (dim === 'follow-through') s += pth('M150 180 q106 -30 212 0 v160 q-106 -30 -212 0 z', CREAM) + ln(256, 166, 256, 326) + ln(176, 220, 236, 214) + ln(176, 256, 236, 250) + ln(276, 214, 336, 220) + ln(276, 250, 336, 256);
  if (dim === 'cost') s += ln(256, 160, 256, 340) + ln(176, 190, 336, 190) + pth('M136 260 h80 l-40 -70 z', CREAM) + pth('M296 260 h80 l-40 -70 z', CREAM) + rect(216, 340, 80, 16, WOOD, 4);
  return svg(512, 512, grain(lift(s)));
}
function cardBack() { return svg(512, 512, grain(lift(rect(40, 40, 432, 432, CREAM, 24) + rect(70, 70, 372, 372, 'none', 18, { 'stroke-dasharray': '10 10' }) + pth('M256 160 l90 40 v90 q0 60 -90 90 q-90 -30 -90 -90 v-90 z', '#F2C078') + poly('196,300 196,250 226,230 256,250 286,230 316,250 316,300', CREAM) + rect(246, 270, 20, 30, '#E86A5C', 3)))); }
function tree(kind, stage) {
  const leaf = kind === 'cherry' ? '#8CC084' : '#6FA865', trunkH = [40, 70, 100, 130, 150][stage - 1], r = [22, 44, 66, 84, 104][stage - 1];
  let s = groundShadow(256, 456, 60 + r) + rect(246 - stage * 2, 456 - trunkH, 20 + stage * 4, trunkH, '#8E5A4A', 6);
  const cy = 456 - trunkH - r * 0.7;
  s += circ(256, cy, r, leaf) + (stage >= 2 ? circ(256 - r * 0.7, cy + r * 0.3, r * 0.7, leaf) + circ(256 + r * 0.7, cy + r * 0.3, r * 0.7, leaf) : '') + (stage >= 4 ? circ(256 - r * 0.5, cy - r * 0.6, r * 0.6, leaf) + circ(256 + r * 0.5, cy - r * 0.6, r * 0.6, leaf) : '');
  if (kind === 'cherry') for (let i = 0; i < stage * 5; i++) { const a = i * 2.4, d = r * (0.3 + 0.6 * ((i * 7) % 10) / 10); s += circ(256 + d * Math.cos(a), cy + d * Math.sin(a) * 0.8, 7, '#EFB7D1', { 'stroke-width': 2 }); }
  return svg(512, 512, grain(lift(s)));
}
const treeGround = () => svg(512, 128, `<rect width="512" height="128" rx="14" fill="#CFE3B8" filter="url(#grain)"/><rect x="0" y="0" width="512" height="22" rx="10" fill="#A8C98F"/>`);

/* ---- the slot table ---- */
function allSlots() {
  const S = {};
  for (const id of Object.keys(SHOP)) for (const st of ['open', 'busy', 'quiet', 'special']) S[`shop-${id}-${st}`] = () => storefront(id, st);
  for (const id of ['toys', 'robo']) S[`shop-${id}-closed`] = () => storefront(id, 'closed');
  const tool = { lou: 'jug', bram: 'tray', ottilie: 'kite', hop: 'wrench', hazel: 'brush', fen: 'screwdriver' };
  for (const [k, [species, shop]] of Object.entries(KEEPER)) for (const pose of ['neutral', 'talking', 'busy']) S[`keeper-${k}-${pose}`] = () => portrait(species, 'apron', SHOP[shop].wall, pose, tool[k]);
  const wear = { ada: 'cardigan', bo: 'scarf', cass: 'none', dev: 'none' }, prop = { ada: 'basket', bo: 'jar', cass: 'newspaper', dev: 'pennant' };
  for (const [k, [species, color]] of Object.entries(NEIGHBOR)) { for (const pose of ['neutral', 'talking']) S[`neighbor-${k}-${pose}`] = () => portrait(species, wear[k], color, pose, prop[k], k === 'dev' ? 'cap' : null); S[`house-${k}`] = () => house(color); }
  S['stall-normal'] = () => stall(false); S['stall-ab'] = () => stall(true);
  for (const w of ['sun', 'rain', 'snow']) S[`weather-${w}`] = () => weather(w);
  S['plate-ground'] = () => plate('ground'); S['plate-sky'] = () => plate('sky');
  for (const g of ['art-supplies', 'nature-trip', 'bicycle', 'project-kit', 'camp-week', 'big-project']) S[`goal-${g}`] = () => goal(g);
  for (const f of ['plants', 'bunting', 'murals', 'benches', 'paths', 'pinwheels']) for (const n of [1, 2, 3]) S[`deco-${f}-${n}`] = () => deco(f, n);
  for (let n = 1; n <= 6; n++) S[`frame-ch${n}`] = () => frame(n);
  for (const d of ['goal-fit', 'readiness', 'spread', 'follow-through', 'cost']) S[`stamp-${d}`] = () => stamp(d);
  S['card-back'] = cardBack;
  for (const k of ['oak', 'cherry']) for (let st = 1; st <= 5; st++) S[`tree-${k}-${st}`] = () => tree(k, st);
  S['tree-ground'] = treeGround;
  return S;
}

/* ---- render ---- */
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const slots = allSlots(); const names = only.length ? only : Object.keys(slots);
for (const n of names) if (!slots[n]) { console.error('unknown slot', n); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 2 });
const report = [];
for (const name of names) {
  const s = slots[name](); const w = +s.match(/width="(\d+)"/)[1], h = +s.match(/height="(\d+)"/)[1];
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${s}</body></html>`);
  const png = path.join(TMP, name + '.png'); await page.screenshot({ path: png, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  const line = execFileSync('python3', [path.join(ROOT, 'tools', 'webp.py'), png, path.join(OUT, name + '.webp'), '512'], { encoding: 'utf8' }).trim();
  report.push(line); if (/empty=True|corners_clear=False/.test(line)) console.log('  !', line);
}
await browser.close();
if (process.argv.includes('--sheet')) fs.writeFileSync(path.join(TMP, 'sheet.html'), `<!doctype html><meta charset="utf-8"><body style="background:#e8e0d0;font-family:system-ui;display:flex;flex-wrap:wrap;gap:8px;padding:8px">${names.map(n => `<figure style="margin:0;width:150px;text-align:center"><img src="../art/${n}.webp" style="width:150px;background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px"><figcaption style="font-size:11px">${n}</figcaption></figure>`).join('')}</body>`);
const total = names.reduce((n, x) => n + fs.statSync(path.join(OUT, x + '.webp')).size, 0);
console.log(`${names.length} sprites, ${(total / 1024).toFixed(0)} KB total, largest ${Math.max(...names.map(x => fs.statSync(path.join(OUT, x + '.webp')).size)) / 1024 | 0} KB`);
if (!only.length) { execFileSync('node', [path.join(ROOT, 'tools', 'art_manifest.mjs')], { stdio: 'inherit' }); }
