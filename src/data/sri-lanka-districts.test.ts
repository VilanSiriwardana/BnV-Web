import { describe, expect, it } from 'vitest';

import { districts, provinceForDistrict } from './sri-lanka-districts';

describe('districts', () => {
  it('lists all 25 districts', () => {
    expect(districts).toHaveLength(25);
  });

  it('derives the province', () => {
    expect(provinceForDistrict('Colombo')).toBe('Western');
    expect(provinceForDistrict('Nuwara Eliya')).toBe('Central');
    expect(provinceForDistrict('Kegalle')).toBe('Sabaragamuwa');
  });
});
