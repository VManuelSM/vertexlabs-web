export type PackageId = 'presence' | 'landing' | 'site' | 'catalog' | 'ecommerce' | 'maintenance';

/** Precio en MXN. `to` marca un rango; `period`, un cobro recurrente. */
export interface Price {
  readonly from: number;
  readonly to?: number;
  readonly period?: 'mes';
}

export interface WebPackage {
  readonly id: PackageId;
  readonly name: string;
  /** "Para quién" (doc 23 §4, Sec 4). */
  readonly audience: string;
  readonly price: Price;
  readonly features: readonly string[];
  readonly delivery: string;
  readonly recurring?: boolean;
  readonly featured?: boolean;
  readonly cta: { readonly label: string; readonly message: string };
}

const mxn = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

export const formatMxn = (amount: number): string => mxn.format(amount);

/** Parte que acompaña al precio base: " – $35,000", " – $900 / mes" o "". */
export function priceSuffix(price: Price): string {
  const range = price.to === undefined ? '' : ` – ${formatMxn(price.to)}`;
  const period = price.period ? ` / ${price.period}` : '';
  return range + period;
}

/** Precio completo en una línea: "$28,000 – $35,000", "$350 – $900 / mes". */
export const formatPrice = (price: Price): string => formatMxn(price.from) + priceSuffix(price);
