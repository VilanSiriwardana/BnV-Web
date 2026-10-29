import { CategoryCard } from '@/components/marketing/category-card';
import { SectionHeading } from '@/components/marketing/section-heading';
import { featuredCategories } from '@/data/home';

export function FeaturedCategories() {
  return (
    <section
      aria-labelledby="featured-categories-title"
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16"
    >
      <SectionHeading
        id="featured-categories-title"
        eyebrow="Explore"
        title="Something for every moment"
      />
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {featuredCategories.map((category) => (
          <li key={category.href}>
            <CategoryCard {...category} />
          </li>
        ))}
      </ul>
    </section>
  );
}
