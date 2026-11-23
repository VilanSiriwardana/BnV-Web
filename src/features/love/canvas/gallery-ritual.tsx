'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  type CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  type Group,
  MathUtils,
  type Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Matrix4,
  Plane,
  type Points,
  PointsMaterial,
  Quaternion,
  Raycaster,
  Shape,
  Vector2,
  Vector3,
} from 'three';

import { DOOR_T } from '../engine/gallery-path';
import { ritualState } from '../engine/gallery-ritual';
import {
  type ShardPose,
  SHATTER_DURATION,
  fracturePane,
  shardMotion,
} from '../engine/glass-fracture';
import { TIERS, type Tier } from '../engine/tiers';
import { placeAcross } from './gallery-corridor';
import { KEY_SCALE, KEYHOLE_LOCAL } from './gallery-doorway';
import { createKeyGeometry } from './gallery-key';
import { glowTexture } from './gallery-surfaces';
import { mulberry32 } from './heart-geometry';
import { projectRadius, projectToScreen } from './projection';

// Door-group space (same frame as gallery-doorway.tsx): +z faces her, the opening spans x ±0.98.
const CASE = { x: -0.86, y: 1.2, z: 0.85, w: 0.34, h: 0.26, d: 0.3 };
const PEDESTAL_H = 1.05;
const HAMMER_LEN = 0.55;
// Blueprint 055: the strike follows her stroke — the head starts on the stroke's start side and
// leads face-first along it into the pane, the handle trailing to the side.
const IMPACT = new Vector3(CASE.x, CASE.y + 0.03, CASE.z + CASE.d / 2 + 0.07);
const REACH = 0.6;
const swingDir = new Vector3();
const swingFrom = new Vector3();
const swingVia = new Vector3();
const headSide = new Vector3();
const headFwd = new Vector3();
const swingBasis = new Matrix4();
const HEAD_HALF = 0.11;
const hammerAt = (dir: Vector3, t: number, out: Vector3) => {
  swingFrom.copy(IMPACT).addScaledVector(dir, -REACH);
  swingFrom.z += 0.15;
  swingVia.lerpVectors(swingFrom, IMPACT, 0.5);
  swingVia.x += -dir.y * 0.08;
  swingVia.y += dir.x * 0.08;
  swingVia.z += 0.12;
  const u = 1 - t;
  return out
    .copy(swingFrom)
    .multiplyScalar(u * u)
    .addScaledVector(swingVia, 2 * u * t)
    .addScaledVector(IMPACT, t * t);
};
const SPARKS = 40;
const KEY_REST = new Vector3(CASE.x, PEDESTAL_H + 0.03, CASE.z);
const KEY_HOVER = new Vector3(KEYHOLE_LOCAL.x, KEYHOLE_LOCAL.y, 0.28);
const KEY_IN = new Vector3(
  KEYHOLE_LOCAL.x,
  KEYHOLE_LOCAL.y,
  0.03 - 0.06 * KEY_SCALE,
);
const REST_TILT = new Quaternion()
  .setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2)
  .multiply(
    new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2),
  );
const UPRIGHT = new Quaternion();
const none = () => null;

const raycaster = new Raycaster();
const ndc = new Vector2();
const plane = new Plane();
const tmp = new Vector3();
const tmp2 = new Vector3();
const normal = new Vector3();
const pose: ShardPose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, opacity: 1 };

type Props = { curve: CatmullRomCurve3; tier: Tier };

