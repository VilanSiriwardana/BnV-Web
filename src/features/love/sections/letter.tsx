'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { director } from '../engine/heart-director';
import { LETTER_OPEN_EVENT } from '../engine/session';
import { LetterVoice } from './letter-voice';
import { useLoveScroll } from '../engine/scroll-engine';
import { useQuiet } from '../engine/use-quiet';
import { useHold } from '../hooks/use-hold';
import {
  HeartDivider,
  LetterBackdrop,
  LetterQuill,
  ParchmentFrame,
} from './letter-ornaments';
import { labelText, LoveSection, sectionTitle } from './love-section';
import { HiddenHeart } from '../ui/hidden-heart';

if (typeof window !== 'undefined') gsap.registerPlugin(SplitText);

const HOLD_MS = 1200;
type Props = { title: string; letter: LoveSiteConfig['letter'] };

const normalise = (s: string) => s.trim().toLowerCase();

// The 3D heart docks behind the rolled scroll; a round hole at the seal lets it show as the seal.
const sealHole = (at: string, r: number) => {
  const mask = `radial-gradient(circle ${r}px at ${at}, transparent 97%, black 100%)`;
  return { maskImage: mask, WebkitMaskImage: mask };
};

const rod =
  'relative z-10 h-6 rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_70%,white),var(--gold)_45%,color-mix(in_oklab,var(--gold)_55%,black))] shadow-[0_6px_18px_-6px_color-mix(in_oklab,var(--gold)_70%,transparent)] before:absolute before:top-1/2 before:-left-3 before:size-5 before:-translate-y-1/2 before:rounded-full before:bg-[var(--gold)] after:absolute after:top-1/2 after:-right-3 after:size-5 after:-translate-y-1/2 after:rounded-full after:bg-[var(--gold)]';

