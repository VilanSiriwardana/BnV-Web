import { Banknote, MessageCircle, Truck } from 'lucide-react';

import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { trust } from '@/data/home';

const icons = {
  banknote: Banknote,
  'message-circle': MessageCircle,
  truck: Truck,
};

export function TrustStrip() {
  return (
    <section aria-label="How ordering works" className="bg-primary-soft">
      <Stagger className="mx-auto grid max-w-[1440px] gap-6 px-4 py-8 font-sans md:grid-cols-3 md:gap-8 md:px-8">
        {trust.map(({ icon, title, text }) => {
          const Icon = icons[icon];
          return (
            <StaggerItem key={title} className="flex items-start gap-3">
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className="text-icon mt-0.5 size-6 shrink-0"
              />
              <div>
                <p className="text-small font-semibold">{title}</p>
                <p className="text-small text-muted-foreground mt-0.5">
                  {text}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
