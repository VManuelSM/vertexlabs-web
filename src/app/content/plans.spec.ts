import { formatMXN, PLANS, planById, priceLine, priceView, startingPrice, withIva } from './plans';

describe('planes y precios', () => {
  it('formatea en pesos mexicanos sin decimales', () => {
    expect(formatMXN(5900)).toBe('$5,900');
    expect(formatMXN(16900)).toBe('$16,900');
  });

  it('calcula el total con IVA del prototipo', () => {
    expect(withIva(5900)).toBe(6844);
    expect(withIva(16900)).toBe(19604);
  });

  it('arma el precio de cada tarjeta', () => {
    expect(priceView(planById('empezar'))).toEqual({
      label: 'Desde',
      amount: '$5,900',
      tax: '+ IVA',
      total: '$6,844 con IVA',
    });
    expect(priceView(planById('medida'))).toEqual({
      label: 'Precio',
      amount: 'Lo cotizamos juntos',
      tax: null,
      total: 'Según el alcance de tu proyecto',
    });
  });

  it('arma la línea de precio del resultado del diagnóstico', () => {
    expect(priceLine(planById('crecer'))).toEqual({
      main: 'Desde $16,900 + IVA',
      note: '$19,604 con IVA',
    });
    expect(priceLine(planById('medida'))).toEqual({
      main: 'Lo cotizamos juntos',
      note: 'según el alcance de tu proyecto',
    });
  });

  it('toma el precio de entrada del plan más barato', () => {
    expect(startingPrice()).toBe('Desde $5,900 + IVA');
  });

  it('tiene los tres planes en orden', () => {
    expect(PLANS.map((p) => p.name)).toEqual(['Para empezar', 'Para crecer', 'A la medida']);
  });
});
