export type Consent = 'analytics' | 'essential';

export const CONSENT_KEY = 'bnv-consent';
export const CONSENT_EVENT = 'bnv-consent-change';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw) as { value: Consent; at: number };
    return Date.now() - at < MAX_AGE_MS ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent | null) {
  try {
    if (value) {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ value, at: Date.now() }),
      );
    } else {
      localStorage.removeItem(CONSENT_KEY);
    }
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
