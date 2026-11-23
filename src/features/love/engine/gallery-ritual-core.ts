// Gallery door unlock ritual (blueprint 053). Pure: gallery-ritual.ts turns each command into one
// GSAP tween. Input during an animation is dropped, never queued.
export type RitualMode =
  | 'idle'
  | 'locked'
  | 'smashing'
  | 'keyFree'
  | 'dragging'
  | 'inserting'
  | 'turning'
  | 'opening'
  | 'open';

export type RitualEvent =
  | { type: 'arrive' }
  | { type: 'swipe' }
  | { type: 'smashDone' }
  | { type: 'grab' }
  | { type: 'release'; near: boolean }
  | { type: 'insertDone' }
  | { type: 'turnDone' }
  | { type: 'openDone' }
  | { type: 'auto' }
  | { type: 'reset' };

export type RitualCommand =
  'lock' | 'smash' | 'insert' | 'turn' | 'open' | 'unlock' | 'returnKey' | null;

export function reduceRitual(
  mode: RitualMode,
  e: RitualEvent,
): [RitualMode, RitualCommand] {
  if (e.type === 'reset') return ['idle', null];
  switch (mode) {
    case 'idle':
      return e.type === 'arrive' ? ['locked', 'lock'] : [mode, null];
    case 'locked':
      if (e.type === 'swipe') return ['smashing', 'smash'];
      if (e.type === 'auto') return ['smashing', 'smash'];
      return [mode, null];
    case 'smashing':
      return e.type === 'smashDone' ? ['keyFree', null] : [mode, null];
    case 'keyFree':
      if (e.type === 'grab') return ['dragging', null];
      if (e.type === 'auto') return ['inserting', 'insert'];
      return [mode, null];
    case 'dragging':
      if (e.type === 'release')
        return e.near ? ['inserting', 'insert'] : ['keyFree', 'returnKey'];
      if (e.type === 'auto') return ['inserting', 'insert'];
      return [mode, null];
    case 'inserting':
      return e.type === 'insertDone' ? ['turning', 'turn'] : [mode, null];
    case 'turning':
      return e.type === 'turnDone' ? ['opening', 'open'] : [mode, null];
    case 'opening':
      return e.type === 'openDone' ? ['open', 'unlock'] : [mode, null];
    case 'open':
      return [mode, null];
  }
}

/** Waiting for her (prompts and buttons show); every other mode is mid-animation or done. */
export const isWaiting = (m: RitualMode) =>
  m === 'locked' || m === 'keyFree' || m === 'dragging';

/** Prompt index for a mode: 0 swipe, 1 take the key, 2 place it, -1 none. */
export function promptFor(m: RitualMode) {
  if (m === 'locked') return 0;
  if (m === 'keyFree') return 1;
  if (m === 'dragging') return 2;
  return -1;
}
