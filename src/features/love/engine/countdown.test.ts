import { describe, expect, it } from 'vitest';

import { countdownParts } from './countdown';

const start = new Date(2026, 11, 6, 18, 30).getTime();
const MIN = 60_000;

describe('countdownParts', () => {
  it('splits the remaining time into days, hours and minutes', () => {
    const now = start - (2 * 1440 + 3 * 60 + 4) * MIN;
    expect(countdownParts(start, 180, now)).toEqual({
      state: 'future',
      days: 2,
      hours: 3,
      minutes: 4,
    });
  });

  it('rounds partial minutes up', () => {
    const now = new Date(2026, 11, 5, 18, 31, 30).getTime();
    expect(countdownParts(start, 180, now)).toMatchObject({
      days: 0,
      hours: 23,
      minutes: 59,
    });
  });

  it('is today on the same local day and while it runs', () => {
    expect(
      countdownParts(start, 180, new Date(2026, 11, 6, 9).getTime()),
    ).toEqual({ state: 'today' });
    expect(countdownParts(start, 180, start + 10 * MIN)).toEqual({
      state: 'today',
    });
  });

  it('is past once it ends, never negative', () => {
    expect(countdownParts(start, 180, start + 180 * MIN)).toEqual({
      state: 'past',
    });
    expect(countdownParts(start, 180, start + 9e9)).toEqual({ state: 'past' });
  });
});
