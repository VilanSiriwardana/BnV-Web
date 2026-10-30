'use client';

import { useActionState, useState } from 'react';

import {
  DateField,
  FormShell,
  SelectField,
  TextareaField,
  TextField,
  type Option,
} from '@/components/forms/form-kit';
import { ImageUploader } from '@/components/forms/image-uploader';
import { Input } from '@/components/ui/input';
import { productStatuses } from '@/constants/statuses';
import type { FormState } from '@/lib/forms/types';
import { formatStatus } from '@/lib/utils/format';

import {
  categorySchema,
  collectionSchema,
  productSchema,
  variantSchema,
} from './schema';

const SIGN_URL = '/api/admin/uploads/sign';

export const statusOptions: Option[] = productStatuses.map((s) => ({
  value: s,
  label: formatStatus(s),
}));

type Values = Record<string, string>;
type State = FormState<string>;
type Action = (prev: State, formData: FormData) => Promise<State>;

function useSaveForm(action: Action, values: Values) {
  const initial: State = { status: 'idle', values };
  return useActionState(action, initial);
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="text-small flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="checkbox-native"
      />
      {label}
    </label>
  );
}

const lines = (v?: string) => (v ? v.split('\n').filter(Boolean) : []);

export function CategoryForm({
  action,
  values,
  parents,
}: {
  action: Action;
  values: Values;
  parents: Option[];
}) {
  const [state, formAction, pending] = useSaveForm(action, values);
  const f = categorySchema.shape;
  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel="Save category"
      pendingLabel="Saving…"
    >
      <TextField
        placeholder="Shown on the storefront"
        name="name"
        label="Name"
        schema={f.name}
        required
      />
      <TextField
        name="slug"
        label="Slug"
        schema={f.slug}
        hint="Leave empty to build it from the name."
      />
      <TextareaField
        placeholder="A few sentences shoppers will read"
        name="description"
        label="Description"
        schema={f.description}
        rows={3}
      />
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <SelectField
          name="parentId"
          label="Parent"
          schema={f.parentId}
          options={parents}
          placeholder="None (top level)"
        />
        <TextField
          placeholder="0"
          hint="Lower numbers appear first"
          name="sortOrder"
          label="Sort order"
          schema={f.sortOrder}
          type="number"
        />
        <SelectField
          placeholder="Choose a status"
          name="status"
          label="Status"
          schema={f.status}
          options={statusOptions}
          required
        />
      </div>
      <Checkbox
        name="isFeatured"
        label="Featured"
        defaultChecked={values.isFeatured === 'on'}
      />
      <ImageUploader
        name="imageUrl"
        label="Image"
        signUrl={SIGN_URL}
        initial={lines(state.values?.imageUrl ?? values.imageUrl)}
        max={1}
        error={state.fieldErrors?.imageUrl}
      />
    </FormShell>
  );
}

