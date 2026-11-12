import { describe, expect, it } from 'vitest';

import { resolveCalm } from './motion-prefs';

describe('resolveCalm', () => {
  it('is off when nothing asks for calm', () => {
    expect(resolveCalm({ user: false, os: false, saveData: false })).toEqual({
      calm: false,
      reason: null,
    });
  });

  it('prefers the user reason, then OS, then Save-Data', () => {
    expect(resolveCalm({ user: true, os: true, saveData: true }).reason).toBe(
      'user',
    );
    expect(resolveCalm({ user: false, os: true, saveData: true }).reason).toBe(
      'os',
    );
    expect(resolveCalm({ user: false, os: false, saveData: true })).toEqual({
      calm: true,
      reason: 'save-data',
    });
  });
});
