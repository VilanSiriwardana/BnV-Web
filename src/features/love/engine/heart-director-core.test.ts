import { describe, expect, it } from 'vitest';

import {
  createDirectorCore,
  type HeartEvent,
  SHINE_THROTTLE_MS,
} from './heart-director-core';

function setup() {
  let time = 0;
  const started: HeartEvent[] = [];
  const killed: HeartEvent[] = [];
  const pending: (() => void)[] = [];
  let baselines = 0;
  const core = createDirectorCore({
    now: () => time,
    run: (event, _opts, done) => {
      started.push(event);
      pending.push(done);
      return { kill: () => killed.push(event) };
    },
    toBaseline: () => baselines++,
  });
  return {
    core,
    started,
    killed,
    finish: () => pending.shift()?.(),
    advance: (ms: number) => (time += ms),
    baselines: () => baselines,
  };
}

describe('heart director core', () => {
  it('plays one event at a time and queues important ones', () => {
    const t = setup();
    t.core.play('burst');
    t.core.play('pulse');
    expect(t.started).toEqual(['burst']);
    t.finish();
    expect(t.started).toEqual(['burst', 'pulse']);
    t.finish();
    expect(t.core.isBusy()).toBe(false);
    expect(t.baselines()).toBe(1);
  });

  it('drops duplicates and caps the queue', () => {
    const t = setup();
    t.core.play('pulse');
    expect(t.core.play('pulse')).toBe(false);
    t.core.play('glowUp');
    t.core.play('burst');
    expect(t.core.play('reform')).toBe(false);
  });

  it('drops shine while busy and throttles it', () => {
    const t = setup();
    t.core.play('pulse');
    expect(t.core.play('shine')).toBe(false);
    t.finish();
    expect(t.core.play('shine')).toBe(true);
    t.finish();
    t.advance(SHINE_THROTTLE_MS - 1);
    expect(t.core.play('shine')).toBe(false);
    t.advance(1);
    expect(t.core.play('shine')).toBe(true);
  });

  it('settle kills the running event, clears the queue and restores baseline', () => {
    const t = setup();
    t.core.play('burst');
    t.core.play('reform');
    t.core.settle();
    expect(t.killed).toEqual(['burst']);
    expect(t.core.isBusy()).toBe(false);
    expect(t.baselines()).toBe(1);
    t.finish(); // a stale completion must not start the cleared queue
    expect(t.started).toEqual(['burst']);
    expect(t.baselines()).toBe(1);
  });

  it('interrupt jumps a full queue and ignores stale completions', () => {
    const t = setup();
    t.core.play('glowUp');
    t.core.play('pulse');
    t.core.play('shine');
    t.core.play('burst');
    expect(t.core.play('arrowStrike')).toBe(false);
    expect(t.core.interrupt('arrowStrike')).toBe(true);
    expect(t.killed).toEqual(['glowUp']);
    expect(t.core.current()).toBe('arrowStrike');
    t.finish(); // glowUp's stale done
    expect(t.started).toEqual(['glowUp', 'arrowStrike']);
    t.finish(); // arrowStrike done: queue was cleared
    expect(t.core.isBusy()).toBe(false);
    expect(t.started).toEqual(['glowUp', 'arrowStrike']);
  });

  it('interrupt with the same running event is ignored', () => {
    const t = setup();
    t.core.interrupt('arrowStrike');
    expect(t.core.interrupt('arrowStrike')).toBe(false);
    expect(t.started).toEqual(['arrowStrike']);
  });
});
