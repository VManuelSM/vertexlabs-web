import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TbdMark } from '@app/components/atoms/copy';
import { Wrap } from '@app/components/atoms/layout';
import { LinkArrow } from '@app/components/atoms/link-arrow';
import { TextImports } from '@app/components/atoms/text';
import { Seo } from '@app/core/seo';

/**
 * Aviso de privacidad: por ahora solo la estructura del prototipo.
 * TODO(dato): texto final con los datos de la empresa, validado por un abogado antes de publicar.
 */
@Component({
  selector: 'app-privacy-page',
  imports: [LinkArrow, RouterLink, TbdMark, TextImports, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div appWrap class="pb-16">
      <header class="grid max-w-head gap-4 pt-16 pb-8">
        <p appEyebrow>Legal</p>
        <h1 appH2>Aviso de privacidad</h1>
        <p appLead>
          Estructura del aviso. El texto final se redacta con los datos de la empresa y lo valida un
          abogado antes de publicar.
        </p>
      </header>
      <div class="grid max-w-head gap-4">
        <ul class="grid list-disc gap-2 ps-5">
          <li><b>Responsable: </b><app-tbd>[razón social]</app-tbd> y domicilio.</li>
          <li>
            <b>Datos que pedimos:</b> nombre, negocio, WhatsApp o correo y respuestas del
            diagnóstico.
          </li>
          <li>
            <b>Para qué:</b> contactarte y enviarte tu diagnóstico y tu cotización. Si hay usos
            secundarios, como mercadotecnia, cómo negarte.
          </li>
          <li><b>Medición del sitio:</b> analítica y mapas de calor, y qué registran.</li>
          <li><b>Tus derechos:</b> cómo pedir acceso, rectificación, cancelación u oposición.</li>
          <li><b>Cambios:</b> cómo te avisamos y fecha de última actualización.</li>
        </ul>
        <p>
          <a appLinkArrow icon="back" routerLink="/" fragment="contacto">Volver al formulario</a>
        </p>
      </div>
    </div>
  `,
})
export class PrivacyPage {
  constructor() {
    inject(Seo).set({ title: 'Aviso de privacidad · Vertex Labs', path: '/aviso-de-privacidad' });
  }
}
