// Real, permissioned testimonials only (D-23). The homepage section is skipped while empty.
export type Testimonial = {
  name: string;
  quote: string;
  context?: string;
};

export const testimonials: Testimonial[] = [];
