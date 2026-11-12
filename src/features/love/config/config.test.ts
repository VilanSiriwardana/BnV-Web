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

  it('looks up by slug only', () => {
    expect(getLoveSite(site.slug)).toBe(site);
    expect(getLoveSite('wrong-slug')).toBeUndefined();
    expect(getLoveSite('constructor')).toBeUndefined();
  });
});
