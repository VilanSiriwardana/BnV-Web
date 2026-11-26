import gsap from 'gsap';

import { playChime } from './chime';
import type { GalleryIO } from './gallery-director';
import {
  type RitualEvent,
  type RitualMode,
  reduceRitual,
} from './gallery-ritual-core';
import { onSessionReset, session } from './session';

// Runtime for gallery-ritual-core.ts (blueprint 053). Scroll stays locked from arrival until the
// doors have fully opened. The canvas reads ritualState in useFrame; the overlay writes the
// pointer and reads projected screen positions.
type Vec3 = { x: number; y: number; z: number };
type Screen = { x: number; y: number; r: number; visible: boolean };

export const ritualState = {
  mode: 'idle' as RitualMode,
  hammer: 0, // swing 0..1 (1 = strike)
  /** Normalised swipe direction on screen (x right, y down); pushes the shards. */
  swipe: { x: 0.7, y: 0.7 },
  /** Camera kick at the strike, 1 → 0 (decayed by the camera rig). */
  kick: 0,
  shatterAt: -1, // performance.now() of the strike, -1 = intact
  impact: { x: 0, y: 0 }, // pane-local strike point
  keyHeld: false,
  /** Pointer in NDC while dragging; the ritual scene turns it into the key's world position. */
  pointer: { x: 0, y: 0 },
  keyReturn: 0, // 0..1 drift back to the velvet after a far release
  keyIn: 0, // 0..1 slide into the keyhole
  keyTurn: 0, // 0..1 quarter turn
  door: 0, // 0..1 doors open
  keyWorld: { x: 0, y: 0, z: 0 } as Vec3,
  screen: {
    case: { x: 0, y: 0, r: 0, visible: false } as Screen,
    key: { x: 0, y: 0, r: 0, visible: false } as Screen,
    keyhole: { x: 0, y: 0, r: 0, visible: false } as Screen,
  },
};

const listeners = new Set<(m: RitualMode) => void>();
let io: GalleryIO | null = null;
// Blueprint 060: her own drop only pushes the key in; Help keeps the full travel.
let byHand = false;
let tween: gsap.core.Animation | null = null;
let autoChain = false;

export function bindGalleryRitual(next: { io: GalleryIO }) {
  io = next.io;
  return () => {
    resetGalleryRitual();
    io = null;
  };
}

