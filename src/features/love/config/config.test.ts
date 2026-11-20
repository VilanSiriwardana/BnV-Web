import { describe, expect, it } from 'vitest';

import { getLoveSite } from './index';
import { site } from './sites/p4cw7rctk4bacw4gvsz4qer46afg';

describe('love site config', () => {
  it('has the required shape', () => {
    expect(site.slug.length).toBeGreaterThanOrEqual(24);
    expect(site.timeline).toHaveLength(5);
    expect(site.timeline.filter((t) => t.featured)).toHaveLength(1);
    expect(site.memories.length).toBeGreaterThanOrEqual(6);
    expect(site.memories.length).toBeLessThanOrEqual(8);
    expect(site.gallery.length).toBeGreaterThanOrEqual(9);
    expect(site.gallery.length).toBeLessThanOrEqual(12);
  });

  it('validates optional romance fields', () => {
    if (site.reasons) expect(site.reasons).toHaveLength(12);
    const gifts = site.afterglow?.gifts;
    if (gifts) {
      expect(gifts.items).toHaveLength(3);
      if (gifts.mode !== 'open-all')
        expect(gifts.items.filter((g) => g.plan).length).toBeLessThanOrEqual(1);
    }
    if (site.letter.voice)
      expect(site.letter.voice.transcript.trim()).not.toBe('');
    const notes = site.afterglow?.openWhen;
    if (notes) {
      expect(notes.length).toBeGreaterThanOrEqual(3);
      expect(notes.length).toBeLessThanOrEqual(5);
    }
  });

  it('looks up by slug only', () => {
    expect(getLoveSite(site.slug)).toBe(site);
    expect(getLoveSite('wrong-slug')).toBeUndefined();
    expect(getLoveSite('constructor')).toBeUndefined();
  });
});
