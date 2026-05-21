/** Alineado con backend `plan-currencies.catalog.ts`. */
export const PLAN_CURRENCY_CODES = [
  'USD',
  'COP',
  'EUR',
  'MXN',
  'GBP',
  'CAD',
  'BRL',
  'ARS',
  'CLP',
  'PEN',
] as const;

export const DEFAULT_PLAN_CURRENCY = 'USD';

export function resolvePlanCurrencyCode(raw?: string | null): string {
  const t = (raw ?? '').trim().toUpperCase();
  return (PLAN_CURRENCY_CODES as readonly string[]).includes(t)
    ? t
    : DEFAULT_PLAN_CURRENCY;
}
