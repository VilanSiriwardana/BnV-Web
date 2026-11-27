import { describe, expect, it } from 'vitest';

import {
  type ShardPose,
  SHATTER_DURATION,
  fracturePane,
  shardMotion,
  shardPoseAt,
  shardVelocities,
  triangleArea,
} from './glass-fracture';

describe('glass fracture', () => {
  it('covers the pane exactly', () => {
    for (const n of [16, 32]) {
      const shards = fracturePane(0.34, 0.26, n);
      const area = shards.reduce((sum, s) => sum + triangleArea(s), 0);
      expect(area).toBeCloseTo(0.34 * 0.26, 4);
      expect(shards.length).toBeGreaterThanOrEqual(n - 4);
    }
  });

  it('is deterministic per seed', () => {
    expect(fracturePane(0.34, 0.26, 32, 3)).toEqual(
      fracturePane(0.34, 0.26, 32, 3),
    );
  });

  it('flies out, falls and fades by the end', () => {
    const [shard] = fracturePane(0.34, 0.26, 32);
    const pose: ShardPose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, opacity: 0 };
    shardMotion(shard, 0, 0.5, { x: 0, y: 0 }, pose);
    expect(pose.z).toBeGreaterThan(0);
    expect(pose.opacity).toBe(1);
    shardMotion(shard, 0, SHATTER_DURATION, { x: 0, y: 0 }, pose);
    expect(pose.opacity).toBe(0);
  });

  it('precomputed velocities reproduce shardMotion exactly', () => {
    const shards = fracturePane(0.34, 0.26, 32);
    const impact = { x: 0.05, y: -0.02 };
    const push = { x: 0.3, y: -0.4 };
    const vel = shardVelocities(shards, impact, push);
    const a: ShardPose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, opacity: 0 };
    const b: ShardPose = { ...a };
    shards.forEach((s, i) => {
      for (const t of [0.1, 0.8, 1.3]) {
        shardMotion(s, i, t, impact, a, push);
        shardPoseAt(vel, i, s, t, b);
        for (const k of Object.keys(a) as (keyof ShardPose)[])
          expect(b[k]).toBeCloseTo(a[k], 5);
      }
    });
  });
});
