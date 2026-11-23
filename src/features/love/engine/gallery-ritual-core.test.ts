import { describe, expect, it } from 'vitest';

import {
  type RitualEvent,
  type RitualMode,
  reduceRitual,
} from './gallery-ritual-core';

function run(events: RitualEvent[], from: RitualMode = 'idle') {
  let mode = from;
  const commands: string[] = [];
  for (const e of events) {
    const [next, cmd] = reduceRitual(mode, e);
    mode = next;
    if (cmd) commands.push(cmd);
  }
  return { mode, commands };
}

describe('gallery ritual', () => {
  it('runs the full unlock in order', () => {
    const { mode, commands } = run([
      { type: 'arrive' },
      { type: 'swipe' },
      { type: 'smashDone' },
      { type: 'grab' },
      { type: 'release', near: true },
      { type: 'insertDone' },
      { type: 'turnDone' },
      { type: 'openDone' },
    ]);
    expect(mode).toBe('open');
    expect(commands).toEqual([
      'lock',
      'smash',
      'insert',
      'turn',
      'open',
      'unlock',
    ]);
  });

  it('drops rapid swipes and early grabs while animating', () => {
    const { mode, commands } = run([
      { type: 'arrive' },
      { type: 'swipe' },
      { type: 'swipe' },
      { type: 'grab' },
    ]);
    expect(mode).toBe('smashing');
    expect(commands).toEqual(['lock', 'smash']);
  });

  it('returns the key when released far from the lock', () => {
    const { mode, commands } = run(
      [{ type: 'grab' }, { type: 'release', near: false }],
      'keyFree',
    );
    expect(mode).toBe('keyFree');
    expect(commands).toEqual(['returnKey']);
  });

  it('"Open it for me" always gets through', () => {
    const { mode } = run([
      { type: 'arrive' },
      { type: 'auto' },
      { type: 'smashDone' },
      { type: 'auto' },
      { type: 'insertDone' },
      { type: 'turnDone' },
      { type: 'openDone' },
    ]);
    expect(mode).toBe('open');
  });

  it('resets from anywhere and ignores arrive once open', () => {
    expect(run([{ type: 'reset' }], 'turning').mode).toBe('idle');
    expect(run([{ type: 'arrive' }], 'open').mode).toBe('open');
  });
});
