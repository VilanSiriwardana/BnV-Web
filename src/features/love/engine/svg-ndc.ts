// Screen pixels → NDC (x −1 left … +1 right, y −1 bottom … +1 top).
export function pxToNdc(
  px: { x: number; y: number },
  viewport: { width: number; height: number },
) {
  return {
    x: (px.x / viewport.width) * 2 - 1,
    y: 1 - (px.y / viewport.height) * 2,
  };
}

// Point at fraction p of an SVG path, in NDC. `ctm` is cached by the caller (recompute on refresh).
export function svgPointToNdc(
  path: SVGPathElement,
  length: number,
  p: number,
  ctm: DOMMatrix | null = path.getScreenCTM(),
) {
  const pt = path.getPointAtLength(Math.min(1, Math.max(0, p)) * length);
  const screen = ctm ? new DOMPoint(pt.x, pt.y).matrixTransform(ctm) : pt;
  return pxToNdc(screen, {
    width: window.innerWidth,
    height: window.innerHeight,
  });
}
