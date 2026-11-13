import { describe, expect, it } from 'vitest';

import {
  activeNode,
  nodeSectionProgress,
  threadProgress,
} from './timeline-progress';

describe('threadProgress', () => {
  it('maps 10–90 % of the section to the full thread', () => {
    expect(threadProgress(0)).toBe(0);
    expect(threadProgress(0.1)).toBe(0);
    expect(threadProgress(0.5)).toBeCloseTo(0.5);
    expect(threadProgress(0.95)).toBe(1);
  });
});

describe('activeNode', () => {
  it('returns -1 before the first node and the last passed node after', () => {
    expect(activeNode(0.05)).toBe(-1);
    expect(activeNode(0.1)).toBe(0);
    expect(activeNode(0.49)).toBe(1);
    expect(activeNode(0.5)).toBe(2);
    expect(activeNode(1)).toBe(4);
  });

  it('round-trips with nodeSectionProgress', () => {
    for (let i = 0; i < 5; i++) {
      expect(activeNode(threadProgress(nodeSectionProgress(i)) + 1e-9)).toBe(i);
    }
  });
});
