'use client';

import { pointOn } from '../canvas/dance-geometry';
import {
  DANCE_FRAMES,
  DANCE_PARTS,
  DIP_FRAME,
  type Shape,
} from '../canvas/dance-silhouettes';
import { useQuiet } from '../engine/use-quiet';
import { useTier } from '../engine/tier-provider';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { title: string; line: string };

// Experience §19.6: the 3D duo (canvas/dance-duo.tsx) is scrubbed by story.ts buildDance.
// Calm, reduced motion and the low/static tiers show a still silhouette pair in the dip.
export function Dance({ title, line }: Props) {
  const quiet = useQuiet();
  const { tier } = useTier();
  const still = quiet || tier === 'low' || tier === 'static';

  return (
    <LoveSection id="dance" depth={0.5} stage="250vh">
      <h2 id="dance-title" className={sectionTitle}>
        {title}
      </h2>
      <p data-dance-line className={`${proseColumn} mt-4 italic`}>
        {line}
      </p>
      {still && <DipSilhouettes />}
    </LoveSection>
  );
}

// World units (y up) → SVG (y down): x −1.2..1.2, y 0..2.1.
const sx = (x: number) => (x + 1.2) * 100;
const sy = (y: number) => (2.1 - y) * 100;

function ShapeSvg({ shape }: { shape: Shape }) {
  if (shape.kind === 'circle')
    return <circle cx={sx(shape.c[0])} cy={sy(shape.c[1])} r={shape.r * 100} />;
  if (shape.kind === 'quad') {
    const [p0, p1, p2, p3] = shape.p;
    return (
      <polygon
        points={[p0, p1, p3, p2]
          .map((v) => `${sx(v[0])},${sy(v[1])}`)
          .join(' ')}
      />
    );
  }
  const corners = [
    pointOn(shape, 0, 0),
    pointOn(shape, 1, 0),
    pointOn(shape, 1, 1),
    pointOn(shape, 0, 1),
  ];
  return (
    <>
      <polygon
        points={corners.map((v) => `${sx(v[0])},${sy(v[1])}`).join(' ')}
      />
      <circle cx={sx(shape.a[0])} cy={sy(shape.a[1])} r={shape.ra * 100} />
      <circle cx={sx(shape.b[0])} cy={sy(shape.b[1])} r={shape.rb * 100} />
    </>
  );
}

// The still dip pose, drawn from the same shapes as the particle couple.
function DipSilhouettes() {
  const frame = DANCE_FRAMES[DIP_FRAME];
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 210"
      className="mt-10 w-72 drop-shadow-[0_0_14px_var(--primary)] md:w-96"
    >
      {[0, 1].map((owner) => (
        <g key={owner} className={owner ? 'fill-gold' : 'fill-primary'}>
          {DANCE_PARTS.filter((p) => p.owner === owner).flatMap((p) =>
            frame[p.id].map((shape, i) => (
              <ShapeSvg key={`${p.id}-${i}`} shape={shape} />
            )),
          )}
        </g>
      ))}
    </svg>
  );
}
