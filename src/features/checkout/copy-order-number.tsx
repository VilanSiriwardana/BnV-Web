'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function CopyOrderNumber({ orderNumber }: { orderNumber: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-h3 font-semibold tracking-wide tabular-nums select-all">
        {orderNumber}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={copy}
        aria-label={copied ? 'Order number copied' : 'Copy order number'}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}
