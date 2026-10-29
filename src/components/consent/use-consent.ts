'use client';

import { useSyncExternalStore } from 'react';

import { CONSENT_EVENT, readConsent } from '@/lib/consent';

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

// `undefined` on the server so nothing consent-dependent renders before hydration.
export function useConsent() {
  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}