export function CollectionForm({
  action,
  values,
  products,
  selected,
}: {
  action: Action;
  values: Values;
  products: Option[];
  selected: string[];
}) {
  const [state, formAction, pending] = useSaveForm(action, values);
  const [filter, setFilter] = useState('');
  const f = collectionSchema.shape;
  const chosen = new Set(selected);
  const needle = filter.trim().toLowerCase();
  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel="Save collection"
      pendingLabel="Saving…"
    >
      <TextField
        placeholder="Shown on the storefront"
        name="name"
        label="Name"
        schema={f.name}
        required
      />
      <TextField
        name="slug"
        label="Slug"
        schema={f.slug}
        hint="Leave empty to build it from the name."
      />
      <TextareaField
        placeholder="A few sentences shoppers will read"
        name="description"
        label="Description"
        schema={f.description}
        rows={3}
      />
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <SelectField
          placeholder="Choose a status"
          name="status"
          label="Status"
          schema={f.status}
          options={statusOptions}
          required
        />
        <DateField
          placeholder="Pick a start date"
          name="startDate"
          label="Starts"
          schema={f.startDate}
        />
        <DateField
          placeholder="Pick an end date"
          name="endDate"
          label="Ends"
          schema={f.endDate}
        />
      </div>
      <ImageUploader
        name="bannerImageUrl"
        label="Banner image"
        signUrl={SIGN_URL}
        initial={lines(values.bannerImageUrl)}
        max={1}
        error={state.fieldErrors?.bannerImageUrl}
      />
      <fieldset className="mt-2">
        <legend className="text-small mb-1 font-medium">Products</legend>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter products"
          className="mb-2 sm:w-64"
        />
        <div className="border-border grid max-h-72 gap-1 overflow-y-auto rounded-sm border p-2 sm:grid-cols-2">
          {products.map((p) => (
            <label
              key={p.value}
              className="text-small flex items-center gap-2"
              hidden={
                Boolean(needle) && !p.label.toLowerCase().includes(needle)
              }
            >
              <input
                type="checkbox"
                name="productIds"
                value={p.value}
                defaultChecked={chosen.has(p.value)}
                className="checkbox-native"
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>
    </FormShell>
  );
}

export function ProductForm({
  action,
  values,
  categories,
  brands,
}: {
  action: Action;
  values: Values;
  categories: Option[];
  brands: Option[];
}) {
  const [state, formAction, pending] = useSaveForm(action, values);
  const f = productSchema.shape;
  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel="Save product"
      pendingLabel="Saving…"
    >
      <TextField
        placeholder="Shown on the storefront"
        name="name"
        label="Name"
        schema={f.name}
        required
      />
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextField
          name="slug"
          label="Slug"
          schema={f.slug}
          hint="Leave empty to build it from the name."
        />
        <TextField
          placeholder="e.g. BNV-NCK-001"
          name="sku"
          label="Product SKU"
          schema={f.sku}
          required
        />
      </div>
      <TextareaField
        placeholder="One line for product cards"
        name="shortDescription"
        label="Short description"
        schema={f.shortDescription}
        rows={2}
      />
      <TextareaField
        placeholder="A few sentences shoppers will read"
        name="description"
        label="Description"
        schema={f.description}
        rows={6}
      />
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <SelectField
          placeholder="Choose a category"
          name="categoryId"
          label="Category"
          schema={f.categoryId}
          options={categories}
          required
        />
        <SelectField
          placeholder="Choose a brand"
          name="brandId"
          label="Brand"
          schema={f.brandId}
          options={brands}
          required
        />
        <SelectField
          placeholder="Choose a status"
          name="status"
          label="Status"
          schema={f.status}
          options={statusOptions}
          required
        />
      </div>
      <Checkbox
        name="isFeatured"
        label="Featured"
        defaultChecked={values.isFeatured === 'on'}
      />
      <ImageUploader
        name="images"
        label="Images"
        hint="The first image is the main one."
        signUrl={SIGN_URL}
        initial={lines(values.images)}
        max={12}
        error={state.fieldErrors?.images}
      />
    </FormShell>
  );
}

export function VariantForm({
  action,
  values,
  submitLabel,
}: {
  action: Action;
  values: Values;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useSaveForm(action, values);
  const f = variantSchema.shape;
  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel={submitLabel}
      pendingLabel="Saving…"
    >
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <TextField
          placeholder="e.g. Rose gold / Small"
          name="name"
          label="Variant name"
          schema={f.name}
          required
        />
        <TextField
          placeholder="e.g. BNV-NCK-001"
          name="sku"
          label="SKU"
          schema={f.sku}
          required
        />
        <SelectField
          placeholder="Choose a status"
          name="status"
          label="Status"
          schema={f.status}
          options={statusOptions}
          required
        />
        <TextField
          placeholder="e.g. 4500"
          name="price"
          label="Price (LKR)"
          schema={f.price}
          type="number"
          required
        />
        <TextField
          placeholder="Leave empty if not on sale"
          name="salePrice"
          label="Sale price (LKR)"
          schema={f.salePrice}
          type="number"
        />
        <TextField
          placeholder="e.g. 10"
          name="quantity"
          label="In stock"
          schema={f.quantity}
          type="number"
          required
        />
      </div>
    </FormShell>
  );
}
