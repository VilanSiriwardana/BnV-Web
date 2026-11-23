import { describe, expect, it } from 'vitest';

import {
  type DirectorEvent,
  type DirectorState,
  WALKING,
  reduce,
} from './gallery-director-core';

const N = 13;
function run(events: DirectorEvent[], from: DirectorState = WALKING) {
  let s = from;
  const commands: string[] = [];
  for (const e of events) {
    const [next, cmd] = reduce(s, e, N);
    s = next;
    if (cmd) commands.push(cmd);
  }
  return { s, commands };
}

describe('gallery director', () => {
  it('opens, then lands in inspect', () => {
    const { s, commands } = run([{ type: 'open', index: 4 }, { type: 'done' }]);
    expect(s).toEqual({ mode: 'inspect', index: 4, target: -1 });
    expect(commands).toEqual(['move']);
  });

  it('drops rapid input while moving (no stacked tweens)', () => {
    const { s, commands } = run([
      { type: 'open', index: 1 },
      { type: 'open', index: 2 },
      { type: 'next' },
      { type: 'prev' },
    ]);
    expect(s.mode).toBe('opening');
    expect(s.target).toBe(1);
    expect(commands).toEqual(['move']);
  });

  it('Esc mid-open reverses back to the walk', () => {
    const { s, commands } = run([
      { type: 'open', index: 3 },
      { type: 'close' },
      { type: 'close' },
      { type: 'done' },
    ]);
    expect(s).toEqual(WALKING);
    expect(commands).toEqual(['move', 'reverse']);
  });

  it('Esc mid-switch returns to the frame it left', () => {
    const { s } = run([
      { type: 'open', index: 3 },
      { type: 'done' },
      { type: 'next' },
      { type: 'close' },
      { type: 'done' },
    ]);
    expect(s).toEqual({ mode: 'inspect', index: 3, target: -1 });
  });

  it('wraps Previous and Next at the ends', () => {
    const open = (i: number) =>
      run([{ type: 'open', index: i }, { type: 'done' }]).s;
    expect(run([{ type: 'next' }, { type: 'done' }], open(N - 1)).s.index).toBe(
      0,
    );
    expect(run([{ type: 'prev' }, { type: 'done' }], open(0)).s.index).toBe(
      N - 1,
    );
  });

  it('closes back to the walk and ignores out-of-range opens', () => {
    expect(run([{ type: 'open', index: N }]).s).toEqual(WALKING);
    const { s } = run([
      { type: 'open', index: 0 },
      { type: 'done' },
      { type: 'close' },
      { type: 'done' },
    ]);
    expect(s).toEqual(WALKING);
  });
});
