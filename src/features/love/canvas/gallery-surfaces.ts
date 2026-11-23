import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
} from 'three';

import { mulberry32 } from './heart-geometry';

// Phase 12 surfaces (ADR-0036). Procedural canvas textures now; once the owner approves CC0 picks
// (ambientCG / Poly Haven, 1K WebP in public/textures/gallery/ with CREDITS.md), list them here and
// they replace the procedural map of the same name.
export const CC0_MAPS: Partial<Record<SurfaceName, string>> = {};

export type SurfaceName = 'floor' | 'wallpaper' | 'wainscot';

function canvas(size: number, paint: (c: CanvasRenderingContext2D) => void) {
  const el = document.createElement('canvas');
  el.width = el.height = size;
  const ctx = el.getContext('2d');
  if (ctx) paint(ctx);
  const t = new CanvasTexture(el);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// Polished planks: warm brown boards with grain streaks and darker seams.
function floor() {
  const rand = mulberry32(7);
  return canvas(512, (c) => {
    const boards = 4;
    const w = 512 / boards;
    for (let b = 0; b < boards; b++) {
      const l = 22 + rand() * 8;
      c.fillStyle = `hsl(22 45% ${l}%)`;
      c.fillRect(b * w, 0, w, 512);
      for (let g = 0; g < 26; g++) {
        c.strokeStyle = `hsla(20 50% ${l - 8}% / ${0.15 + rand() * 0.2})`;
        c.lineWidth = 1 + rand() * 2;
        const x = b * w + rand() * w;
        c.beginPath();
        c.moveTo(x, 0);
        c.bezierCurveTo(x + 6, 170, x - 6, 340, x + rand() * 4, 512);
        c.stroke();
      }
      c.fillStyle = 'hsl(20 40% 9%)';
      c.fillRect(b * w, 0, 2, 512);
      c.fillRect(b * w, (rand() * 512) | 0, w, 2);
    }
  });
}

// Aubergine damask: a soft diamond lattice with gold-tinted motifs.
function wallpaper() {
  return canvas(256, (c) => {
    c.fillStyle = '#4a1f3a';
    c.fillRect(0, 0, 256, 256);
    c.strokeStyle = 'rgba(201,162,74,0.16)';
    c.lineWidth = 2;
    for (const [x, y] of [
      [128, 0],
      [0, 128],
      [256, 128],
      [128, 256],
    ]) {
      c.beginPath();
      c.ellipse(x, y, 46, 70, 0, 0, Math.PI * 2);
      c.stroke();
    }
    c.fillStyle = 'rgba(201,162,74,0.12)';
    c.beginPath();
    c.ellipse(128, 128, 22, 38, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.18)';
    c.lineWidth = 1;
    for (let i = 0; i < 256; i += 32) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i, 256);
      c.stroke();
    }
  });
}

// Dark wood panels with a lighter bevel line.
function wainscot() {
  const rand = mulberry32(11);
  return canvas(256, (c) => {
    c.fillStyle = '#2e1a12';
    c.fillRect(0, 0, 256, 256);
    for (let g = 0; g < 40; g++) {
      c.strokeStyle = `rgba(0,0,0,${0.1 + rand() * 0.15})`;
      const y = rand() * 256;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(256, y + rand() * 6 - 3);
      c.stroke();
    }
    c.strokeStyle = 'rgba(201,162,74,0.25)';
    c.lineWidth = 2;
    c.strokeRect(18, 30, 220, 196);
    c.strokeStyle = 'rgba(0,0,0,0.4)';
    c.strokeRect(22, 34, 212, 188);
  });
}

const makers: Record<SurfaceName, () => Texture> = {
  floor,
  wallpaper,
  wainscot,
};

export function surfaceTexture(name: SurfaceName): Texture {
  const t = makers[name]();
  const url = CC0_MAPS[name];
  if (url)
    new TextureLoader().load(url, (img) => {
      t.image = img.image;
      t.needsUpdate = true;
      img.dispose();
    });
  return t;
}

// Decor: an aged map (non-interactive).
export function oldMapTexture() {
  const rand = mulberry32(23);
  return canvas(256, (c) => {
    const g = c.createRadialGradient(128, 128, 30, 128, 128, 180);
    g.addColorStop(0, '#e9d7ad');
    g.addColorStop(1, '#a88a55');
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    c.strokeStyle = 'rgba(90,60,30,0.55)';
    c.lineWidth = 1.5;
    for (let k = 0; k < 3; k++) {
      c.beginPath();
      let x = 40 + rand() * 60;
      let y = 40 + rand() * 170;
      c.moveTo(x, y);
      for (let i = 0; i < 14; i++) {
        x += rand() * 22 - 4;
        y += rand() * 24 - 12;
        c.lineTo(x, y);
      }
      c.stroke();
    }
    c.strokeStyle = 'rgba(90,60,30,0.3)';
    for (let i = 32; i < 256; i += 32) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i, 256);
      c.moveTo(0, i);
      c.lineTo(256, i);
      c.stroke();
    }
    c.beginPath();
    c.arc(200, 200, 22, 0, Math.PI * 2);
    c.moveTo(200, 172);
    c.lineTo(200, 228);
    c.moveTo(172, 200);
    c.lineTo(228, 200);
    c.stroke();
  });
}

// Decor: a hazy antique mirror (no real reflection; Tech Stack avoid list).
export function mirrorTexture() {
  return canvas(128, (c) => {
    const g = c.createLinearGradient(0, 0, 128, 128);
    g.addColorStop(0, '#6d6470');
    g.addColorStop(0.45, '#b9b0b8');
    g.addColorStop(0.55, '#8d8490');
    g.addColorStop(1, '#3e3540');
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
  });
}

// Soft round glow for fake light pools, the end glow and the doorway.
export function glowTexture() {
  return canvas(128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,236,200,1)');
    g.addColorStop(0.35, 'rgba(255,214,150,0.45)');
    g.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
  });
}
