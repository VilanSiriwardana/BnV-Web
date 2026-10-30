import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { SectionHeading } from '@/components/marketing/section-heading';
import { ProductAccordions } from '@/components/product/product-accordions';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductGrid } from '@/components/product/product-grid';
import {
  VariantSelector,
  type SelectableVariant,
} from '@/components/product/variant-selector';
import { whatsappUrl } from '@/config/brand';
import { routes } from '@/config/routes';
import { sizeGuides } from '@/data/size-guides';
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from '@/features/catalog/queries';
import {
  availableQuantity,
  isLowStock,
  optionAxisLabels,
  parseVariantOptions,
} from '@/features/catalog/variants';
import { JsonLd, breadcrumbJsonLd, productJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProductSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: routes.product(slug),
    image: product.images[0]?.imageUrl,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.variants.length === 0) notFound();

  const related = await getRelatedProducts(product);
  const pillar = product.category.parent ?? product.category;
  const path = routes.product(slug);

  const variants: SelectableVariant[] = product.variants.map((v) => ({
    id: v.id,
    options: parseVariantOptions(v.name),
    priceLkr: Number(v.price),
    salePriceLkr: v.salePrice === null ? null : Number(v.salePrice),
    available: availableQuantity(v),
    lowStock: isLowStock(v),
  }));
  const axisCount = Math.max(...variants.map((v) => v.options.length));
  const axes = optionAxisLabels(
    product.category.slug,
    product.category.parent?.slug ?? null,
    axisCount,
  );
  const inStock = variants.some((v) => v.available > 0);
  const lowestPrice = Math.min(
    ...variants.map((v) => v.salePriceLkr ?? v.priceLkr),
  );

  const crumbs = [
    { name: 'Home', path: routes.home },
    { name: pillar.name, path: `/${pillar.slug}` },
    ...(product.category.parent
      ? [
          {
            name: product.category.name,
            path: `/${pillar.slug}/${product.category.slug.slice(pillar.slug.length + 1)}`,
          },
        ]
      : []),
    { name: product.name, path },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <JsonLd
        data={productJsonLd({
          name: product.name,
          path,
          sku: product.sku,
          description: product.shortDescription,
          images: product.images.map((image) => image.imageUrl),
          brandName: product.brand.name,
          priceLkr: lowestPrice,
          inStock,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="font-display text-h1 font-semibold">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="text-body-lg text-muted-foreground mt-3">
                {product.shortDescription}
              </p>
            )}
            <p className="text-small text-muted-foreground mt-2">
              SKU {product.sku}
            </p>
          </header>
          <VariantSelector
            axes={axes}
            variants={variants}
            whatsappHref={whatsappUrl(
              `Hi B&V, I'm interested in ${product.name} (${product.sku}).`,
            )}
            contactHref={routes.contact}
          />
          <ProductAccordions
            description={product.description}
            sizeGuide={sizeGuides[pillar.slug]}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16 md:mt-24">
          <SectionHeading
            id="related-title"
            title="You may also love"
            className="mb-8"
          />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
