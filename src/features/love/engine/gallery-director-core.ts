// Gallery inspect state machine (Phase 12 §8). Pure: the runtime in gallery-director.ts turns the
// returned command into one GSAP tween. Input during a move is dropped, never queued.
export type DirectorMode =
  'walk' | 'opening' | 'inspect' | 'switching' | 'closing' | 'cancelling';

export type DirectorState = {
  mode: DirectorMode;
  /** Frame the camera is on (inspect) or leaving; -1 = the walk. */
  index: number;
  /** Frame the current move heads to; -1 = the walk. */
  target: number;
};

export type DirectorEvent =
  | { type: 'open'; index: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'close' }
  | { type: 'done' }
  | { type: 'reset' };

/** `move` starts a tween from `index` to `target`; `reverse` plays the running one back. */
export type DirectorCommand = 'move' | 'reverse' | null;

export const WALKING: DirectorState = { mode: 'walk', index: -1, target: -1 };

export function reduce(
  s: DirectorState,
  e: DirectorEvent,
  count: number,
): [DirectorState, DirectorCommand] {
  if (e.type === 'reset') return [WALKING, null];
  switch (s.mode) {
    case 'walk':
      if (e.type === 'open' && e.index >= 0 && e.index < count)
        return [{ mode: 'opening', index: -1, target: e.index }, 'move'];
      return [s, null];
    case 'inspect':
      if (e.type === 'close')
        return [{ mode: 'closing', index: s.index, target: -1 }, 'move'];
      if (e.type === 'next' || e.type === 'prev') {
        const step = e.type === 'next' ? 1 : -1;
        const target = (s.index + step + count) % count;
        return [{ mode: 'switching', index: s.index, target }, 'move'];
      }
      return [s, null];
    case 'opening':
    case 'switching':
      if (e.type === 'done')
        return [{ ...s, mode: 'inspect', index: s.target, target: -1 }, null];
      if (e.type === 'close') return [{ ...s, mode: 'cancelling' }, 'reverse'];
      return [s, null];
    case 'closing':
      if (e.type === 'done') return [WALKING, null];
      return [s, null];
    case 'cancelling':
      if (e.type === 'done')
        return s.index === -1
          ? [WALKING, null]
          : [{ mode: 'inspect', index: s.index, target: -1 }, null];
      return [s, null];
  }
}

export const isBusy = (s: DirectorState) =>
  s.mode !== 'walk' && s.mode !== 'inspect';
