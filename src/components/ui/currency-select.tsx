'use client';

import { Combobox, type ComboboxProps } from '@/components/ui/combobox';
import { flagEmoji } from '@/data/countries';
import { currencies } from '@/data/currencies';

const options = currencies.map((c) => ({
  value: c.code,
  label: `${c.code} · ${c.name}`,
  keywords: [c.name],
  icon: (
    <span aria-hidden className="text-base leading-none">
      {flagEmoji(c.country)}
    </span>
  ),
}));

type Props = Omit<
  Extract<ComboboxProps, { mode?: 'single' }>,
  'options' | 'mode'
>;

export function CurrencySelect({
  placeholder = 'Select currency',
  ...props
}: Props) {
  return (
    <Combobox
      {...props}
      mode="single"
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search currencies…"
    />
  );
}
