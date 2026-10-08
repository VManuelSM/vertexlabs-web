import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_SITE_CONFIG, SITE_CONFIG } from '../../../core/site.config';
import { DiagnosticPanel } from './diagnostic-panel';

describe('Diagnóstico — panel interactivo (doc 23 §3.2)', () => {
  let fixture: ComponentFixture<DiagnosticPanel>;
  let host: HTMLElement;

  const text = () => host.textContent?.replace(/\s+/g, ' ') ?? '';
  const button = (label: string) => {
    const found = [...host.querySelectorAll('button')].find((b) => b.textContent?.includes(label));
    if (!found) throw new Error(`No hay botón "${label}"`);
    return found;
  };
  /** El panel avanza solo tras una pausa breve (ADVANCE_DELAY_MS); se espera con timers reales. */
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await fixture.whenStable();
  };
  const choose = async (label: string) => {
    button(label).click();
    await settle();
  };
  const answerBusiness = async (value: string) => {
    const input = host.querySelector<HTMLInputElement>('#diagnostico-negocio')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const submit = async () => {
    button('Ver mi recomendación').click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [DiagnosticPanel],
      providers: [
        {
          provide: SITE_CONFIG,
          useValue: { ...DEFAULT_SITE_CONFIG, whatsappNumber: '525512345678' },
        },
      ],
    });
    fixture = TestBed.createComponent(DiagnosticPanel);
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('arranca en la pregunta 1 de 3', () => {
    expect(text()).toContain('Pregunta 1 de 3');
    expect(text()).toContain('¿Qué quieres lograr con tu presencia en línea?');
  });

  it('marca la opción elegida con aria-pressed y avanza sola a la siguiente pregunta', async () => {
    button('Que me encuentren').click();
    await fixture.whenStable();
    expect(button('Que me encuentren').getAttribute('aria-pressed')).toBe('true');
    expect(button('Vender en línea').getAttribute('aria-pressed')).toBe('false');

    await settle();
    expect(text()).toContain('Pregunta 2 de 3');
  });

  it('recomienda un paquete y deja el WhatsApp con el diagnóstico precargado', async () => {
    await choose('Que me encuentren');
    await choose('No tengo');
    await answerBusiness('muebles a la medida');
    await submit();

    expect(host.querySelector('h3')?.textContent).toContain('Presencia PyME');
    expect(text()).toContain('$5,900 MXN');

    const link = [...host.querySelectorAll('a')].find((a) =>
      a.textContent?.includes('Enviar por WhatsApp'),
    )!;
    const href = link.getAttribute('href')!;
    expect(href.startsWith('https://wa.me/525512345678?text=')).toBe(true);
    const message = decodeURIComponent(href.split('?text=')[1]);
    expect(message).toContain('Quiero que me encuentren, no tengo web.');
    expect(message).toContain('Mi negocio: muebles a la medida.');
    expect(message).toContain('Me recomendaron el paquete Presencia PyME.');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('"Regresar" vuelve a la pregunta anterior sin perder la respuesta', async () => {
    await choose('Vender en línea');
    button('Regresar').click();
    await fixture.whenStable();
    expect(text()).toContain('Pregunta 1 de 3');
    expect(button('Vender en línea').getAttribute('aria-pressed')).toBe('true');
  });

  it('"Empezar de nuevo" limpia las respuestas y regresa al inicio', async () => {
    await choose('Ordenar mi operación');
    await choose('Quiero mejorarla');
    await submit();
    expect(text()).toContain('Proyecto a la medida');

    button('Empezar de nuevo').click();
    await fixture.whenStable();
    expect(text()).toContain('Pregunta 1 de 3');
    expect(button('Ordenar mi operación').getAttribute('aria-pressed')).toBe('false');
  });
});
