'use client';

import { Combobox, type ComboboxProps } from '@/components/ui/combobox';
import { countries, flagEmoji } from '@/data/countries';

const options = countries.map((c) => ({
  value: c.code,
  label: c.name,
  keywords: [c.code],
  icon: (
    <span aria-hidden className="text-base leading-none">
      {flagEmoji(c.code)}
    </span>
  ),
}));

type Props = Omit<
  Extract<ComboboxProps, { mode?: 'single' }>,
  'options' | 'mode'
>;

export function CountrySelect({
  placeholder = 'Select country',
  ...props
}: Props) {
  return (
    <Combobox
      {...props}
      mode="single"
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search countries…"
    />
  );
}
