import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { CategoryCard } from '@/components/marketing/category-card';
import { SectionHeading } from '@/components/marketing/section-heading';
import { featuredCategories } from '@/data/home';

export function FeaturedCategories() {
  return (
    <section
      aria-labelledby="featured-categories-title"
      className="section-y mx-auto max-w-[1440px] px-4 md:px-8"
    >
      <SectionHeading
        id="featured-categories-title"

        title="Shop by Collection"
        align="center"
        description="Curated pieces and gifts for every chapter of your story."
      />
      <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {featuredCategories.map((category) => (
          <StaggerItem key={category.href}>
            <CategoryCard {...category} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
