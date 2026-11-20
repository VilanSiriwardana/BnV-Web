import { describe, expect, it } from 'vitest';

import { splitBloomLines } from './bloom-lines';

describe('splitBloomLines', () => {
  it('splits the default sentence into three readable lines', () => {
    expect(splitBloomLines('Every moment with you opens like this.')).toEqual([
      'Every moment',
      'with you',
      'opens like this.',
    ]);
  });

  it('keeps every word, in order, with no empty line', () => {
    const line = 'You are the quiet gold in every single one of my days';
    const out = splitBloomLines(line);
    expect(out.join(' ')).toBe(line);
    out.forEach((l) => expect(l.length).toBeGreaterThan(0));
  });

  it('handles very short input', () => {
    expect(splitBloomLines('Hello there')).toEqual(['Hello', 'there', '']);
    expect(splitBloomLines('one two three')).toEqual(['one', 'two', 'three']);
  });
});