// Blueprint 053: the unlock ritual's props — a gilded pedestal left of the doors holding a glass case
// with the gold key, the sledgehammer that breaks it, and the shards. Driven by ritualState.
export function GalleryRitual({ curve, tier }: Props) {
  const { position, yaw } = useMemo(() => placeAcross(curve, DOOR_T), [curve]);
  const group = useRef<Group>(null);
  const front = useRef<Mesh>(null);
  const shardsMesh = useRef<Mesh>(null);
  const sparks = useRef<Points>(null);
  const key = useRef<Mesh>(null);
  const hammer = useRef<Group>(null);
  const keyFrom = useRef(new Vector3().copy(KEY_REST));
  const held = useRef(new Vector3().copy(KEY_REST));

  const shardCount = TIERS[tier].galleryShards;
  const sparkle = TIERS[tier].gallerySparkle;
  const shards = useMemo(
    () => fracturePane(CASE.w, CASE.h, shardCount, 7),
    [shardCount],
  );

  const kit = useMemo(() => {
    const gold = new MeshStandardMaterial({
      color: '#d4ad55',
      metalness: 1,
      roughness: 0.3,
      emissive: '#3a2a08',
    });
    const stone = new MeshStandardMaterial({
      color: '#2e1a12',
      roughness: 0.5,
    });
    const velvet = new MeshStandardMaterial({ color: '#5a1032', roughness: 1 });
    const wood = new MeshStandardMaterial({ color: '#3b2418', roughness: 0.6 });
    const glass = new MeshPhysicalMaterial({
      color: '#e8f0ff',
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      depthWrite: false,
      side: DoubleSide,
    });
    const shardMat = glass.clone();
    shardMat.opacity = 0.35;
    const keyMat = new MeshStandardMaterial({
      color: '#f0cf72',
      metalness: 1,
      roughness: 0.22,
      emissive: '#6b4a10',
    });
    const glow = glowTexture();
    const sparkMat = new PointsMaterial({
      map: glow,
      color: '#ffe3b0',
      size: 0.05,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    });
    const halo = new MeshBasicMaterial({
      map: glow,
      color: '#ffd29a',
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    });
    const headShape = new Shape();
    const r = 0.02;
    const hw = 0.11;
    const hh = 0.05;
    headShape.moveTo(-hw + r, -hh);
    headShape.lineTo(hw - r, -hh);
    headShape.quadraticCurveTo(hw, -hh, hw, -hh + r);
    headShape.lineTo(hw, hh - r);
    headShape.quadraticCurveTo(hw, hh, hw - r, hh);
    headShape.lineTo(-hw + r, hh);
    headShape.quadraticCurveTo(-hw, hh, -hw, hh - r);
    headShape.lineTo(-hw, -hh + r);
    headShape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    const head = new ExtrudeGeometry(headShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      bevelSegments: 3,
    });
    head.center();
    return {
      materials: {
        gold,
        stone,
        velvet,
        wood,
        glass,
        shardMat,
        keyMat,
        sparkMat,
        halo,
      },
      textures: [glow],
      geo: {
        box: new BoxGeometry(1, 1, 1),
        plane: new PlaneGeometry(1, 1),
        handle: new CylinderGeometry(0.014, 0.016, HAMMER_LEN, 10),
        head,
        key: createKeyGeometry(),
      },
    };
  }, []);

  const shardGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(shards.length * 9), 3),
    );
    return g;
  }, [shards]);

  const sparkGeo = useMemo(() => {
    const rand = mulberry32(5);
    const dirs = new Float32Array(SPARKS * 3);
    for (let i = 0; i < SPARKS; i++)
      dirs.set([(rand() - 0.5) * 2, rand() * 1.4, 0.4 + rand() * 1.2], i * 3);
    const g = new BufferGeometry();
    g.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(SPARKS * 3), 3),
    );
    g.userData.dirs = dirs;
    return g;
  }, []);

  useEffect(
    () => () => {
      Object.values(kit.materials).forEach((m) => m.dispose());
      kit.textures.forEach((t) => t.dispose());
      Object.values(kit.geo).forEach((g) => g.dispose());
    },
    [kit],
  );
  useEffect(() => () => shardGeo.dispose(), [shardGeo]);
  useEffect(() => () => sparkGeo.dispose(), [sparkGeo]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const s = ritualState;
    const { camera, size } = state;

    // Glass: the front pane is whole until the strike, then the shards fly.
    const t = s.shatterAt < 0 ? -1 : (performance.now() - s.shatterAt) / 1000;
    if (front.current) front.current.visible = t < 0;
    const sm = shardsMesh.current;
    if (sm) {
      sm.visible = t >= 0 && t < SHATTER_DURATION;
      if (sm.visible) {
        const pos = sm.geometry.attributes.position as BufferAttribute;
        shards.forEach((shard, i) => {
          shardMotion(shard, i, t, s.impact, pose, s.swipe);
          const cr = Math.cos(pose.rx);
          const sr = Math.sin(pose.rx);
          const cy = Math.cos(pose.ry);
          const sy = Math.sin(pose.ry);
          [shard.a, shard.b, shard.c].forEach((p, v) => {
            const lx = p.x - shard.centroid.x;
            const ly = p.y - shard.centroid.y;
            const y1 = ly * cr;
            const z1 = ly * sr;
            const x2 = lx * cy + z1 * sy;
            const z2 = -lx * sy + z1 * cy;
            pos.setXYZ(i * 3 + v, pose.x + x2, pose.y + y1, pose.z + z2);
          });
          (sm.material as MeshPhysicalMaterial).opacity = 0.35 * pose.opacity;
        });
        pos.needsUpdate = true;
      }
    }
    const sp = sparks.current;
    if (sp) {
      sp.visible = sparkle && t >= 0 && t < 1.1;
      if (sp.visible) {
        const pos = sp.geometry.attributes.position as BufferAttribute;
        const dirs = sp.geometry.userData.dirs as Float32Array;
        for (let i = 0; i < SPARKS; i++)
          pos.setXYZ(
            i,
            s.impact.x + dirs[i * 3] * 0.5 * t,
            s.impact.y + dirs[i * 3 + 1] * 0.5 * t - 2 * t * t,
            dirs[i * 3 + 2] * 0.4 * t,
          );
        pos.needsUpdate = true;
        (sp.material as PointsMaterial).opacity = Math.max(0, 1 - t / 1.1);
      }
    }

    // Hammer: raised over her side of the case, swinging down along the swipe.
    const h = hammer.current;
    if (h) {
      h.visible = s.mode === 'smashing';
      const along = MathUtils.clamp(s.hammer, 0, 1);
      // Screen y points down; the door group's y points up.
      swingDir.set(s.swipe.x, -s.swipe.y, 0).normalize();
      hammerAt(swingDir, along, h.position);
      // Wind-up pulls back against the stroke before the strike.
      const pull = Math.max(0, -s.hammer) / 0.12;
      h.position.addScaledVector(swingDir, -pull * 0.1);
      // Face-first: the head's long axis follows the stroke so its face lands on IMPACT.
      h.position.addScaledVector(swingDir, -HEAD_HALF);
      headSide
        .set(-swingDir.y, swingDir.x, 0.5 * (1 - along) + 0.2 * pull)
        .normalize();
      headFwd.crossVectors(swingDir, headSide).normalize();
      headSide.crossVectors(headFwd, swingDir);
      h.quaternion.setFromRotationMatrix(
        swingBasis.makeBasis(swingDir, headSide, headFwd),
      );
    }

    // Key: resting on the velvet, held under her finger, drifting home, or sliding into the lock.
    const k = key.current;
    if (k) {
      k.visible = s.keyIn < 1;
      if (s.keyHeld) {
        ndc.set(s.pointer.x, s.pointer.y);
        raycaster.setFromCamera(ndc, camera);
        normal.set(0, 0, 1).applyQuaternion(g.quaternion);
        plane.setFromNormalAndCoplanarPoint(
          normal,
          g.localToWorld(tmp.set(0, 0, 0.35)),
        );
        if (raycaster.ray.intersectPlane(plane, tmp2))
          held.current.copy(g.worldToLocal(tmp2));
        k.position.lerp(held.current, 0.35);
        k.quaternion.slerp(UPRIGHT, 0.2);
      } else if (s.keyIn > 0) {
        const a = Math.min(s.keyIn / 0.6, 1);
        const b = Math.max((s.keyIn - 0.6) / 0.4, 0);
        k.position.copy(keyFrom.current).lerp(KEY_HOVER, a).lerp(KEY_IN, b);
        k.quaternion.slerp(UPRIGHT, 0.25);
      } else if (s.mode === 'keyFree' && s.keyReturn > 0 && s.keyReturn < 1) {
        k.position.copy(held.current).lerp(KEY_REST, s.keyReturn);
        k.quaternion.slerp(REST_TILT, 0.2);
        keyFrom.current.copy(k.position);
      } else {
        k.position.copy(KEY_REST);
        k.quaternion.copy(REST_TILT);
        keyFrom.current.copy(KEY_REST);
      }
      k.position.y +=
        s.mode === 'keyFree'
          ? Math.sin(state.clock.elapsedTime * 2) * 0.004
          : 0;
    }

    // Screen positions for the overlay (swipe target, grab target, snap target).
    g.localToWorld(tmp.set(CASE.x, CASE.y, CASE.z + CASE.d / 2));
    const c = projectToScreen(tmp, camera, size);
    s.screen.case = {
      x: c.x,
      y: c.y,
      r: projectRadius(tmp, CASE.h, camera, size),
      visible: c.visible,
    };
    if (k) {
      k.getWorldPosition(tmp);
      const kp = projectToScreen(tmp, camera, size);
      s.screen.key = { x: kp.x, y: kp.y, r: 0, visible: kp.visible };
    }
    g.localToWorld(tmp.set(KEYHOLE_LOCAL.x, KEYHOLE_LOCAL.y, KEYHOLE_LOCAL.z));
    const kh = projectToScreen(tmp, camera, size);
    s.screen.keyhole = { x: kh.x, y: kh.y, r: 0, visible: kh.visible };
  });

  const { gold, stone, velvet, wood, glass, shardMat, keyMat, sparkMat, halo } =
    kit.materials;
  const { box, plane: quad, handle, head } = kit.geo;
  const top = PEDESTAL_H;
  const bar = (
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
  ) => (
    <mesh
      geometry={box}
      material={gold}
      position={[x, y, z]}
      scale={[sx, sy, sz]}
      raycast={none}
    />
  );

  return (
    <group
      ref={group}
      position={[position.x, 0, position.z]}
      rotation={[0, yaw, 0]}
    >
      {/* Pedestal */}
      <mesh
        geometry={box}
        material={stone}
        position={[CASE.x, top / 2, CASE.z]}
        scale={[0.3, top, 0.3]}
        raycast={none}
      />
      {bar(CASE.x, 0.06, CASE.z, 0.38, 0.12, 0.38)}
      {bar(CASE.x, top - 0.02, CASE.z, 0.42, 0.04, 0.42)}
      {[-0.08, 0, 0.08].map((dx) => (
        <mesh
          key={dx}
          geometry={box}
          material={gold}
          position={[CASE.x + dx, top / 2, CASE.z + 0.152]}
          scale={[0.014, top * 0.75, 0.006]}
          raycast={none}
        />
      ))}
      <mesh
        geometry={quad}
        material={velvet}
        position={[CASE.x, top + 0.002, CASE.z]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[CASE.w - 0.02, CASE.d - 0.02, 1]}
        raycast={none}
      />
      <mesh
        geometry={quad}
        material={halo}
        position={[CASE.x, CASE.y, CASE.z - CASE.d / 2 + 0.01]}
        scale={[0.5, 0.4, 1]}
        raycast={none}
      />

      {/* Glass case: back, sides and lid stay; the front pane shatters */}
      <group position={[CASE.x, CASE.y, CASE.z]}>
        <mesh
          geometry={quad}
          material={glass}
          position={[0, 0, -CASE.d / 2]}
          scale={[CASE.w, CASE.h, 1]}
          raycast={none}
        />
        <mesh
          geometry={quad}
          material={glass}
          position={[-CASE.w / 2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[CASE.d, CASE.h, 1]}
          raycast={none}
        />
        <mesh
          geometry={quad}
          material={glass}
          position={[CASE.w / 2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[CASE.d, CASE.h, 1]}
          raycast={none}
        />
        <mesh
          geometry={quad}
          material={glass}
          position={[0, CASE.h / 2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[CASE.w, CASE.d, 1]}
          raycast={none}
        />
        <mesh
          ref={front}
          geometry={quad}
          material={glass}
          position={[0, 0, CASE.d / 2]}
          scale={[CASE.w, CASE.h, 1]}
          raycast={none}
        />
        <mesh
          ref={shardsMesh}
          geometry={shardGeo}
          material={shardMat}
          position={[0, 0, CASE.d / 2]}
          visible={false}
          raycast={none}
        />
        <points
          ref={sparks}
          geometry={sparkGeo}
          material={sparkMat}
          position={[0, 0, CASE.d / 2]}
          visible={false}
          raycast={none}
        />
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sy) => (
            <group key={`${sx}${sy}`}>
              {bar(
                (sx * CASE.w) / 2,
                0,
                (sy * CASE.d) / 2,
                0.012,
                CASE.h,
                0.012,
              )}
            </group>
          )),
        )}
        {bar(0, CASE.h / 2, 0, CASE.w + 0.02, 0.014, CASE.d + 0.02)}
        {bar(0, -CASE.h / 2, 0, CASE.w + 0.02, 0.014, CASE.d + 0.02)}
      </group>

      {/* Key */}
      <mesh
        ref={key}
        geometry={kit.geo.key}
        material={keyMat}
        position={KEY_REST}
        quaternion={REST_TILT}
        scale={KEY_SCALE}
        raycast={none}
      />

      {/* Sledgehammer: origin at the head, face leading along her stroke, handle trailing */}
      <group ref={hammer} visible={false}>
        <mesh
          geometry={handle}
          material={wood}
          position={[0, HAMMER_LEN / 2, 0]}
          raycast={none}
        />
        <mesh geometry={head} material={gold} raycast={none} />
      </group>
    </group>
  );
}
