'use client';

import { CalendarPlus, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { LoveSiteConfig } from '../config';
import { countdownParts } from '../engine/countdown';
import { director } from '../engine/heart-director';
import { progressSet, usePersistedSet } from '../engine/hidden-hearts';
import { buildIcs, downloadIcs } from '../engine/ics';
import { GiftBox } from '../ui/gift-box';
import { labelText } from './love-section';

type Gifts = NonNullable<NonNullable<LoveSiteConfig['afterglow']>['gifts']>;
type Plan = NonNullable<Gifts['items'][number]['plan']>;

const card =
  'border-gold/40 bg-surface/70 mt-1 rounded-lg border p-5 text-left shadow-sm';

export function AfterglowGifts({
  slug,
  gifts,
}: {
  slug: string;
  gifts: Gifts;
}) {
  const set = progressSet(slug, 'gifts');
  const opened = usePersistedSet(set);
  const pickedOne = gifts.mode === 'pick-one' && opened.length > 0;

  return (
    <div data-reveal className="w-full">
      <h3 id="afterglow-gifts-title" className="text-h3 font-display">
        Three little gifts
      </h3>
      <p className="text-body text-muted-foreground mt-2">
        {gifts.mode === 'pick-one'
          ? 'Choose one. Hold it until the ribbon lets go.'
          : gifts.mode === 'sequence'
            ? 'One at a time, in order. Hold each until the ribbon lets go.'
            : 'Hold each one until the ribbon lets go.'}
      </p>
      <ul className="mt-10 grid justify-items-center gap-10 md:grid-cols-3">
        {gifts.items.map((g, i) => {
          const isOpen = opened.includes(g.id);
          return (
            <li key={g.id} className="w-full">
              <GiftBox
                index={i}
                total={gifts.items.length}
                label={g.label}
                opened={isOpen}
                sealed={
                  !isOpen &&
                  (gifts.mode === 'sequence'
                    ? gifts.items
                        .slice(0, i)
                        .some((p) => !opened.includes(p.id))
                    : pickedOne)
                }
                sealedLabel={
                  gifts.mode === 'sequence'
                    ? 'Open the one before first'
                    : undefined
                }
                onOpen={() => set.add(g.id)}
              >
                <div className={card}>
                  <p className="font-display text-h4 text-gold-text">
                    {g.title}
                  </p>
                  <p className="text-body mt-2 text-pretty">{g.text}</p>
                  {g.plan && <PlanCard title={g.title} plan={g.plan} />}
                </div>
              </GiftBox>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// One clock (§4.1): ticks once a second and stops itself once `until` has passed.
function useNow(until: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= until) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [until]);
  return now;
}

const when = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'full',
  timeStyle: 'short',
});

function PlanCard({ title, plan }: { title: string; plan: Plan }) {
  const start = new Date(plan.startsAt).getTime();
  const now = useNow(start + plan.durationMin * 60_000);
  const left = countdownParts(start, plan.durationMin, now);
  useEffect(() => {
    void director.play('shine');
  }, []);

  const maps = plan.mapsQuery ?? plan.place;
  return (
    <div className="border-gold/50 relative mt-5 border-t-2 border-dashed pt-5">
      <span
        aria-hidden
        className="bg-background absolute -top-3 -left-8 size-6 rounded-full"
      />
      <span
        aria-hidden
        className="bg-background absolute -top-3 -right-8 size-6 rounded-full"
      />
      <p className={labelText}>{when.format(start)}</p>
      <p className="text-body mt-1 font-semibold">{plan.place}</p>
      {plan.note && (
        <p className="text-small text-muted-foreground mt-1">{plan.note}</p>
      )}
      <p className="font-display text-h4 text-gold-text mt-3" aria-live="off">
        {left.state === 'future' ? (
          <Countdown
            days={left.days}
            hours={left.hours}
            minutes={left.minutes}
          />
        ) : left.state === 'today' ? (
          "It's today. I'll see you there."
        ) : (
          'We did this one. More to come.'
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {left.state !== 'past' && (
          <Button
            variant="love-primary"
            onClick={() =>
              downloadIcs(
                'our-plan.ics',
                buildIcs({
                  title,
                  startsAt: plan.startsAt,
                  durationMin: plan.durationMin,
                  location: plan.place,
                  description: plan.note,
                }),
              )
            }
          >
            <CalendarPlus aria-hidden className="text-primary" />
            Add to calendar
          </Button>
        )}
        <Button variant="love-ghost" asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(maps)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin aria-hidden className="text-secondary" />
            Open in Maps
          </a>
        </Button>
      </div>
    </div>
  );
}

// Blueprint 059: odometer digits that roll to each new value (CSS transform, no per-tick React work).
function Countdown({
  days,
  hours,
  minutes,
}: {
  days: number;
  hours: number;
  minutes: number;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="sr-only">
        {days} days {hours} hours {minutes} minutes to go
      </span>
      <Rolling value={days} unit="d" />
      <Rolling value={hours} unit="h" pad />
      <Rolling value={minutes} unit="m" pad />
      <span aria-hidden className="ml-1">
        to go
      </span>
    </span>
  );
}

function Rolling({
  value,
  unit,
  pad,
}: {
  value: number;
  unit: string;
  pad?: boolean;
}) {
  const digits = String(value)
    .padStart(pad ? 2 : 1, '0')
    .split('');
  return (
    <span aria-hidden className="inline-flex items-baseline">
      {digits.map((d, i) => (
        <span
          key={digits.length - i}
          className="relative inline-block h-[1.15em] w-[0.62em] overflow-hidden"
        >
          <span
            className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.3,1)] motion-reduce:transition-none"
            style={{ transform: `translateY(${-Number(d) * 1.15}em)` }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="h-[1.15em] leading-[1.15em]">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
      <span className="text-gold-text/80 ml-0.5 text-[0.7em]">{unit}</span>
    </span>
  );
}