// Experience §13 + §19.4. GSAP only on these elements (no Motion). The 3D heart docks onto
// [data-seal] (story.ts buildLetter), so the seal *is* the heart. Scrolling on opens it too.
export function Letter({ title, letter }: Props) {
  const quiet = useQuiet();
  const { scrollTo } = useLoveScroll();
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const card = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [wrong, setWrong] = useState(false);
  const passId = useId();
  const showOpen = open || quiet;
  const sealR = letter.passphrase ? 40 : 46;

  // Rolled: rods meet at the centre and the parchment is clipped shut.
  useGSAP(
    () => {
      if (quiet || opened.current) return;
      const half = () =>
        (root.current?.querySelector<HTMLElement>('[data-scroll]')
          ?.offsetHeight ?? 0) /
          2 -
        12;
      gsap.set('[data-rod="top"]', { y: half });
      gsap.set('[data-rod="bottom"]', { y: () => -half() });
      gsap.set('[data-letter-card]', { clipPath: 'inset(50% 0% 50% 0%)' });
      gsap.to('[data-scroll]', {
        y: -3,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root, dependencies: [quiet] },
  );

  const { contextSafe } = useGSAP({ scope: root });

  const unlock = useCallback(() => {
    if (opened.current) return;
    opened.current = true;
    setOpening(true);
    if (quiet) {
      setOpen(true);
      return;
    }
    contextSafe(() => {
      gsap.killTweensOf('[data-scroll]');
      gsap
        .timeline({ onComplete: () => setOpen(true) })
        .to(
          '[data-seal-half="left"]',
          { x: -12, rotate: -14, autoAlpha: 0, duration: 0.35 },
          0,
        )
        .to(
          '[data-seal-half="right"]',
          { x: 12, rotate: 14, autoAlpha: 0, duration: 0.35 },
          0,
        )
        .call(() => void director.play('sealBreak'), [], 0)
        .set('[data-letter-card]', { autoAlpha: 1 }, 0.3)
        .to('[data-rod]', { y: 0, duration: 1.6, ease: 'power2.inOut' }, 0.35)
        .to(
          '[data-letter-card]',
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'power2.inOut',
          },
          0.35,
        )
        .add(writeLetter(root.current, card.current), 1.6);
    })();
  }, [quiet, contextSafe]);

  // story.ts buildLetter dispatches this once she scrolls on without opening (no passphrase).
  // The scroll hint disappears after the first scroll inside the letter.
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const hide = () => setScrolled(true);
    el.addEventListener('scroll', hide, { once: true, passive: true });
    return () => el.removeEventListener('scroll', hide);
  }, []);

  useEffect(() => {
    const section = root.current?.closest('section');
    if (!section || letter.passphrase) return;
    const autoOpen = () => {
      unlock();
      const pinEnd =
        section.getBoundingClientRect().top +
        window.scrollY +
        section.offsetHeight -
        window.innerHeight;
      if (window.scrollY > pinEnd) scrollTo(pinEnd);
    };
    section.addEventListener(LETTER_OPEN_EVENT, autoOpen);
    return () => section.removeEventListener(LETTER_OPEN_EVENT, autoOpen);
  }, [unlock, letter.passphrase, scrollTo]);

  const { handlers } = useHold({
    duration: HOLD_MS,
    onProgress: () => {},
    onComplete: unlock,
    completeOnClick: quiet,
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get('passphrase');
    // Soft lock only (Tech Stack §9.3): no storage, no network, no lockout.
    if (
      letter.passphrase &&
      typeof value === 'string' &&
      normalise(value) === normalise(letter.passphrase)
    ) {
      setWrong(false);
      unlock();
    } else setWrong(true);
  };

  const [first, ...rest] = letter.paragraphs;

  return (
    <LoveSection id="letter" depth={1} stage="200vh">
      <div
        ref={root}
        data-letter-locked={letter.passphrase ? '' : undefined}
        className={cn(
          'relative flex w-full flex-col items-center',
          !quiet &&
            'min-h-[calc(100svh-12rem)] justify-center md:min-h-[calc(100svh-16rem)]',
        )}
      >
        {!quiet && <LetterBackdrop />}
        <h2 id="letter-title" className={cn(sectionTitle, 'relative z-10')}>
          {title}
        </h2>

        <div
          data-scroll
          className={cn(
            'z-10 mx-auto flex w-full max-w-2xl flex-col',
            quiet ? 'relative mt-12' : 'relative mt-8 h-[min(62svh,44rem)]',
          )}
        >
          {!quiet && (
            <div
              data-rod="top"
              aria-hidden
              className={rod}
              style={showOpen ? undefined : sealHole('50% 100%', sealR)}
            />
          )}
          <article
            ref={card}
            data-letter-card
            data-lenis-prevent
            aria-hidden={!showOpen}
            className={cn(
              'love-parchment relative min-h-0 flex-1 overflow-y-auto text-left',
              quiet ? 'rounded-lg' : '-my-3',
              !showOpen && 'invisible',
            )}
          >
            <div
              data-letter-sheet
              className="relative min-h-full pt-10 pb-12 md:pt-12 md:pb-14"
            >
              <ParchmentFrame />
              <div className="relative mx-auto flex max-w-[60ch] flex-col gap-5 px-10 text-[1.15rem] leading-relaxed text-pretty break-words md:px-16 md:text-[1.25rem]">
                {!quiet && <LetterQuill />}
                {letter.salutation && (
                  <p
                    data-letter-p
                    data-letter-write
                    className="font-display text-[1.4rem] md:text-[1.6rem]"
                  >
                    {letter.salutation}
                  </p>
                )}
                {first && (
                  <p
                    data-letter-p
                    data-letter-write
                    className="first-letter:font-display first-letter:text-gold-text first-letter:float-left first-letter:mr-2 first-letter:text-[3.4em] first-letter:leading-[0.85]"
                  >
                    {first}
                  </p>
                )}
                <div data-letter-p>
                  <HeartDivider />
                </div>
                {rest.map((p, i) => (
                  <p key={i} data-letter-p data-letter-write>
                    {p}
                  </p>
                ))}
                <div data-letter-p className="mt-4">
                  <HeartDivider />
                </div>
                <p data-letter-p className="relative text-right italic">
                  {letter.signoff}
                  <HiddenHeart id="letter" className="-top-12 right-0" />
                </p>
                {letter.voice && (
                  <LetterVoice {...letter.voice} open={showOpen} />
                )}
              </div>
            </div>
            {!quiet && !scrolled && (
              <span
                aria-hidden
                data-letter-hint
                className="text-gold sticky bottom-8 left-1/2 block h-0 w-fit -translate-x-1/2 animate-bounce motion-reduce:animate-none"
              >
                <ChevronDown className="text-gold size-5" />
              </span>
            )}
          </article>
          {!quiet && (
            <div
              data-rod="bottom"
              aria-hidden
              className={rod}
              style={showOpen ? undefined : sealHole('50% 0%', sealR)}
            />
          )}

          {!showOpen && (
            <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center">
              {letter.passphrase ? (
                <span aria-hidden data-seal className="size-20" />
              ) : (
                <button
                  type="button"
                  data-seal
                  {...handlers}
                  aria-describedby={`${passId}-hint`}
                  className="focus-ring relative size-24 touch-none rounded-full select-none"
                >
                  <span
                    data-seal-half="left"
                    aria-hidden
                    className="border-gold absolute inset-0 rounded-full border-3 [clip-path:inset(0_50%_0_0)]"
                  />
                  <span
                    data-seal-half="right"
                    aria-hidden
                    className="border-gold absolute inset-0 rounded-full border-3 [clip-path:inset(0_0_0_50%)]"
                  />
                  <span className="sr-only">Open the letter</span>
                </button>
              )}
            </div>
          )}
        </div>

        {!showOpen && !opening && (
          <div className="absolute inset-x-4 top-[calc(50%+6rem)] z-10 mx-auto flex max-w-sm flex-col items-center">
            {!letter.passphrase && (
              <p id={`${passId}-hint`} className={labelText}>
                Hold the seal, or keep scrolling.
              </p>
            )}
            {letter.passphrase && (
              <form onSubmit={submit} className="flex w-full flex-col gap-2">
                <label htmlFor={passId} className={labelText}>
                  Our word
                </label>
                <div className="flex gap-2">
                  <Input
                    id={passId}
                    name="passphrase"
                    autoComplete="off"
                    aria-invalid={wrong || undefined}
                    aria-describedby={`${passId}-msg`}
                  />
                  <Button
                    type="submit"
                    variant="love-primary"
                    className="max-sm:w-auto"
                  >
                    Open
                  </Button>
                </div>
                <p
                  id={`${passId}-msg`}
                  aria-live="polite"
                  className="text-small text-muted-foreground min-h-[1.5em] font-sans"
                >
                  {wrong ? 'Not quite, try again' : ''}
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </LoveSection>
  );
}

// Blueprint 062: each line is inked left to right while the quill rides the edge.
// Positions are measured relative to [data-letter-sheet] via getBoundingClientRect.
function writeLetter(scope: HTMLElement | null, card: HTMLElement | null) {
  const tl = gsap.timeline();
  if (!scope) return tl;
  const quill = scope.querySelector<HTMLElement>('[data-letter-quill]');
  const sheet = scope.querySelector<HTMLElement>('[data-letter-sheet]');
  const blocks = gsap.utils.toArray<HTMLElement>('[data-letter-p]', scope);
  const split = SplitText.create(
    scope.querySelectorAll('[data-letter-write]'),
    { type: 'lines' },
  );
  gsap.set(split.lines, {
    width: 'fit-content',
    clipPath: 'inset(0% 100% 0% 0%)',
  });
  blocks.forEach((b) =>
    gsap.set(b, {
      autoAlpha: b.hasAttribute('data-letter-write') ? 1 : 0,
      y: 0,
    }),
  );
  const follow = (line: HTMLElement) => {
    const c = card;
    if (!c) return;
    const over =
      line.getBoundingClientRect().bottom - c.getBoundingClientRect().bottom;
    if (over > -48)
      gsap.to(c, {
        scrollTop: c.scrollTop + over + c.clientHeight * 0.35,
        duration: 0.5,
        ease: 'power2.out',
      });
  };
  // Measure against the quill's own container (it scrolls with the card); the nib is bottom-left.
  const pos = (line: HTMLElement) => {
    const r = line.getBoundingClientRect();
    const box = (quill?.offsetParent as HTMLElement | null) ?? sheet;
    const b = box ? box.getBoundingClientRect() : { left: 0, top: 0 };
    return {
      x0: r.left - b.left,
      x1: r.right - b.left,
      y: r.bottom - b.top - (quill?.offsetHeight ?? 48) + r.height * 0.15,
    };
  };
  if (quill) tl.set(quill, { autoAlpha: 1, yPercent: 0, x: 0, y: 0 });
  blocks.forEach((b) => {
    if (!b.hasAttribute('data-letter-write')) {
      tl.to(b, { autoAlpha: 1, duration: 0.4 });
      return;
    }
    (split.lines as HTMLElement[])
      .filter((l) => b.contains(l))
      .forEach((line) => {
        const d = gsap.utils.clamp(
          0.35,
          0.8,
          (line.textContent?.length ?? 0) * 0.016,
        );
        tl.call(() => follow(line));
        // Pen lands on the line, then rides the ink edge in step with the reveal.
        if (quill)
          tl.call(() => {
            const p = pos(line);
            gsap
              .timeline()
              .to(quill, { x: p.x0, y: p.y - 6, duration: 0.12 })
              .to(quill, { y: p.y, duration: 0.08 })
              .to(quill, { x: p.x1, duration: d, ease: 'none' });
          });
        tl.to(
          line,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: d, ease: 'none' },
          '+=0.2',
        );
        if (!quill) return;
        tl.fromTo(
          quill,
          { rotation: -5 },
          {
            rotation: 4,
            duration: d / 4,
            repeat: 3,
            yoyo: true,
            ease: 'sine.inOut',
          },
          '<',
        );
      });
  });
  if (quill) tl.to(quill, { autoAlpha: 0, duration: 0.4 });
  return tl.call(() => split.revert());
}
