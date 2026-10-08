import { formatMxn, formatPrice, priceSuffix } from './web-package';

describe('Precios de paquetes (doc 23 §4, Sec 4)', () => {
  it('formatea pesos sin decimales', () => {
    expect(formatMxn(5900)).toBe('$5,900');
    expect(formatMxn(21125)).toBe('$21,125');
  });

  it('un precio fijo no lleva sufijo', () => {
    expect(priceSuffix({ from: 16900 })).toBe('');
    expect(formatPrice({ from: 16900 })).toBe('$16,900');
  });

  it('un rango muestra ambos extremos', () => {
    expect(priceSuffix({ from: 28000, to: 35000 })).toBe(' – $35,000');
    expect(formatPrice({ from: 28000, to: 35000 })).toBe('$28,000 – $35,000');
  });

  it('un cobro recurrente indica el periodo', () => {
    expect(formatPrice({ from: 350, to: 900, period: 'mes' })).toBe('$350 – $900 / mes');
  });
});
