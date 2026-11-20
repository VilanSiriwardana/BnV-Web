import type { HiddenHeartId } from '../engine/hidden-hearts';

// Romance Additions F9: where each hidden heart sits inside its (relative) mount. Tune here.
export const HIDDEN_HEART_PLACEMENTS: Record<HiddenHeartId, string> = {
  hero: '-top-6 -right-8 md:-right-10',
  memories: '-top-5 -right-5',
  // Thread tail (desktop path ends near y 58 %); the static list passes its own className.
  timeline: 'top-[60%] left-1/2 -translate-x-1/2',
  gallery: 'top-1 right-1',
  letter: '-top-4 -right-10',
};

export const HIDDEN_HEART_HINT_SECTIONS =
  'your name, the memories, the end of our thread, the gallery and my signature';

// Which gallery tile (index) carries the heart in its corner.
export const HIDDEN_GALLERY_TILE = 4;
