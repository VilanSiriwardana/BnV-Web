import {
  ArrowRight,
  Compass,
  Crown,
  Gem,
  Gift,
  Heart,
  LifeBuoy,
  Mail,
  MessageCircle,
  PenLine,
  Shirt,
  ShoppingBag,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react';

// One icon per role so the same idea always reads the same way (DESIGN.md "Icons").
export const icons = {
  shop: ShoppingBag,
  gift: Gift,
  arrow: ArrowRight,
  new: Sparkles,
  limited: Crown,
  mail: Mail,
  contact: MessageCircle,
  explore: Compass,
  help: LifeBuoy,
  women: Shirt,
  men: User,
  jewelry: Gem,
  gifts: Gift,
  couples: Heart,
  custom: PenLine,
} satisfies Record<string, LucideIcon>;

export type IconRole = keyof typeof icons;
