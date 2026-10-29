import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AdminTable } from '@/components/admin/data-table';
import { FilterBar } from '@/components/admin/filter-bar';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { productStatuses } from '@/constants/statuses';
import { readListParams, type ListSearchParams } from '@/lib/admin/list-params';
import { requirePermission } from '@/lib/auth/guards';
import { prisma } from '@/lib/prisma';
import { formatLkr } from '@/lib/utils/format';

import {
  saveCategory,
  saveCollection,
  saveProduct,
  saveVariant,
} from './actions';
import {
  CategoryForm,
  CollectionForm,
  ProductForm,
  VariantForm,
} from './forms';

type IdParams = Promise<{ id: string }>;

const contains = (q: string) => ({ contains: q, mode: 'insensitive' as const });
const day = (d: Date | null) => d?.toISOString().slice(0, 10) ?? '';
const on = (v: boolean) => (v ? 'on' : '');

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-small text-muted-foreground">
      ← {label}
    </Link>
  );
}

function NewButton({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

async function findOr404<T>(query: Promise<T | null>) {
  const record = await query.catch(() => null);
  if (!record) notFound();
  return record;
}

// Products

export async function ProductListView({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  await requirePermission('products.manage');
  const params = await readListParams(searchParams, productStatuses);
  const where: Prisma.ProductWhereInput = {
    status: params.status,
    OR: params.q
      ? [{ name: contains(params.q) }, { sku: contains(params.q) }]
      : undefined,
  };
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: params.skip,
      take: params.take,
      select: {
        id: true,
        name: true,
        sku: true,
        status: true,
        category: { select: { name: true } },
        variants: {
          select: { price: true, inventory: { select: { quantity: true } } },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Products"
        actions={
          <NewButton href={routes.admin.newProduct} label="New product" />
        }
      />
      <FilterBar
        statuses={productStatuses}
        status={params.status}
        q={params.q}
        searchPlaceholder="Name or SKU"
      />
      <AdminTable
        headers={['SKU', 'Name', 'Category', 'From', 'Stock', 'Status']}
        empty="No products match these filters."
        rows={products.map((p) => {
          const prices = p.variants.map((v) => Number(v.price));
          const stock = p.variants.reduce(
            (sum, v) => sum + (v.inventory?.quantity ?? 0),
            0,
          );
          return {
            key: p.id,
            href: `${routes.admin.products}/${p.id}`,
            cells: [
              p.sku,
              p.name,
              p.category.name,
              prices.length ? formatLkr(Math.min(...prices)) : '—',
              stock,
              <StatusBadge key="s" status={p.status} />,
            ],
          };
        })}
      />
      <Pagination
        page={params.page}
        total={total}
        params={{ status: params.status, q: params.q }}
      />
    </>
  );
}

async function productOptions() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: { status: { not: 'archived' } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true },
    }),
    prisma.brand.findMany({
      where: { status: { not: 'archived' } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);
  const toOption = (r: { id: string; name: string }) => ({
    value: r.id,
    label: r.name,
  });
  return { categories: categories.map(toOption), brands: brands.map(toOption) };
}

export async function ProductNewView() {
  await requirePermission('products.manage');
  const options = await productOptions();
  return (
    <>
      <BackLink href={routes.admin.products} label="Products" />
      <AdminPageHeader title="New product" />
      <ProductForm
        action={saveProduct.bind(null, null)}
        values={{ status: 'draft', brandId: options.brands[0]?.value ?? '' }}
        {...options}
      />
      <p className="text-small text-muted-foreground mt-4">
        Save the product first, then add its variants, prices and stock.
      </p>
    </>
  );
}

export async function ProductEditView({ params }: { params: IdParams }) {
  await requirePermission('products.manage');
  const { id } = await params;
  const [product, options] = await Promise.all([
    findOr404(
      prisma.product.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: {
            orderBy: { createdAt: 'asc' },
            include: { inventory: true },
          },
        },
      }),
    ),
    productOptions(),
  ]);

  return (
    <>
      <BackLink href={routes.admin.products} label="Products" />
      <AdminPageHeader
        title={product.name}
        actions={
          <span className="flex items-center gap-3">
            <StatusBadge status={product.status} />
            {product.status === 'active' && (
              <Link href={routes.product(product.slug)} className="text-small">
                View in shop
              </Link>
            )}
          </span>
        }
      />
      <ProductForm
        action={saveProduct.bind(null, product.id)}
        values={{
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          shortDescription: product.shortDescription ?? '',
          description: product.description ?? '',
          categoryId: product.categoryId,
          brandId: product.brandId,
          status: product.status,
          isFeatured: on(product.isFeatured),
          images: product.images.map((i) => i.imageUrl).join('\n'),
        }}
        {...options}
      />

      <h2 className="font-display text-h3 mt-10 mb-4">Variants and stock</h2>
      <div className="flex flex-col gap-6">
        {product.variants.map((v) => (
          <div key={v.id} className="border-border rounded-md border p-4">
            <VariantForm
              action={saveVariant.bind(null, product.id, v.id)}
              submitLabel="Save variant"
              values={{
                name: v.name,
                sku: v.sku,
                status: v.status,
                price: String(v.price),
                salePrice: v.salePrice == null ? '' : String(v.salePrice),
                quantity: String(v.inventory?.quantity ?? 0),
              }}
            />
          </div>
        ))}
        <div className="border-border rounded-md border border-dashed p-4">
          <h3 className="font-display text-h4 mb-2">Add a variant</h3>
          <VariantForm
            action={saveVariant.bind(null, product.id, null)}
            submitLabel="Add variant"
            values={{ status: 'active', quantity: '0' }}
          />
        </div>
      </div>
    </>
  );
}

