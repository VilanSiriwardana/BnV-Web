'use client';

import Script from 'next/script';

import { useConsent } from './use-consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// GA4 loads only after "Accept analytics" (UX-Spec §7, PDPA).
export function Analytics() {
  const consent = useConsent();
  if (!GA_ID || consent !== 'analytics') return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
