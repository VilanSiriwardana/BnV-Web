// Blueprint 071: the arrow strike asks for the gallery; ui/heart-iris.tsx carries her in.
const listeners = new Set<() => void>();
let revealing = false;

export function requestGalleryReveal() {
  if (revealing) return;
  revealing = true;
  listeners.forEach((fn) => fn());
}

export function endGalleryReveal() {
  revealing = false;
}

export function onGalleryReveal(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
