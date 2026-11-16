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
});
