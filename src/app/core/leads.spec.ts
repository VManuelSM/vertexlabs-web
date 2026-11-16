import { TestBed } from '@angular/core/testing';
import { isEmail, isWhatsapp, LeadError, Leads, readUtm } from './leads';
import { SITE, SITE_CONFIG } from './site-config';

describe('contactos', () => {
  it('valida WhatsApp de 10 dígitos y correos como el prototipo', () => {
    expect(isWhatsapp('771 123 4567')).toBe(true);
    expect(isWhatsapp('77112')).toBe(false);
    expect(isEmail('ana@floreria.mx')).toBe(true);
    expect(isEmail('ana@floreria')).toBe(false);
  });

  it('toma los UTM de la URL y, si no hay, los de la visita', () => {
    expect(readUtm('?utm_source=facebook&utm_campaign=radar&x=1', null)).toEqual({
      utm_source: 'facebook',
      utm_campaign: 'radar',
    });
    expect(readUtm('', '{"utm_source":"google"}')).toEqual({ utm_source: 'google' });
    expect(readUtm('', 'no es json')).toEqual({});
  });

  it('no finge un envío sin servicio de formularios', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: SITE_CONFIG, useValue: { ...SITE, leadEndpoint: null } }],
    });
    const leads = TestBed.inject(Leads);
    await expect(
      leads.send({ origen: 'cierre', nombre: 'Ana', negocio: 'Florería', contacto: 'x', utm: {} }),
    ).rejects.toEqual(new LeadError('sin-servicio'));
  });

  describe('con servicio de formularios', () => {
    const lead = {
      origen: 'diagnostico' as const,
      nombre: 'Ana',
      negocio: 'Florería',
      contacto: '7711234567',
      plan: 'crecer',
      diagnostico: 'V2 C3 F1 N4 D3 P2 · plan crecer · foco F',
      utm: { utm_source: 'facebook' },
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SITE_CONFIG,
            useValue: { ...SITE, leadEndpoint: 'https://formularios.test/x' },
          },
        ],
      });
    });
    afterEach(() => vi.unstubAllGlobals());

    it('envía el contacto con el resultado y los UTM en JSON', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      vi.stubGlobal('fetch', fetchMock);
      await TestBed.inject(Leads).send(lead);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://formularios.test/x');
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual(lead);
    });

    it('marca el error si el servicio lo rechaza o no hay red', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })));
      await expect(TestBed.inject(Leads).send(lead)).rejects.toEqual(new LeadError('rechazado'));
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
      await expect(TestBed.inject(Leads).send(lead)).rejects.toEqual(new LeadError('red'));
    });
  });
});
