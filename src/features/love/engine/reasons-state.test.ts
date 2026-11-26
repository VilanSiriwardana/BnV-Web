import { describe, expect, it } from 'vitest';

import { bookPhase, bookProgressFor } from './reasons-state';

describe('bookPhase', () => {
  it('starts closed with no page', () => {
    expect(bookPhase(0, 12)).toMatchObject({ cover: 0, close: 0, page: 0 });
  });

  it('shows page 1 once the cover has opened', () => {
    expect(bookPhase(1 / 13, 12).page).toBe(1);
  });

  it('ends fully closed on the last page', () => {
    expect(bookPhase(1, 12)).toMatchObject({ close: 1, page: 12, turned: 11 });
  });

  it('maps every spread to a progress that shows it', () => {
    for (let i = 0; i < 12; i++)
      expect(bookPhase(bookProgressFor(i, 12), 12).page).toBe(i + 1);
  });
});
