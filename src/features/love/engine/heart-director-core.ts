// Tech Stack §7.4: one event at a time. Pure state machine; the GSAP adapter lives in heart-director.ts.

export const HEART_EVENTS = [
  'ribbonWeave',
  'pulse',
  'glowUp',
  'shine',
  'burst',
  'reform',
  'burstReform',
  'arrowStrike',
  'wishMerge',
  'dockToSeal',
  'sealBreak',
  'finaleBurst',
  'finaleSpell',
  'skyHeartIn',
  'candleOut',
  'reasonFront',
] as const;
export type HeartEvent = (typeof HEART_EVENTS)[number];
export type PlayOptions = { petals?: boolean; scale?: number };

export type Running = { kill: () => void };

type Deps = {
  now: () => number;
  run: (event: HeartEvent, opts: PlayOptions, done: () => void) => Running;
  toBaseline: () => void;
};

const DECORATIVE: ReadonlySet<HeartEvent> = new Set(['shine']);
export const SHINE_THROTTLE_MS = 4000;
const MAX_QUEUE = 2;

export function createDirectorCore({ now, run, toBaseline }: Deps) {
  let current: { event: HeartEvent; handle: Running } | null = null;
  let queue: { event: HeartEvent; opts: PlayOptions }[] = [];
  let lastShine = -Infinity;
  let token = 0;

  function start(event: HeartEvent, opts: PlayOptions) {
    const id = ++token;
    if (DECORATIVE.has(event)) lastShine = now();
    current = { event, handle: { kill: () => {} } };
    const handle = run(event, opts, () => {
      if (id !== token) return;
      current = null;
      const next = queue.shift();
      if (next) start(next.event, next.opts);
      else toBaseline();
    });
    if (current && id === token) current.handle = handle;
  }

  return {
    play(event: HeartEvent, opts: PlayOptions = {}): boolean {
      if (DECORATIVE.has(event)) {
        if (current || now() - lastShine < SHINE_THROTTLE_MS) return false;
        start(event, opts);
        return true;
      }
      if (current) {
        const last = queue.at(-1)?.event ?? current.event;
        if (last === event || queue.length >= MAX_QUEUE) return false;
        queue.push({ event, opts });
        return true;
      }
      start(event, opts);
      return true;
    },
    // Signature moments (arrowStrike) jump the queue: drop pending events, cut the current one.
    interrupt(event: HeartEvent, opts: PlayOptions = {}): boolean {
      if (current?.event === event) return false;
      token++;
      queue = [];
      current?.handle.kill();
      current = null;
      start(event, opts);
      return true;
    },
    settle() {
      token++;
      queue = [];
      current?.handle.kill();
      current = null;
      toBaseline();
    },
    isBusy: () => current !== null,
    current: () => current?.event ?? null,
  };
}
