import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

/**
 * Ruta actual sin fragmento ("/", "/componentes"). Sirve para anclas dentro de la misma página: con
 * `<base href="/">`, un `href="#x"` llevaría siempre al inicio.
 */
export const injectCurrentPath = () => {
  const router = inject(Router);
  const strip = (url: string) => url.split(/[?#]/)[0] || '/';
  return toSignal(
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => strip(router.url)),
    ),
    { initialValue: strip(router.url) },
  );
};