// Categories

export async function CategoryListView({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  await requirePermission('catalog.manage');
  const params = await readListParams(searchParams, productStatuses);
  const where: Prisma.CategoryWhereInput = {
    status: params.status,
    name: params.q ? contains(params.q) : undefined,
  };
  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      skip: params.skip,
      take: params.take,
      include: {
        parent: { select: { name: true } },
        _count: { select: { products: true } },
      },
    }),
    prisma.category.count({ where }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Categories"
        actions={
          <NewButton
            href={`${routes.admin.categories}/new`}
            label="New category"
          />
        }
      />
      <FilterBar
        statuses={productStatuses}
        status={params.status}
        q={params.q}
      />
      <AdminTable
        headers={['Order', 'Name', 'Parent', 'Products', 'Status']}
        empty="No categories match these filters."
        rows={categories.map((c) => ({
          key: c.id,
          href: `${routes.admin.categories}/${c.id}`,
          cells: [
            c.sortOrder,
            c.name,
            c.parent?.name ?? '—',
            c._count.products,
            <StatusBadge key="s" status={c.status} />,
          ],
        }))}
      />
      <Pagination
        page={params.page}
        total={total}
        params={{ status: params.status, q: params.q }}
      />
    </>
  );
}

async function parentOptions(excludeId?: string) {
  const categories = await prisma.category.findMany({
    where: { id: excludeId ? { not: excludeId } : undefined, parentId: null },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true },
  });
  return categories.map((c) => ({ value: c.id, label: c.name }));
}

export async function CategoryEditView({ params }: { params: IdParams }) {
  await requirePermission('catalog.manage');
  const { id } = await params;
  const isNew = id === 'new';
  const category = isNew
    ? null
    : await findOr404(prisma.category.findUnique({ where: { id } }));

  return (
    <>
      <BackLink href={routes.admin.categories} label="Categories" />
      <AdminPageHeader title={category?.name ?? 'New category'} />
      <CategoryForm
        action={saveCategory.bind(null, category?.id ?? null)}
        parents={await parentOptions(category?.id)}
        values={
          category
            ? {
                name: category.name,
                slug: category.slug,
                description: category.description ?? '',
                parentId: category.parentId ?? '',
                sortOrder: String(category.sortOrder),
                isFeatured: on(category.isFeatured),
                status: category.status,
                imageUrl: category.imageUrl ?? '',
              }
            : { status: 'active', sortOrder: '0' }
        }
      />
    </>
  );
}

// Collections

export async function CollectionListView({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  await requirePermission('catalog.manage');
  const params = await readListParams(searchParams, productStatuses);
  const where: Prisma.CollectionWhereInput = {
    status: params.status,
    name: params.q ? contains(params.q) : undefined,
  };
  const [collections, total] = await prisma.$transaction([
    prisma.collection.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: params.skip,
      take: params.take,
      include: { _count: { select: { products: true } } },
    }),
    prisma.collection.count({ where }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Collections"
        actions={
          <NewButton
            href={`${routes.admin.collections}/new`}
            label="New collection"
          />
        }
      />
      <FilterBar
        statuses={productStatuses}
        status={params.status}
        q={params.q}
      />
      <AdminTable
        headers={['Runs', 'Name', 'Products', 'Status']}
        empty="No collections match these filters."
        rows={collections.map((c) => ({
          key: c.id,
          href: `${routes.admin.collections}/${c.id}`,
          cells: [
            [day(c.startDate), day(c.endDate)].filter(Boolean).join(' → ') ||
              'Always',
            c.name,
            c._count.products,
            <StatusBadge key="s" status={c.status} />,
          ],
        }))}
      />
      <Pagination
        page={params.page}
        total={total}
        params={{ status: params.status, q: params.q }}
      />
    </>
  );
}

export async function CollectionEditView({ params }: { params: IdParams }) {
  await requirePermission('catalog.manage');
  const { id } = await params;
  const isNew = id === 'new';
  const [collection, products] = await Promise.all([
    isNew
      ? null
      : findOr404(
          prisma.collection.findUnique({
            where: { id },
            include: {
              products: {
                orderBy: { sortOrder: 'asc' },
                select: { productId: true },
              },
            },
          }),
        ),
    prisma.product.findMany({
      where: { status: { not: 'archived' } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, sku: true },
    }),
  ]);

  return (
    <>
      <BackLink href={routes.admin.collections} label="Collections" />
      <AdminPageHeader title={collection?.name ?? 'New collection'} />
      <CollectionForm
        action={saveCollection.bind(null, collection?.id ?? null)}
        products={products.map((p) => ({
          value: p.id,
          label: `${p.name} (${p.sku})`,
        }))}
        selected={collection?.products.map((p) => p.productId) ?? []}
        values={
          collection
            ? {
                name: collection.name,
                slug: collection.slug,
                description: collection.description ?? '',
                status: collection.status,
                bannerImageUrl: collection.bannerImageUrl ?? '',
                startDate: day(collection.startDate),
                endDate: day(collection.endDate),
              }
            : { status: 'active' }
        }
      />
    </>
  );
}
