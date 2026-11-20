'use client';

import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { Button } from '@/components/ui/button';

import { voice } from '../engine/audio-engine';

type Props = {
  src: string;
  transcript: string;
  label?: string;
  /** True once the letter text has revealed. */
  open: boolean;
};

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;
const IDLE = { playing: false, failed: false, ended: false, progress: 0 };

// Romance Additions F2: never autoplays; pauses when she leaves the Letter (the audio engine also
// pauses it when the tab is hidden); hides itself if the file fails.
export function LetterVoice({ src, transcript, label, open }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const transcriptId = useId();
  const [reading, setReading] = useState(false);
  const snapshot = useRef(IDLE);
  const state = useSyncExternalStore(
    voice.subscribe,
    () => {
      const next = voice.state();
      const prev = snapshot.current;
      if (
        prev.playing !== next.playing ||
        prev.failed !== next.failed ||
        prev.ended !== next.ended ||
        Math.abs(prev.progress - next.progress) > 0.005
      )
        snapshot.current = next;
      return snapshot.current;
    },
    () => IDLE,
  );

  useEffect(() => {
    if (open) voice.prepare(src);
  }, [open, src]);

  useEffect(() => {
    const section = ref.current?.closest('section');
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) voice.pause();
    });
    io.observe(section);
    return () => {
      io.disconnect();
      voice.pause();
    };
  }, []);

  if (!open || state.failed) return null;

  const toggle = () => {
    if (state.playing) voice.pause();
    else void voice.play(src).catch(() => {});
  };
  const text = state.playing
    ? 'Pause'
    : state.ended
      ? 'Hear it again'
      : (label ?? 'Hear it in my voice');
  const Icon = state.playing ? Pause : state.ended ? RotateCcw : Play;

  return (
    <div ref={ref} className="mt-6 flex flex-col items-center gap-3">
      <Button variant="love-ghost" size="sm" onClick={toggle}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5 -rotate-90">
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            className="stroke-gold/30"
            strokeWidth="1.5"
          />
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            className="stroke-gold"
            strokeWidth="1.5"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - state.progress)}
          />
        </svg>
        <Icon aria-hidden className="size-4" />
        {text}
      </Button>
      <Button
        variant="love-link"
        size="inline"
        aria-expanded={reading}
        aria-controls={transcriptId}
        onClick={() => setReading((r) => !r)}
        className="text-small"
      >
        Read what I say
      </Button>
      <p
        id={transcriptId}
        hidden={!reading}
        className="text-small max-w-[50ch] text-left italic"
      >
        {transcript}
      </p>
    </div>
  );
}
