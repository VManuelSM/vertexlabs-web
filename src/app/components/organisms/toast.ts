import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toasts } from '@app/core/toast';

/** Aviso breve en la parte baja de la pantalla. Se anuncia sin mover el foco. */
@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    'aria-live': 'polite',
    class: 'fixed start-1/2 bottom-24 z-(--z-float) block w-11/12 max-w-lg -translate-x-1/2',
  },
  template: `
    @if (toasts.current(); as toast) {
      <p
        class="animate-enter rounded-md bg-navy px-4 py-3 text-sm leading-snug text-white shadow-md"
      >
        {{ toast.lead }}<br /><b class="text-sand">«{{ toast.quote }}»</b>
      </p>
    }
  `,
})
export class Toast {
  protected readonly toasts = inject(Toasts);
}
