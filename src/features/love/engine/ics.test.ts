import { describe, expect, it } from 'vitest';

import { buildIcs, escapeIcs, toIcsUtc } from './ics';

const event = {
  title: 'Dinner, just us',
  startsAt: '2026-12-06T18:30:00+05:30',
  durationMin: 180,
  location: 'By the sea; Colombo',
  description: 'Line one\nLine two',
};

describe('ics', () => {
  it('uses CRLF line endings only', () => {
    const ics = buildIcs(event, new Date('2026-11-20T00:00:00Z'));
    expect(ics.endsWith('\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });

  it('converts an offset start to UTC and adds the duration', () => {
    const ics = buildIcs(event);
    expect(ics).toContain('DTSTART:20261206T130000Z');
    expect(ics).toContain('DTEND:20261206T160000Z');
  });

  it('escapes text fields', () => {
    expect(escapeIcs('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
    const ics = buildIcs(event);
    expect(ics).toContain('SUMMARY:Dinner\\, just us');
    expect(ics).toContain('LOCATION:By the sea\\; Colombo');
    expect(ics).toContain('DESCRIPTION:Line one\\nLine two');
  });

  it('has UID and DTSTAMP and omits empty optionals', () => {
    const ics = buildIcs(
      { title: 'x', startsAt: event.startsAt, durationMin: 60 },
      new Date('2026-11-20T08:09:10Z'),
    );
    expect(ics).toMatch(/UID:.+@bnv\.love/);
    expect(ics).toContain('DTSTAMP:20261120T080910Z');
    expect(ics).not.toContain('LOCATION');
    expect(toIcsUtc(new Date('2026-01-02T03:04:05.678Z'))).toBe(
      '20260102T030405Z',
    );
  });
});
