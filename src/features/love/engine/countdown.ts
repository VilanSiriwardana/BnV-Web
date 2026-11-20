// Romance Additions F7: plan countdown. Never negative: 'today' on the day, 'past' once it ends.
export type Countdown =
  | { state: 'future'; days: number; hours: number; minutes: number }
  | { state: 'today' }
  | { state: 'past' };

const MIN = 60_000;

function sameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function countdownParts(
  start: number,
  durationMin: number,
  now: number,
): Countdown {
  if (now >= start + durationMin * MIN) return { state: 'past' };
  if (now >= start || sameLocalDay(new Date(start), new Date(now)))
    return { state: 'today' };
  const total = Math.ceil((start - now) / MIN);
  return {
    state: 'future',
    days: Math.floor(total / 1440),
    hours: Math.floor((total % 1440) / 60),
    minutes: total % 60,
  };
}
