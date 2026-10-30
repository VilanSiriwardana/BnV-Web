'use client';

import { Minus, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';

import { useCart } from '@/components/cart/cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/field-error';
import { commerce } from '@/config/commerce';
import { addToCart } from '@/features/cart/actions';
import { cn, formatLkr } from '@/lib/utils';

export type SelectableVariant = {
  id: string;
  options: string[];
  priceLkr: number;
  salePriceLkr: number | null;
  available: number;
  lowStock: boolean;
};

type Props = {
  axes: string[];
  variants: SelectableVariant[];
  whatsappHref: string | null;
  contactHref: string;
};

const matches = (v: SelectableVariant, options: string[]) =>
  v.options.every((o, i) => o === options[i]);

export function VariantSelector({
  axes,
  variants,
  whatsappHref,
  contactHref,
}: Props) {
  const initial = variants.find((v) => v.available > 0) ?? variants[0];
  const [selected, setSelected] = useState<string[]>(initial?.options ?? []);
  const [quantity, setQuantity] = useState(1);
  const [adding, startAdding] = useTransition();
  const [addError, setAddError] = useState<string>();
  const { setCart, setOpen } = useCart();

  const variant = variants.find((v) => matches(v, selected));
  const soldOut = variants.every((v) => v.available === 0);
  const maxQty = Math.max(
    1,
    Math.min(commerce.maxLineQuantity, variant?.available ?? 1),
  );

  const choose = (axis: number, value: string) => {
    const next = selected.with(axis, value);
    const match =
      variants.find((v) => matches(v, next)) ??
      variants.find((v) => v.options[axis] === value && v.available > 0) ??
      variants.find((v) => v.options[axis] === value);
    setSelected(match?.options ?? next);
    setQuantity(1);
  };

  const payload = variant && {
    variantId: variant.id,
    quantity,
    selectedOptions: Object.fromEntries(
      axes.map((axis, i) => [axis, variant.options[i]]),
    ),
  };

  return (
    <div className="flex flex-col gap-6">
      {variant && (
        <p className="text-h3 font-sans font-semibold tabular-nums">
          {variant.salePriceLkr !== null ? (
            <>
              {formatLkr(variant.salePriceLkr)}{' '}
              <s className="text-muted-foreground text-body font-normal">
                {formatLkr(variant.priceLkr)}
              </s>
            </>
          ) : (
            formatLkr(variant.priceLkr)
          )}
        </p>
      )}

      {variants.length > 1 &&
        axes.map((axis, axisIndex) => {
          const values = [
            ...new Set(variants.map((v) => v.options[axisIndex])),
          ];
          return (
            <fieldset key={axis}>
              <legend className="text-label font-semibold">
                {axis}:{' '}
                <span className="font-normal">{selected[axisIndex]}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {values.map((value) => {
                  const candidate = variants.find((v) =>
                    matches(v, selected.with(axisIndex, value)),
                  );
                  const unavailable = !candidate || candidate.available === 0;
                  const isSelected = selected[axisIndex] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={unavailable ? `${value}, sold out` : value}
                      onClick={() => choose(axisIndex, value)}
                      className={cn(
                        buttonVariants({
                          variant: isSelected ? 'default' : 'outline',
                          size: 'sm',
                        }),
                        'min-w-12',
                        unavailable && 'text-muted-foreground line-through',
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

      <div aria-live="polite" className="min-h-6">
        {soldOut ? (
          <Badge variant="destructive">Sold out</Badge>
        ) : variant?.available === 0 ? (
          <p className="text-label text-destructive-text">
            Sold out in this option
          </p>
        ) : variant?.lowStock ? (
          <p className="text-label text-primary-text font-semibold">
            Only a few left
          </p>
        ) : null}
      </div>

      {!soldOut && (
        <div className="flex items-center gap-3">
          <span className="text-label font-semibold">Quantity</span>
          <div className="border-input flex items-center rounded-sm border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus />
            </Button>
            <span className="w-10 text-center tabular-nums">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Increase quantity"
              disabled={quantity >= maxQty}
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            >
              <Plus />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {!soldOut && (
          <Button
            type="button"
            size="lg"
            disabled={!payload || variant.available === 0 || adding}
            onClick={() =>
              payload &&
              startAdding(async () => {
                const result = await addToCart(payload);
                setAddError(result.ok ? undefined : result.message);
                if (result.ok) {
                  setCart(result.cart);
                  setOpen(true);
                  setQuantity(1);
                }
              })
            }
            className="sm:flex-1"
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </Button>
        )}
        <a
          href={whatsappHref ?? contactHref}
          {...(whatsappHref && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          className={cn(
            buttonVariants({
              variant: whatsappHref
                ? 'whatsapp'
                : soldOut
                  ? 'default'
                  : 'secondary',
              size: 'lg',
            }),
            'sm:flex-1',
          )}
        >
          {whatsappHref ? 'Ask on WhatsApp' : 'Ask us about this piece'}
        </a>
      </div>
      {addError && <FormMessage status="error" message={addError} />}
    </div>
  );
}
