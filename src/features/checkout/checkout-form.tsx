'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { FieldError, FormMessage } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { routes } from '@/config/routes';
import {
  districts,
  provinceForDistrict,
  type District,
} from '@/data/sri-lanka-districts';
import { useFormValidation, useInput } from '@/lib/forms/use-input';
import { cn } from '@/lib/utils';

import { placeOrder } from './actions';
import {
  checkoutSchema,
  type CheckoutField,
  type CheckoutState,
} from './schema';

const initialState: CheckoutState = { status: 'idle' };
const shape = checkoutSchema.shape;

const paymentOptions = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    hint: 'We will call or WhatsApp you to confirm before dispatch.',
  },
  {
    value: 'bank_transfer',
    label: 'Bank transfer',
    hint: 'We will send our bank details on WhatsApp after you place the order.',
  },
] as const;

const selectClass =
  'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive h-11 w-full rounded-md border px-3 text-base outline-none focus-visible:ring-[3px] md:text-sm';
const textareaClass = cn(selectClass, 'h-auto min-h-20 py-2');
const labelClass = 'text-small mb-1 block font-medium';

type TextInput = ReturnType<typeof useInput<HTMLInputElement>>;

function TextField({
  input,
  label,
  optional,
  ...props
}: {
  input: TextInput;
  label: string;
  optional?: boolean;
} & React.ComponentProps<'input'>) {
  return (
    <div>
      <label htmlFor={input.bind.id} className={labelClass}>
        {label}
        {optional && <span className="text-muted-foreground"> (optional)</span>}
      </label>
      <Input {...input.bind} {...props} />
      <FieldError id={input.errorId} message={input.error} />
    </div>
  );
}

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  const name = useInput({
    id: 'checkout-name',
    name: 'name',
    schema: shape.name,
  });
  const phone = useInput({
    id: 'checkout-phone',
    name: 'phone',
    schema: shape.phone,
  });
  const email = useInput({
    id: 'checkout-email',
    name: 'email',
    schema: shape.email,
  });
  const address1 = useInput({
    id: 'checkout-address1',
    name: 'addressLine1',
    schema: shape.addressLine1,
  });
  const address2 = useInput({
    id: 'checkout-address2',
    name: 'addressLine2',
    schema: shape.addressLine2,
  });
  const city = useInput({
    id: 'checkout-city',
    name: 'city',
    schema: shape.city,
  });
  const postalCode = useInput({
    id: 'checkout-postal',
    name: 'postalCode',
    schema: shape.postalCode,
  });
  const consent = useInput({
    id: 'checkout-consent',
    name: 'consent',
    schema: shape.consent,
    type: 'checkbox',
  });
  const textInputs = [name, phone, email, address1, address2, city, postalCode];
  const onSubmit = useFormValidation([...textInputs, consent]);

  // Controlled so React's post-action form reset does not clear them on a server error.
  const [district, setDistrict] = useState('');
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [hidePrices, setHidePrices] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [marketing, setMarketing] = useState(false);

  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined;
  const errorFor = (field: CheckoutField) => fieldErrors?.[field];

  useEffect(() => {
    if (!fieldErrors) return;
    for (const input of [...textInputs, consent]) {
      input.setServerError(fieldErrors[input.bind.name as CheckoutField]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const province = districts.includes(district as District)
    ? provinceForDistrict(district as District)
    : '';

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-10"
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="font-display text-h4 mb-4">Contact</legend>
        <TextField
          placeholder="e.g. Dilini Perera"
          input={name}
          label="Full name"
          autoComplete="name"
        />
        <TextField
          input={phone}
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="077 123 4567"
        />
        <TextField
          placeholder="you@example.com"
          input={email}
          label="Email"
          type="email"
          autoComplete="email"
        />
        <div>
          <span className={labelClass}>How should we contact you?</span>
          <RadioGroup
            name="preferredContact"
            value={preferredContact}
            onValueChange={(v) =>
              setPreferredContact(v as typeof preferredContact)
            }
            aria-label="How should we contact you?"
            className="grid-cols-2"
          >
            <RadioGroupItem value="whatsapp">WhatsApp</RadioGroupItem>
            <RadioGroupItem value="phone">Phone call</RadioGroupItem>
          </RadioGroup>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-display text-h4 mb-4">Delivery</legend>
        <TextField
          placeholder="No. 12, Ward Place"
          input={address1}
          label="Address line 1"
          autoComplete="address-line1"
        />
        <TextField
          placeholder="Apartment, floor or landmark"
          input={address2}
          label="Address line 2"
          optional
          autoComplete="address-line2"
        />
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <div>
            <label htmlFor="checkout-district" className={labelClass}>
              District
            </label>
            <Combobox
              id="checkout-district"
              name="district"
              value={district || null}
              onValueChange={(v) => setDistrict(v ?? '')}
              placeholder="Choose a district"
              searchPlaceholder="Search districts…"
              aria-invalid={errorFor('district') ? true : undefined}
              aria-describedby="checkout-district-error"
              options={districts.map((d) => ({ value: d, label: d }))}
            />
            <FieldError
              id="checkout-district-error"
              message={errorFor('district')}
            />
          </div>
          <div>
            <label htmlFor="checkout-province" className={labelClass}>
              Province
            </label>
            <Input
              id="checkout-province"
              value={province}
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <TextField
            placeholder="e.g. Colombo 07"
            input={city}
            label="City / town"
            autoComplete="address-level2"
          />
          <TextField
            placeholder="e.g. 00700"
            input={postalCode}
            label="Postal code"
            optional
            autoComplete="postal-code"
            inputMode="numeric"
          />
        </div>
        <div>
          <label htmlFor="checkout-notes" className={labelClass}>
            Delivery notes{' '}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="checkout-notes"
            name="deliveryNotes"
            maxLength={300}
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            placeholder="Landmarks or a good time to deliver"
            className={textareaClass}
          />
          <FieldError
            id="checkout-notes-error"
            message={errorFor('deliveryNotes')}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-display text-h4 mb-4">Gift</legend>
        <label className="text-small flex cursor-pointer items-center gap-2">
          <Checkbox
            name="isGift"
            checked={isGift}
            onCheckedChange={(v) => setIsGift(v === true)}
          />
          This is a gift
        </label>
        {isGift && (
          <div className="flex flex-col gap-3 pl-6">
            <label className="text-small flex cursor-pointer items-center gap-2">
              <Checkbox
                name="giftWrap"
                checked={giftWrap}
                onCheckedChange={(v) => setGiftWrap(v === true)}
              />
              Gift wrap
            </label>
            <label className="text-small flex cursor-pointer items-center gap-2">
              <Checkbox
                name="hidePrices"
                checked={hidePrices}
                onCheckedChange={(v) => setHidePrices(v === true)}
              />
              Hide prices in the package
            </label>
            <div>
              <label htmlFor="checkout-gift-message" className={labelClass}>
                Gift message{' '}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="checkout-gift-message"
                name="giftMessage"
                maxLength={200}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className={textareaClass}
              />
              <FieldError
                id="checkout-gift-error"
                message={errorFor('giftMessage')}
              />
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-display text-h4 mb-4">Payment</legend>
        <RadioGroup
          name="paymentMethod"
          value={paymentMethod}
          onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
          aria-label="Payment method"
        >
          {paymentOptions.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              description={option.hint}
              className="p-4"
            >
              {option.label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
        <FieldError
          id="checkout-payment-error"
          message={errorFor('paymentMethod')}
        />
      </fieldset>

      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <input {...consent.bind} className="checkbox-native mt-0.5" />
          <label htmlFor="checkout-consent" className="text-small">
            I agree to the{' '}
            <Link
              href={routes.policy('terms')}
              className="text-primary-text underline underline-offset-4"
            >
              terms
            </Link>{' '}
            and{' '}
            <Link
              href={routes.policy('privacy')}
              className="text-primary-text underline underline-offset-4"
            >
              privacy policy
            </Link>
            .
          </label>
        </div>
        <FieldError id={consent.errorId} message={consent.error} />
        <label className="text-small text-muted-foreground flex cursor-pointer items-start gap-2">
          <Checkbox
            name="marketing"
            checked={marketing}
            onCheckedChange={(v) => setMarketing(v === true)}
          />
          Send me new drops and offers
        </label>
      </div>

      <div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? 'Placing your order…' : 'Place order'}
        </Button>
        <FormMessage status={state.status} message={state.message} />
      </div>
    </form>
  );
}
