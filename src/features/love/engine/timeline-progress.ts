// Experience §9: 0–10 % intro, 10–90 % thread, 90–100 % outro; nodes at 10/30/50/70/90 % of the path.
export const NODE_FRACTIONS = [0.1, 0.3, 0.5, 0.7, 0.9] as const;
export const INTRO = 0.1;
export const OUTRO = 0.9;

export function threadProgress(sectionProgress: number) {
  return Math.min(1, Math.max(0, (sectionProgress - INTRO) / (OUTRO - INTRO)));
}

// Section progress at which the thread reaches node i (for click-to-scroll).
export function nodeSectionProgress(i: number) {
  return INTRO + NODE_FRACTIONS[i] * (OUTRO - INTRO);
}

// Index of the last node the thread tip has passed, or -1 before the first.
export function activeNode(
  thread: number,
  count: number = NODE_FRACTIONS.length,
) {
  let active = -1;
  for (let i = 0; i < Math.min(count, NODE_FRACTIONS.length); i++) {
    if (thread >= NODE_FRACTIONS[i]) active = i;
  }
  return active;
}

// The arrow strikes just after the heart leaves the last node (the birthdate).
export const LAST_NODE = NODE_FRACTIONS[NODE_FRACTIONS.length - 1];
export const ARROW_AFTER = 0.04;

export function pastLastNode(thread: number) {
  return thread >= LAST_NODE + ARROW_AFTER;
}
