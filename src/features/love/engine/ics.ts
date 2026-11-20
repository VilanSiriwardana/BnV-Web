// Romance Additions F7: a one-event calendar file (RFC 5545), built and downloaded on the device.
export type IcsEvent = {
  title: string;
  /** ISO date-time with an explicit offset, e.g. 2026-12-06T18:30:00+05:30. */
  startsAt: string;
  durationMin: number;
  location?: string;
  description?: string;
};

export function escapeIcs(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function toIcsUtc(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export function buildIcs(event: IcsEvent, now = new Date()) {
  const start = new Date(event.startsAt);
  const end = new Date(start.getTime() + event.durationMin * 60_000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BnV//Love//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${toIcsUtc(start)}-${start.getTime().toString(36)}@bnv.love`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeIcs(event.location)}`] : []),
    ...(event.description
      ? [`DESCRIPTION:${escapeIcs(event.description)}`]
      : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.join('\r\n')}\r\n`;
}

export function downloadIcs(filename: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/calendar;charset=utf-8' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