export function onGalleryRitual(fn: (m: RitualMode) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const ritualDone = () => session.galleryUnlocked;

export function sendRitual(e: RitualEvent) {
  if (e.type === 'arrive' && session.galleryUnlocked) return;
  if (e.type === 'release' || e.type === 'auto') byHand = e.type === 'release';
  if (e.type === 'auto') autoChain = true;
  const [mode, cmd] = reduceRitual(ritualState.mode, e);
  if (mode === ritualState.mode && !cmd) return;
  ritualState.mode = mode;
  if (e.type === 'grab') ritualState.keyHeld = true;
  if (e.type === 'release' || e.type === 'auto') ritualState.keyHeld = false;
  run(cmd);
  listeners.forEach((fn) => fn(mode));
}

/** Forward arrival at the gallery: snap to the stage top, then lock and start the ritual. */
export function arriveAtDoor(stageTop: number) {
  if (session.galleryUnlocked || ritualState.mode !== 'idle') return;
  io?.scrollTo(stageTop);
  sendRitual({ type: 'arrive' });
}

/** Blueprint 070: the overhead strike always lands top → bottom; shards burst downward. */
export function setRitualSwipe() {
  ritualState.swipe.x = 0;
  ritualState.swipe.y = 1;
  ritualState.impact.x = 0;
  ritualState.impact.y = 0.07;
}

export function decayRitualKick(delta: number) {
  if (ritualState.kick > 0)
    ritualState.kick = Math.max(0, ritualState.kick - delta * 7);
}

/** Pointer position in NDC while she drags the key. */
export function setRitualPointer(x: number, y: number) {
  ritualState.pointer.x = x;
  ritualState.pointer.y = y;
}

const done = (type: RitualEvent['type']) => () =>
  sendRitual({ type } as RitualEvent);

function run(cmd: ReturnType<typeof reduceRitual>[1]) {
  const s = ritualState;
  switch (cmd) {
    case 'lock':
      io?.stop();
      break;
    case 'smash':
      tween?.kill();
      s.hammer = 0;
      tween = gsap
        .timeline({
          onComplete: () => {
            sendRitual({ type: 'smashDone' });
            if (autoChain) sendRitual({ type: 'auto' });
          },
        })
        // Wind-up, strike, impact, rebound, then the hammer withdraws.
        .to(s, { hammer: -0.12, duration: 0.14, ease: 'power2.out' })
        .to(s, { hammer: 1, duration: 0.32, ease: 'power4.in' })
        .call(() => {
          s.shatterAt = performance.now();
          s.kick = 1;
          playChime(4);
        })
        .to(s, { hammer: 0.85, duration: 0.12, ease: 'power2.out' })
        .to(s, { hammer: 0, duration: 0.45, ease: 'power2.inOut' }, '+=0.15')
        .to({}, { duration: 0.3 });
      break;
    case 'returnKey':
      tween?.kill();
      s.keyReturn = 0;
      tween = gsap.to(s, { keyReturn: 1, duration: 0.5, ease: 'power2.out' });
      break;
    case 'insert':
      tween?.kill();
      s.keyReturn = 0;
      if (byHand) s.keyIn = 0.6;
      tween = gsap.to(s, {
        keyIn: 1,
        duration: byHand ? 0.25 : 0.6,
        ease: byHand ? 'power2.in' : 'power2.inOut',
        onComplete: done('insertDone'),
      });
      break;
    case 'turn':
      tween = gsap.to(s, {
        keyTurn: 1,
        duration: 0.55,
        ease: 'back.out(2)',
        onComplete: () => {
          playChime(2);
          sendRitual({ type: 'turnDone' });
        },
      });
      break;
    case 'open':
      // Blueprint 059: the latch gives a little, then her scroll opens the doors (story.ts).
      tween = gsap.to(s, { door: 0.04, duration: 0.35, ease: 'back.out(3)' });
      io?.start();
      break;
    case 'unlock':
      tween = null;
      autoChain = false;
      session.galleryUnlocked = true;
      io?.start();
      break;
  }
}

/** Blueprint 059: scroll through the door stretch (0..1) eases the doors open; full = unlocked. */
export function scrubGalleryDoor(amount: number) {
  if (ritualState.mode !== 'opening') return;
  const to = Math.max(0.04, Math.min(amount, 1));
  tween = gsap.to(ritualState, {
    door: to,
    duration: 1.4,
    ease: 'sine.out',
    overwrite: true,
  });
  if (to >= 1) {
    playChime(4);
    sendRitual({ type: 'openDone' });
  }
}

/** Exit gallery mid-ritual: open the doors, unlock scroll and count it as done for this visit. */
export function exitGalleryRitual() {
  tween?.kill();
  tween = null;
  autoChain = false;
  Object.assign(ritualState, { mode: 'open', keyHeld: false, door: 1 });
  session.galleryUnlocked = true;
  io?.start();
  listeners.forEach((fn) => fn(ritualState.mode));
}

/** Section left, story rebuilt or Replay: drop a half-done ritual and never leave scroll locked. */
export function resetGalleryRitual() {
  byHand = false;
  const wasLocked = ritualState.mode !== 'idle' && ritualState.mode !== 'open';
  tween?.kill();
  tween = null;
  autoChain = false;
  if (!session.galleryUnlocked) {
    Object.assign(ritualState, {
      mode: 'idle',
      hammer: 0,
      shatterAt: -1,
      keyHeld: false,
      keyReturn: 0,
      keyIn: 0,
      keyTurn: 0,
      door: 0,
    });
  }
  if (wasLocked) io?.start();
  listeners.forEach((fn) => fn(ritualState.mode));
}

// Replay clears session.galleryUnlocked first, so the doors close and the ritual runs again.
onSessionReset(resetGalleryRitual);
