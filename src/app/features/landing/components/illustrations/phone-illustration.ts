import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Teléfono con la app Kindu (caso propio). Decorativa. */
@Component({
  selector: 'app-phone-illustration',
  host: { 'aria-hidden': 'true', class: 'block' },
  template: `
    <div class="phone">
      <span class="notch"></span>
      <div class="screen">
        <div class="balance">
          <div class="balance-label">Saldo total</div>
          <div class="balance-amount">$18,450</div>
        </div>
        @for (row of rows; track $index) {
          <div class="row">
            <span class="icon"></span>
            <span class="line" [class.short]="row"></span>
            <span class="amount"></span>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    /* Ilustración: geometría propia en px; colores, radios y materiales siempre desde tokens. */
    .phone {
      position: relative;
      width: 158px;
      padding: 9px;
      border-radius: 26px;
      border: 1px solid var(--glass-border);
      background: var(--glass-strong);
      box-shadow:
        var(--glass-shadow),
        inset 0 1px 0 var(--glass-highlight);
    }

    .notch {
      position: absolute;
      z-index: 2;
      top: 15px;
      left: 50%;
      width: 42px;
      height: 5px;
      border-radius: 4px;
      background: var(--ink-3);
      opacity: 0.4;
      transform: translateX(-50%);
    }

    .screen {
      display: flex;
      flex-direction: column;
      gap: 9px;
      padding: 20px 12px 14px;
      border-radius: 19px;
      overflow: hidden;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--aurora-1) 20%, transparent),
        transparent 45%
      );
    }

    .balance {
      padding: 13px;
      border-radius: 13px;
      background: linear-gradient(140deg, var(--brand), var(--brand-strong));
      color: var(--on-brand);
      box-shadow: 0 8px 18px -8px var(--brand);
    }

    .balance-label {
      font-family: var(--font-mono);
      font-size: 7.5px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.85;
    }

    .balance-amount {
      font-size: 19px;
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--tracking-title);
      font-variant-numeric: tabular-nums;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
    }

    .icon {
      flex: none;
      width: 22px;
      height: 22px;
      border-radius: 7px;
      background: color-mix(in srgb, var(--brand) 22%, transparent);
    }

    .line {
      flex: 1;
      height: 7px;
      border-radius: 4px;
      background: var(--ink-3);
      opacity: 0.28;
    }

    .line.short {
      max-width: 60%;
    }

    .amount {
      width: 28px;
      height: 7px;
      border-radius: 4px;
      background: var(--ink-3);
      opacity: 0.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneIllustration {
  /** Filas del listado de movimientos; `true` = línea corta. */
  protected readonly rows = [false, true, false, true];
}
