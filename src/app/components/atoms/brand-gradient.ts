import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Degradado de marca (`--gradient-brand`), solo donde el manual lo permite: banda de cierre, fondo
 * de capturas de proyectos, imagen para compartir y encabezado del portal. Ocupa el contenedor
 * posicionado más cercano y queda detrás del contenido.
 */
@Component({
  selector: 'app-brand-gradient',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none absolute inset-0 -z-10 block bg-(image:--gradient-brand)',
    'aria-hidden': 'true',
  },
  template: '',
})
export class BrandGradient {}
