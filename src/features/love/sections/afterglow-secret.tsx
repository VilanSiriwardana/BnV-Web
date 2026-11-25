'use client';

import {
  Camera,
  Check,
  Images,
  Lightbulb,
  Lock,
  type LucideIcon,
  PenLine,
  Sparkles,
  Spline,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { playChime } from '../engine/chime';
import { director } from '../engine/heart-director';
import {
  HIDDEN_HEART_IDS,
  type HiddenHeartId,
  hiddenHearts,
  usePersistedSet,
} from '../engine/hidden-hearts';
import { useQuiet } from '../engine/use-quiet';
import { gsap, inkReveal, sparkBurst } from '../ui/afterglow-motion';
import { NoteDialog } from '../ui/note-dialog';
import { socketAt, VaultLock } from '../ui/vault-lock';
import { HeartDivider } from './letter-ornaments';
import { LovePhoto } from './love-photo';
import { labelText } from './love-section';

type Secret = NonNullable<NonNullable<LoveSiteConfig['afterglow']>['secret']>;
const TOTAL = HIDDEN_HEART_IDS.length;

const CLUES: Record<
  HiddenHeartId,
  { icon: LucideIcon; text: string; tone: string }
> = {
  hero: { icon: UserRound, text: 'Near your name', tone: 'text-secondary' },
  memories: { icon: Images, text: 'The memories title', tone: 'text-primary' },
  timeline: { icon: Spline, text: 'The end of our thread', tone: 'text-gold' },
  gallery: { icon: Camera, text: 'One gallery photo', tone: 'text-secondary' },
  letter: { icon: PenLine, text: 'My signature', tone: 'text-primary' },
};

/** A constellation line is drawn once both of its sockets hold a heart. */
const lineLit = (found: readonly string[], i: number) =>
  found.includes(HIDDEN_HEART_IDS[i]) &&
  found.includes(HIDDEN_HEART_IDS[(i + 1) % TOTAL]);

// Romance Additions F9 + blueprint 059: a constellation vault, locked until all five hidden
// hearts are found on this device. Unlocking plays the sockets, spins the dial and parts the
// door; the secret then reveals in place. Calm keeps the parchment dialog.
export function AfterglowSecret({
  slug,
  secret,
  hint,
}: {
  slug: string;
  secret: Secret;
  hint: string;
}) {
  const quiet = useQuiet();
  const found = usePersistedSet(hiddenHearts(slug));
  const count = found.length;
  const unlocked = count >= TOTAL;
  const [showHint, setShowHint] = useState(false);
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);
  const prev = useRef(count);
  const vault = useRef<SVGSVGElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLUListElement>(null);
  const opening = useRef(false);

  // Lines match the found hearts; newly lit ones draw in.
  useEffect(() => {
    const el = vault.current;
    if (!el) return;
    HIDDEN_HEART_IDS.forEach((_, i) => {
      const line = el.querySelector(`[data-line="${i}"]`);
      const to = { drawSVG: lineLit(found, i) ? '0% 100%' : '0% 0%' };
      if (quiet) gsap.set(line, to);
      else gsap.to(line, { ...to, duration: 0.9, ease: 'love-soft' });
    });
  }, [found, quiet]);

  // Locked: the door breathes, and the nearest missing socket shimmers as her pointer nears it.
  useEffect(() => {
    const el = vault.current;
    if (!el || quiet || unlocked || revealed) return;
    const breathe = gsap.to(el, {
      scale: 1.015,
      duration: 2.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: '50% 50%',
    });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 240;
      const y = ((e.clientY - r.top) / r.height) * 240;
      HIDDEN_HEART_IDS.forEach((id, i) => {
        if (found.includes(id)) return;
        const p = socketAt(i);
        const near = Math.max(0, 1 - Math.hypot(p.x - x, p.y - y) / 90);
        gsap.to(el.querySelector(`[data-socket="${i}"] [data-shimmer]`), {
          opacity: near * 0.7,
          duration: 0.4,
          overwrite: true,
        });
      });
    };
    window.addEventListener('pointermove', move);
    return () => {
      breathe.kill();
      gsap.set(el, { clearProps: 'transform' });
      window.removeEventListener('pointermove', move);
    };
  }, [quiet, unlocked, revealed, found]);

  // The last heart found during this visit: sockets chime in turn, the vault glows.
  useEffect(() => {
    const was = prev.current;
    prev.current = count;
    if (was >= TOTAL || count < TOTAL) return;
    void director.play('glowUp');
    const el = vault.current;
    if (quiet || !el) {
      [0, 2, 4].forEach((n, i) =>
        window.setTimeout(() => playChime(n), i * 180),
      );
      return;
    }
    const tl = gsap.timeline();
    HIDDEN_HEART_IDS.forEach((_, i) => {
      tl.call(() => playChime(i), [], i * 0.18).fromTo(
        el.querySelector(`[data-socket="${i}"]`),
        { scale: 1 },
        {
          scale: 1.35,
          transformOrigin: '50% 50%',
          duration: 0.18,
          yoyo: true,
          repeat: 1,
        },
        i * 0.18,
      );
    });
    return () => {
      tl.kill();
    };
  }, [count, quiet]);

  // Hint chips arrive one after another.
  useEffect(() => {
    const el = chips.current;
    if (!showHint || !el || quiet) return;
    const t = gsap.from(el.children, {
      y: 14,
      opacity: 0,
      scale: 0.96,
      duration: 0.5,
      ease: 'love-soft',
      stagger: 0.06,
    });
    return () => {
      t.kill();
    };
  }, [showHint, quiet]);

  // In-place reveal: title letters shimmer in, the words ink, gold drifts up.
  useEffect(() => {
    const el = reveal.current;
    if (!revealed || !el) return;
    el.focus({ preventScroll: true });
    const title = el.querySelector('[data-secret-title]');
    const undoTitle = title ? inkReveal(title, { type: 'chars' }) : undefined;
    const undoBody = inkReveal(Array.from(el.querySelectorAll('[data-ink]')), {
      delay: 0.5,
    });
    if (stage.current) sparkBurst(stage.current, { count: 26, spread: 50 });
    return () => {
      undoTitle?.();
      undoBody();
    };
  }, [revealed]);

  const openVault = (button: HTMLElement) => {
    if (quiet) {
      setReturnTo(button);
      setOpen(true);
      return;
    }
    const el = vault.current;
    if (!el || opening.current) return;
    opening.current = true;
    const q = gsap.utils.selector(el);
    gsap
      .timeline({
        onComplete: () => {
          opening.current = false;
          setRevealed(true);
        },
      })
      .to(q('[data-dial]'), { rotation: 300, duration: 1.1, ease: 'love-dial' })
      .call(() => playChime(4), [], 1)
      .to(
        q('[data-face]'),
        { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.35 },
        1.05,
      )
      .to(q('[data-rim]'), { opacity: 0, duration: 0.3 }, 1.05)
      .to(
        q('[data-half-l]'),
        { x: -130, duration: 0.9, ease: 'power3.inOut' },
        1.15,
      )
      .to(
        q('[data-half-r]'),
        { x: 130, duration: 0.9, ease: 'power3.inOut' },
        1.15,
      )
      .fromTo(
        q('[data-flood]'),
        { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1.6, duration: 1, ease: 'power2.out' },
        1.2,
      )
      .to(el, { opacity: 0, duration: 0.5 }, 1.9);
  };

  return (
    <div
      data-reveal
      className="border-gold/40 bg-surface/60 w-full max-w-lg rounded-2xl border p-6 shadow-[0_0_48px_-20px_var(--gold)] backdrop-blur-sm md:p-8"
    >
      <h3
        id="afterglow-secret-title"
        className="text-h3 font-display flex items-center justify-center gap-2"
      >
        {unlocked ? (
          <Sparkles aria-hidden className="text-gold size-5" />
        ) : (
          <Lock aria-hidden className="text-primary size-5" />
        )}
        A secret room…
      </h3>
      <p className={`${labelText} mt-2`} aria-live="polite">
        {count} of {TOTAL} hidden hearts found
      </p>

      <div ref={stage} className="relative mt-6">
        {revealed ? (
          <div
            ref={reveal}
            tabIndex={-1}
            className="text-left outline-none"
            aria-live="polite"
          >
            <p
              data-secret-title
              className="font-display text-h3 text-gold-text text-center font-semibold"
            >
              {secret.title}
            </p>
            {secret.photo && (
              <LovePhoto
                photo={secret.photo}
                sizes="(min-width: 768px) 32rem, 100vw"
                className="mt-5 max-h-[40svh] w-full rounded-md object-cover"
              />
            )}
            <div className="text-body mt-5 space-y-4 text-pretty">
              {secret.paragraphs.map((p, i) => (
                <p key={i} data-ink>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <HeartDivider />
            </div>
          </div>
        ) : (
          <div className="mx-auto size-56 md:size-64">
            <VaultLock ref={vault} found={found} />
          </div>
        )}
      </div>

      {unlocked && !revealed ? (
        <Button
          variant="love-primary"
          className="mt-6"
          onClick={(e) => openVault(e.currentTarget)}
        >
          Open the secret room
        </Button>
      ) : !unlocked ? (
        <div className="mt-4">
          <Button
            variant="love-link"
            size="inline"
            aria-expanded={showHint}
            onClick={() => setShowHint((s) => !s)}
          >
            <Lightbulb aria-hidden className="text-gold size-4" />
            {showHint ? 'Hide the hints' : 'A little hint'}
          </Button>
          {showHint && (
            <div className="mt-5">
              <div aria-hidden className="mx-auto mb-4 flex max-w-60 gap-1">
                {HIDDEN_HEART_IDS.map((id) => (
                  <span
                    key={id}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors duration-500',
                      found.includes(id) ? 'bg-gold' : 'bg-gold/20',
                    )}
                  />
                ))}
              </div>
              <ul ref={chips} className="grid gap-2.5 text-left sm:grid-cols-2">
                {HIDDEN_HEART_IDS.map((id) => {
                  const { icon: Icon, text, tone } = CLUES[id];
                  const got = found.includes(id);
                  return (
                    <li
                      key={id}
                      className={cn(
                        'glass relative flex items-center gap-3 rounded-xl border px-3 py-2.5 font-sans text-sm transition-colors',
                        got
                          ? 'border-gold/70 bg-gold/10 text-gold-text shadow-[0_0_18px_-6px_var(--gold)]'
                          : 'border-gold/20 bg-surface/80 text-foreground/85',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'bg-background/60 grid size-8 shrink-0 place-items-center rounded-full',
                          got ? 'text-gold' : tone,
                        )}
                      >
                        {got ? (
                          <Check className="size-4" />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </span>
                      {got && (
                        <span
                          aria-hidden
                          className="bg-gold text-background absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full shadow-[0_0_10px_var(--gold)]"
                        >
                          <Check className="size-3" />
                        </span>
                      )}
                      <span className="min-w-0">
                        {text}
                        <span className="sr-only">
                          {got ? ', found' : ', not found yet'}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-small text-muted-foreground border-gold/40 mt-4 border-l-2 pl-3 text-left text-pretty italic">
                {hint}
              </p>
            </div>
          )}
        </div>
      ) : null}
      <NoteDialog
        note={open && unlocked ? secret : null}
        onClose={() => setOpen(false)}
        returnFocusTo={returnTo}
      />
    </div>
  );
}
