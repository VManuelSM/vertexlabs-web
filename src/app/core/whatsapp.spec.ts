import { WHATSAPP_MESSAGES, whatsappUrl } from './whatsapp';

describe('enlaces de WhatsApp', () => {
  it('arma el enlace con el mensaje codificado', () => {
    expect(whatsappUrl('52 771 000 0000', 'Hola, me interesa el plan Para crecer.')).toBe(
      'https://wa.me/527710000000?text=Hola%2C%20me%20interesa%20el%20plan%20Para%20crecer.',
    );
  });

  it('no inventa un enlace sin número', () => {
    expect(whatsappUrl(null, WHATSAPP_MESSAGES.general)).toBeNull();
  });

  it('arma el mensaje del diagnóstico como el prototipo', () => {
    expect(WHATSAPP_MESSAGES.diagnostic('Qué tan digital eres', 'Para empezar')).toBe(
      'Hola, hice el diagnóstico. Mi prioridad es Qué tan digital eres y me salió el plan Para empezar.',
    );
  });
});
