import { diagnosticMessage, recommend } from './recommendation';

describe('Diagnóstico — regla de recomendación (doc 23 §3.2)', () => {
  it('"Ordenar mi operación" lleva a un proyecto a la medida, tenga o no página', () => {
    for (const website of ['none', 'underperforming', 'improve'] as const) {
      expect(recommend({ goal: 'organize', website }).id).toBe('custom');
    }
    expect(recommend({ goal: 'organize', website: 'none' }).price).toBe(
      'cotización tras evaluación',
    );
  });

  it('"Vender en línea" lleva al E-commerce con pasarela', () => {
    const result = recommend({ goal: 'sell-online', website: 'none' });
    expect(result.id).toBe('ecommerce');
    expect(result.name).toBe('E-commerce con pasarela');
    expect(result.price).toBe('$28,000 – $35,000 MXN');
  });

  it('"Que me encuentren" sin página lleva a Presencia PyME (el paquete de entrada)', () => {
    const result = recommend({ goal: 'be-found', website: 'none' });
    expect(result.id).toBe('presence');
    expect(result.price).toBe('$5,900 MXN');
  });

  it('"Que me encuentren" con página que no rinde o mejorable lleva al Sitio PyME completo', () => {
    expect(recommend({ goal: 'be-found', website: 'underperforming' }).id).toBe('site');
    expect(recommend({ goal: 'be-found', website: 'improve' }).id).toBe('site');
  });

  it('el precio de la recomendación sale del catálogo', () => {
    expect(recommend({ goal: 'be-found', website: 'improve' }).price).toBe('$16,900 MXN');
  });
});

describe('Diagnóstico — mensaje de WhatsApp precargado (doc 23 §6.4)', () => {
  it('incluye objetivo, estado de la web, negocio y paquete recomendado', () => {
    const answers = {
      goal: 'be-found',
      website: 'none',
      business: '  muebles a la medida en Pachuca ',
    } as const;
    expect(diagnosticMessage(answers, recommend(answers))).toBe(
      'Hola, vengo del diagnóstico del sitio de VertexLabs. Quiero que me encuentren, no tengo web. ' +
        'Mi negocio: muebles a la medida en Pachuca. Me recomendaron el paquete Presencia PyME. ¿Podemos platicar?',
    );
  });

  it('omite el negocio cuando la pregunta opcional queda vacía', () => {
    const answers = { goal: 'sell-online', website: 'improve', business: '   ' } as const;
    const message = diagnosticMessage(answers, recommend(answers));
    expect(message).not.toContain('Mi negocio');
    expect(message).toContain('Quiero vender en línea, quiero mejorar mi web.');
  });
});
