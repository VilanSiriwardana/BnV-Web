import { audio, getAudioContext } from './audio-engine';

// Romance Additions §3.4: a soft procedural bell; pentatonic so any sequence sounds pleasant.
const PENTATONIC = [0, 2, 4, 7, 9];
const PEAK = 0.12;
const DECAY = 1.2;

export function pentatonicNote(index: number, base = 523.25): number {
  const n = PENTATONIC.length;
  const i = ((index % n) + n) % n;
  const octave = Math.floor(index / n);
  return base * 2 ** ((PENTATONIC[i] + 12 * octave) / 12);
}

export function playChime(index = 0): void {
  if (audio.isMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const freq = pentatonicNote(index);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(PEAK, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + DECAY);
  gain.connect(ctx.destination);

  const voices: [number, number][] = [
    [freq, 1],
    [freq * 2, 0.25],
  ];
  voices.forEach(([f, level], i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.value = level;
    osc.connect(g).connect(gain);
    osc.start(t);
    osc.stop(t + DECAY + 0.05);
    if (i === 0) osc.onended = () => gain.disconnect();
  });
}
