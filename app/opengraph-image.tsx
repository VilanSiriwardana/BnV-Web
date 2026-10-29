import { ImageResponse } from 'next/og';

import { brand } from '@/config/brand';

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Placeholder until the commissioned OG image arrives (UX-Spec §8).
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: '#faf7f2',
        color: '#1c1b1a',
        fontFamily: 'serif',
        borderBottom: '24px solid #c8b6e2',
      }}
    >
      <div style={{ fontSize: 160, fontWeight: 700, color: '#6a5296' }}>
        {brand.name}
      </div>
      <div style={{ fontSize: 44 }}>{brand.tagline}</div>
      <div style={{ width: 120, height: 4, background: '#c6a15b' }} />
    </div>,
    size,
  );
}
