import { CanvasTexture, RepeatWrapping } from 'three';

// Tiny procedural bump maps (no image downloads): satin weave for the ribbon, paper grain for the box.
function texture(size: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  return tex;
}

export function satinWeave() {
  const tex = texture(64, (ctx) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 2) {
      ctx.fillStyle = y % 4 ? '#9a9a9a' : '#6c6c6c';
      ctx.fillRect(0, y, 64, 1);
    }
    // Selvedge: raised edges along both sides of the ribbon.
    ctx.fillStyle = '#b8b8b8';
    ctx.fillRect(0, 0, 4, 64);
    ctx.fillRect(60, 0, 4, 64);
  });
  tex.repeat.set(1, 18);
  return tex;
}

export function paperGrain() {
  const tex = texture(128, (ctx) => {
    const img = ctx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 118 + Math.random() * 20;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  });
  tex.repeat.set(3, 3);
  return tex;
}
