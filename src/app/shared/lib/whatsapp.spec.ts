import { whatsappLink } from './whatsapp';

describe('Enlace de WhatsApp precargado (doc 23 §7)', () => {
  it('codifica el mensaje completo en el parámetro text', () => {
    expect(whatsappLink('525512345678', 'Hola, ¿cuánto cuesta? $5,900 & más')).toBe(
      'https://wa.me/525512345678?text=Hola%2C%20%C2%BFcu%C3%A1nto%20cuesta%3F%20%245%2C900%20%26%20m%C3%A1s',
    );
  });
});
