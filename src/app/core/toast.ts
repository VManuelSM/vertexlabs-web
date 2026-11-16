import { Injectable, signal } from '@angular/core';

/** Aviso breve (role="status"). Lo pinta el organismo `app-toast`. */
@Injectable({ providedIn: 'root' })
export class Toasts {
  private timer: ReturnType<typeof setTimeout> | undefined;
  readonly current = signal<{ readonly lead: string; readonly quote: string } | null>(null);

  show(lead: string, quote: string, ms = 5200): void {
    this.current.set({ lead, quote });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.current.set(null), ms);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }
}
