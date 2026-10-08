import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/** Misma clave que lee el script de index.html antes del primer pintado. */
export const THEME_STORAGE_KEY = 'vl-theme';

/** Tema claro/oscuro: sigue al sistema hasta que el visitante elige uno, y lo recuerda. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>(
    this.root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  );

  constructor() {
    if (!this.isBrowser) return;

    // Sin preferencia guardada, el sitio sigue al sistema operativo también en vivo.
    const query = this.root.ownerDocument.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    const followSystem = (event: MediaQueryListEvent) => {
      if (!this.storedTheme()) this.apply(event.matches ? 'dark' : 'light');
    };
    query?.addEventListener('change', followSystem);
    inject(DestroyRef).onDestroy(() => query?.removeEventListener('change', followSystem));
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.apply(next);
    this.store(next);
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    this.root.setAttribute('data-theme', theme);
  }

  private storedTheme(): string | null {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private store(theme: Theme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Navegación privada o almacenamiento bloqueado: el tema dura lo que la pestaña.
    }
  }
}
