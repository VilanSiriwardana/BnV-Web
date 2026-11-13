import { describe, expect, it, vi } from 'vitest';

import { onSessionReset, resetSession, session } from './session';

describe('resetSession', () => {
  it('clears per-pass flags and arms the hero replay', () => {
    session.wishDone = true;
    session.finalePlayed = true;
    resetSession();
    expect(session).toEqual({
      wishDone: false,
      finalePlayed: false,
      replayArmed: true,
    });
  });

  it('notifies listeners until they unsubscribe', () => {
    const fn = vi.fn();
    const off = onSessionReset(fn);
    resetSession();
    off();
    resetSession();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
