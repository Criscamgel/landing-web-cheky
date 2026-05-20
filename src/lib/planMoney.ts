export const DEFAULT_PLAN_CURRENCY = 'USD';

export function normalizePlanCurrency(currency?: string | null): string {
  const t = (currency ?? '').trim().toUpperCase();
  return t.length >= 3 ? t : DEFAULT_PLAN_CURRENCY;
}

export function formatMoneyAmount(
  amount: number,
  currency?: string | null,
): string {
  const cur = normalizePlanCurrency(currency);
  const n = Number(amount);
  if (!Number.isFinite(n)) return `— ${cur}`;
  if (cur === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  }
  return `$${n.toLocaleString('es-CO', { maximumFractionDigits: 0 })} ${cur}`;
}

export function formatMonthlyPlanPrice(
  monthlyPrice: number,
  currency?: string | null,
): string {
  return `${formatMoneyAmount(monthlyPrice, currency)}/mes`;
}
