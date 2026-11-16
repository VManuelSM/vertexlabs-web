import { Directive } from '@angular/core';

/** Contenedor del sitio: 1200 px de contenido con el margen lateral del manual. */
@Directive({
  selector: '[appWrap]',
  host: { class: 'mx-auto block box-content max-w-site px-gutter' },
})
export class Wrap {}

/** Cabecera de sección: etiqueta, título y subtítulo, alineados a la izquierda. */
@Directive({
  selector: '[appSectionHead]',
  host: { class: 'mb-12 grid max-w-head gap-4' },
})
export class SectionHead {}
