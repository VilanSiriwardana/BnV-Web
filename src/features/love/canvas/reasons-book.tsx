'use client';

import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  type Group,
  MathUtils,
  MeshBasicMaterial,
  type PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  type Texture,
} from 'three';

import { bookPhase, reasons } from '../engine/reasons-state';
import { smallSrc } from '../engine/gallery-textures';
import type { Tier } from '../engine/tiers';
import { pad2 } from '../ui/reasons-ring';
import { readTokenColors } from './token-colors';

// Blueprint 061: Twelve Reasons as a love book. Scroll turns one leaf per reason; spread k shows
// photo k on the left and reason k on the right. Lives in camera space like the petals.
const PAGE_W = 1.35;
const PAGE_H = 1.85;
const DEPTH = 5;
const GAP = 0.0025;
const none = () => null;
const BOARD = '#3a1430';

const photoSrc = (i: number) =>
  `/images/prototype/love-gallery-${String((i % 12) + 1).padStart(2, '0')}.webp`;

const vertex = /* glsl */ `
uniform float uBend;
varying vec2 vUv;
void main() {
  vec3 p = position;
  float u = p.x / ${PAGE_W.toFixed(2)};
  p.z += uBend * u * u * 0.35;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `
uniform sampler2D uFront;
uniform sampler2D uBack;
uniform float uShade;
varying vec2 vUv;
void main() {
  vec4 c = gl_FrontFacing ? texture2D(uFront, vUv) : texture2D(uBack, vec2(1.0 - vUv.x, vUv.y));
  gl_FragColor = vec4(c.rgb * uShade, 1.0);
  #include <colorspace_fragment>
}
`;

type Palette = { bg: string; ink: string; gold: string };

function pageCanvas(w: number) {
  const el = document.createElement('canvas');
  el.width = w;
  el.height = Math.round((w * PAGE_H) / PAGE_W);
  const t = new CanvasTexture(el);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function paintFrame(c: CanvasRenderingContext2D, p: Palette) {
  const { width: w, height: h } = c.canvas;
  c.fillStyle = p.bg;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = p.gold;
  c.globalAlpha = 0.55;
  c.lineWidth = w * 0.006;
  c.strokeRect(w * 0.05, w * 0.05, w * 0.9, h - w * 0.1);
  c.globalAlpha = 1;
}

function wrapText(c: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (c.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function paintReason(
  t: Texture,
  i: number,
  text: string,
  p: Palette,
  font: string,
) {
  const cv = t.image as HTMLCanvasElement;
  const c = cv.getContext('2d');
  if (!c) return;
  const { width: w, height: h } = cv;
  paintFrame(c, p);
  c.fillStyle = p.gold;
  c.textAlign = 'center';
  c.font = `500 ${w * 0.05}px ${font}`;
  c.letterSpacing = `${w * 0.012}px`;
  c.fillText(pad2(i), w / 2, h * 0.2);
  c.letterSpacing = '0px';
  c.fillStyle = p.ink;
  const size = w * 0.085;
  c.font = `italic 400 ${size}px ${font}`;
  const lines = wrapText(c, text, w * 0.72);
  const top = h / 2 - ((lines.length - 1) * size * 1.3) / 2;
  lines.forEach((l, k) => c.fillText(l, w / 2, top + k * size * 1.3));
  c.fillStyle = p.gold;
  c.font = `${w * 0.06}px ${font}`;
  c.fillText('♥', w / 2, h * 0.86);
  t.needsUpdate = true;
}

// Blueprint 065: the closed front cover, readable before the first turn.
function paintCover(t: Texture, p: Palette, board: string, font: string) {
  const cv = t.image as HTMLCanvasElement;
  const c = cv.getContext('2d');
  if (!c) return;
  const { width: w, height: h } = cv;
  const g = c.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, board);
  g.addColorStop(1, '#22091c');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = p.gold;
  c.lineWidth = w * 0.008;
  c.strokeRect(w * 0.07, w * 0.07, w * 0.86, h - w * 0.14);
  c.lineWidth = w * 0.003;
  c.strokeRect(w * 0.1, w * 0.1, w * 0.8, h - w * 0.2);
  c.fillStyle = p.gold;
  c.textAlign = 'center';
  c.font = `500 ${w * 0.035}px ${font}`;
  c.letterSpacing = `${w * 0.012}px`;
  c.fillText('TWELVE REASONS', w / 2, h * 0.3);
  c.letterSpacing = '0px';
  c.font = `italic 400 ${w * 0.13}px ${font}`;
  c.fillText('Why I', w / 2, h * 0.46);
  c.fillText('love you', w / 2, h * 0.46 + w * 0.15);
  c.font = `${w * 0.09}px ${font}`;
  c.fillText('♥', w / 2, h * 0.78);
  t.needsUpdate = true;
}

function paintPhoto(t: Texture, img: HTMLImageElement | null, p: Palette) {
  const cv = t.image as HTMLCanvasElement;
  const c = cv.getContext('2d');
  if (!c) return;
  const { width: w, height: h } = cv;
  paintFrame(c, p);
  if (img) {
    const bw = w * 0.8;
    const bh = h - w * 0.2;
    const s = Math.max(bw / img.width, bh / img.height);
    const sw = bw / s;
    const sh = bh / s;
    c.drawImage(
      img,
      (img.width - sw) / 2,
      (img.height - sh) / 2,
      sw,
      sh,
      w * 0.1,
      w * 0.1,
      bw,
      bh,
    );
  }
  t.needsUpdate = true;
}

function loadImage(
  src: string,
  hiRes: boolean,
  onLoad: (img: HTMLImageElement) => void,
) {
  let live = true;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => live && onLoad(img);
  img.onerror = () => {
    if (img.src.endsWith(src)) return;
    img.src = src;
  };
  img.src = hiRes ? src : smallSrc(src);
  return () => {
    live = false;
  };
}

export function ReasonsBook({ tier, items }: { tier: Tier; items: string[] }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const group = useRef<Group>(null);
  const book = useRef<Group>(null);
  const reveal = useRef(0);
  const turns = useRef<number[]>([]);
  const coverTurn = useRef(0);
  const backTurn = useRef(0);
  const n = items.length;
  const res = tier === 'high' ? 768 : 512;

  const kit = useMemo(() => {
    const text = items.map(() => pageCanvas(res));
    const photo = Array.from({ length: n + 1 }, () => pageCanvas(res));
    const leaves = items.map(
      (_, k) =>
        new ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          side: DoubleSide,
          uniforms: {
            uFront: { value: text[k] },
            uBack: { value: photo[k + 1] },
            uBend: { value: 0 },
            uShade: { value: 1 },
          },
        }),
    );
    const page = new PlaneGeometry(PAGE_W, PAGE_H, 24, 1);
    page.translate(PAGE_W / 2, 0, 0);
    const leftPage = new PlaneGeometry(PAGE_W, PAGE_H);
    leftPage.translate(-PAGE_W / 2, 0, 0);
    const left = new MeshBasicMaterial({ map: photo[0], toneMapped: false });
    const board = new MeshBasicMaterial({ color: BOARD });
    const edge = new MeshBasicMaterial({ color: '#d4ad55' });
    const coverTex = pageCanvas(res);
    const coverInside = pageCanvas(res);
    // Blueprint 066: the cover bends and turns like a page, its inside face visible mid-flip.
    const coverLeaf = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: DoubleSide,
      uniforms: {
        uFront: { value: coverTex },
        uBack: { value: coverInside },
        uBend: { value: 0 },
        uShade: { value: 1 },
      },
    });
    return {
      coverTex,
      coverInside,
      coverLeaf,
      text,
      photo,
      leaves,
      page,
      leftPage,
      left,
      board,
      edge,
      box: new BoxGeometry(1, 1, 1),
      spine: new CylinderGeometry(0.05, 0.05, PAGE_H + 0.1, 16),
    };
  }, [items, n, res]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const title = document.querySelector<HTMLElement>('#reasons-title');
    const c = root ? readTokenColors(root) : null;
    const palette: Palette = {
      bg: c ? `#${c.surface.night.getHexString()}` : '#221a2e',
      ink: c ? `#${c.foreground.night.getHexString()}` : '#efe6f0',
      gold: c ? `#${c.gold.night.getHexString()}` : '#d4ad55',
    };
    const font = title ? getComputedStyle(title).fontFamily : 'serif';
    let live = true;
    const stops: (() => void)[] = [];
    void document.fonts.ready.then(() => {
      if (!live) return;
      paintCover(kit.coverTex, palette, BOARD, font);
      const inside = (kit.coverInside.image as HTMLCanvasElement).getContext(
        '2d',
      );
      if (inside)
        paintFrame(inside, {
          ...palette,
          bg: BOARD,
        });
      kit.coverInside.needsUpdate = true;
      items.forEach((t, i) => paintReason(kit.text[i], i, t, palette, font));
      kit.photo.forEach((tex, i) => {
        paintPhoto(tex, null, palette);
        if (i >= n) return;
        stops.push(
          loadImage(photoSrc(i), tier === 'high', (img) =>
            paintPhoto(tex, img, palette),
          ),
        );
      });
    });
    return () => {
      live = false;
      stops.forEach((s) => s());
    };
  }, [kit, items, n, tier]);

  useEffect(
    () => () => {
      [...kit.text, ...kit.photo, kit.coverTex, kit.coverInside].forEach((t) =>
        t.dispose(),
      );
      kit.leaves.forEach((m) => m.dispose());
      [kit.left, kit.board, kit.edge, kit.coverLeaf].forEach((m) =>
        m.dispose(),
      );
      [kit.page, kit.leftPage, kit.box, kit.spine].forEach((g) => g.dispose());
    },
    [kit],
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    reveal.current = MathUtils.damp(
      reveal.current,
      reasons.active || reasons.leaving ? 1 : 0,
      8,
      delta,
    );
    g.visible = reveal.current > 0.01;
    if (!g.visible) return;
    const fov = (camera as PerspectiveCamera).fov ?? 45;
    const viewH = 2 * DEPTH * Math.tan(MathUtils.degToRad(fov) / 2);
    const viewW = viewH * (size.width / Math.max(1, size.height));
    const fit = Math.min(
      1.25,
      (viewW * 0.95) / (PAGE_W * 2 + 0.2),
      (viewH * 0.72) / PAGE_H,
    );
    g.scale.setScalar(fit * (0.92 + reveal.current * 0.08));
    g.position.y =
      -viewH * 0.1 + (reasons.exit * viewH) / Math.max(1, size.height);

    // Blueprint 065: cover first, one leaf per segment, then the whole book folds shut and stays.
    const ph = bookPhase(reasons.progress, n);
    coverTurn.current = MathUtils.damp(coverTurn.current, ph.cover, 6, delta);
    backTurn.current = MathUtils.damp(backTurn.current, ph.close, 6, delta);
    const fold = 1 - MathUtils.smootherstep(backTurn.current, 0, 1);
    const open = coverTurn.current * fold;
    const bk = book.current;
    if (!bk) return;
    bk.position.x = (-PAGE_W / 2) * (1 - open);
    bk.children.forEach((child) => {
      const role = child.userData.role;
      if (role === 'frame') {
        const extra = child.userData.extra as number;
        child.scale.x = PAGE_W * (1 + open) + extra;
        child.position.x = (PAGE_W / 2) * (1 - open);
        return;
      }
      if (role === 'left') {
        child.scale.x = Math.max(0.001, open);
        return;
      }
      if (role === 'cover') {
        child.rotation.y = -Math.PI * open;
        const lift = Math.sin(Math.PI * open);
        child.position.z =
          MathUtils.lerp(n + 1, 0, open) * GAP + 0.01 + lift * 0.06;
        kit.coverLeaf.uniforms.uBend.value = lift * 0.45;
        kit.coverLeaf.uniforms.uShade.value = 1 - lift * 0.2;
        return;
      }
      if (role === 'back') {
        child.position.z = -0.01;
        return;
      }
      const k = child.userData.leaf as number | undefined;
      if (k === undefined) return;
      const goal = MathUtils.smoothstep(ph.turned - k, 0.3, 0.7);
      turns.current[k] = MathUtils.damp(turns.current[k] ?? 0, goal, 6, delta);
      const t = turns.current[k] * fold;
      child.rotation.y = -Math.PI * t;
      child.position.z = MathUtils.lerp(n - k, k, t) * GAP + 0.01;
      const u = kit.leaves[k].uniforms;
      u.uBend.value = Math.sin(Math.PI * t) * 0.6;
      u.uShade.value = 1 - Math.sin(Math.PI * t) * 0.25;
    });
  });

  if (n === 0) return null;
  return createPortal(
    <group ref={group} position={[0, 0, -DEPTH]} visible={false}>
      <group ref={book} rotation={[-0.32, 0, 0]}>
        <mesh
          userData={{ role: 'frame', extra: 0.16 }}
          geometry={kit.box}
          material={kit.edge}
          position={[0, 0, -0.05]}
          scale={[PAGE_W * 2 + 0.16, PAGE_H + 0.16, 0.04]}
          raycast={none}
        />
        <mesh
          userData={{ role: 'frame', extra: 0.1 }}
          geometry={kit.box}
          material={kit.board}
          position={[0, 0, -0.02]}
          scale={[PAGE_W * 2 + 0.1, PAGE_H + 0.1, 0.03]}
          raycast={none}
        />
        <mesh geometry={kit.spine} material={kit.edge} raycast={none} />
        <mesh
          userData={{ role: 'left' }}
          geometry={kit.leftPage}
          material={kit.left}
          position={[0, 0, 0.005]}
          raycast={none}
        />
        {/* Blueprint 065: front cover with its title, hinged at x=0, opens by rotating -PI */}
        <group userData={{ role: 'cover' }}>
          <mesh geometry={kit.page} material={kit.coverLeaf} raycast={none} />
        </group>
        {kit.leaves.map((m, k) => (
          <mesh
            key={k}
            userData={{ leaf: k }}
            geometry={kit.page}
            material={m}
            raycast={none}
          />
        ))}
        {/* Blueprint 062: back cover, starts at -PI (open), closes to 0 */}
        <group userData={{ role: 'back' }}>
          <mesh geometry={kit.page} material={kit.board} raycast={none} />
          <mesh
            geometry={kit.page}
            material={kit.edge}
            scale={[1, 1, 0.01]}
            position={[0, 0, 0.005]}
            raycast={none}
          />
        </group>
      </group>
    </group>,
    camera,
  );
}
