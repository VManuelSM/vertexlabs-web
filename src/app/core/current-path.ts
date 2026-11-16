import { computed, Directive, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

/** URL actual sin fragmento ("/", "/?utm_source=facebook", "/componentes"). */
export const injectCurrentUrl = () => {
  const router = inject(Router);
  const strip = (url: string) => url.split('#')[0] || '/';
  return toSignal(
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => strip(router.url)),
    ),
    { initialValue: strip(router.url) },
  );
};

/**
 * Enlace a una sección: `<a appSection="planes">`. En la misma página queda como salto dentro del
 * documento conservando la consulta (`/?utm_source=…#planes`); con `<base href="/">`, un
 * `href="/#planes"` a secas perdería los UTM y recargaría la página. Desde otra página lleva al
 * inicio (`/#planes`). Con `page=""`, apunta a la página actual (enlace "Saltar al contenido").
 */
@Directive({
  selector: 'a[appSection]',
  host: { '[attr.href]': 'href()' },
})
export class SectionLink {
  readonly appSection = input.required<string>();
  /** Página de la sección; `''` es la actual. */
  readonly page = input('/');
  private readonly url = injectCurrentUrl();

  protected readonly href = computed(() => {
    const url = this.url();
    const path = url.split('?')[0];
    const page = this.page() || path;
    return `${page === path ? url : page}#${this.appSection()}`;
  });
}
