'use client';

import { useEffect, useState } from 'react';

import { galleryState } from '../engine/gallery-state';
import { useLoveScroll } from '../engine/scroll-engine';

// Dev only (Phase 12 M42): scrub the walk and watch camera ownership. Loaded with ?debug.
export default function GalleryDebugPanel() {
  const { scrollTo } = useLoveScroll();
  const [read, setRead] = useState('');

  useEffect(() => {
    const id = window.setInterval(() => {
      const { cameraOwner, active, progress, from, to, blend } = galleryState;
      setRead(
        `owner ${cameraOwner} · active ${active}
progress ${progress.toFixed(3)} · inspect ${from}→${to} @ ${blend.toFixed(2)}`,
      );
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  const scrub = (p: number) => {
    const el = document.getElementById('gallery');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollTo(top + p * travel, { immediate: true });
  };

  return (
    <aside
      aria-label="Gallery debug panel"
      className="border-border bg-surface-elevated/95 text-foreground fixed top-4 right-4 z-30 w-56 rounded-md border p-3 font-sans text-xs shadow-lg"
    >
      <p className="mb-1 font-semibold">Gallery walk</p>
      <pre className="mb-2 whitespace-pre-wrap">{read}</pre>
      <label className="flex flex-col gap-1">
        Jump to progress
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          defaultValue={0}
          onChange={(e) => scrub(Number(e.target.value))}
        />
      </label>
    </aside>
  );
}
