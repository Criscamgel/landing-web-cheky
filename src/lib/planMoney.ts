import { DEFAULT_PLAN_CURRENCY, resolvePlanCurrencyCode } from '@/lib/planCurrencies.config';

export { DEFAULT_PLAN_CURRENCY, resolvePlanCurrencyCode };

const INTL_LOCALE: Record<string, string> = {
  USD: 'en-US',
  COP: 'es-CO',
  EUR: 'es-ES',
  MXN: 'es-MX',
  GBP: 'en-GB',
  CAD: 'en-CA',
  BRL: 'pt-BR',
  ARS: 'es-AR',
  CLP: 'es-CL',
  PEN: 'es-PE',
};

export function formatMoneyAmount(
  amount: number,
  currency?: string | null,
): string {
  const cur = resolvePlanCurrencyCode(currency);
  const n = Number(amount);
  if (!Number.isFinite(n)) return `— ${cur}`;
  try {
    return new Intl.NumberFormat(INTL_LOCALE[cur] ?? 'en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n.toLocaleString(INTL_LOCALE[cur] ?? 'en-US', {
      maximumFractionDigits: 0,
    })} ${cur}`;
  }
}

export function formatMonthlyPlanPrice(
  monthlyPrice: number,
  currency?: string | null,
): string {
  return `${formatMoneyAmount(monthlyPrice, currency)}/mes`;
}
