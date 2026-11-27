import {
  Camera,
  Images,
  type LucideIcon,
  PenLine,
  Spline,
  UserRound,
} from 'lucide-react';

import type { HiddenHeartId } from '../engine/hidden-hearts';

// Blueprint 085: one clue list for the hunt intro dialog and the vault hint chips.
export const HIDDEN_HEART_CLUES: Record<
  HiddenHeartId,
  { icon: LucideIcon; text: string }
> = {
  hero: { icon: UserRound, text: 'Near your name' },
  memories: { icon: Images, text: 'The memories title' },
  timeline: { icon: Spline, text: 'The end of our thread' },
  gallery: { icon: Camera, text: 'One gallery photo' },
  letter: { icon: PenLine, text: 'My signature' },
};
