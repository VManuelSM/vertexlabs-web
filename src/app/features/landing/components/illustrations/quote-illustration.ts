import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Cotizador web de Planifica tu Vivienda (caso de cliente). Decorativa. */
@Component({
  selector: 'app-quote-illustration',
  host: { 'aria-hidden': 'true', class: 'block w-full max-w-82.5' },
  template: `
    <div class="window">
      <div class="bar">
        <i></i><i></i><i></i>
        <span class="url">planificatuvivienda.com</span>
      </div>
      <div class="screen">
        <div class="title"></div>
        <div class="form">
          <div class="field"></div>
          <div class="field"></div>
          <div class="field"></div>
          <div class="field"></div>
        </div>
        <div class="total">
          <span class="total-label"></span>
          <span class="total-value">$ 1,240,000</span>
        </div>
        <div class="rows">
          @for (row of rows; track $index) {
            <div class="row">
              <span class="cell" [class.short]="row"></span>
              <span class="cell-amount"></span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    /* Ilustración: geometría propia en px; colores, radios y materiales siempre desde tokens. */
    .window {
      overflow: hidden;
      border-radius: var(--radius-md);
      border: 1px solid var(--glass-border);
      background: var(--glass-strong);
      box-shadow:
        var(--glass-shadow),
        inset 0 1px 0 var(--glass-highlight);
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 12px;
      border-bottom: 1px solid var(--line);
    }

    .bar i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ink-3);
      opacity: 0.5;
    }

    .url {
      margin-left: 8px;
      padding: 2px 10px;
      border-radius: var(--radius-full);
      background: color-mix(in srgb, var(--ink-3) 12%, transparent);
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--ink-3);
    }

    .screen {
      display: flex;
      flex-direction: column;
      gap: 11px;
      padding: 15px;
    }

    .title {
      width: 52%;
      height: 9px;
      border-radius: 4px;
      background: var(--ink);
      opacity: 0.72;
    }

    .form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .field {
      height: 28px;
      border-radius: 9px;
      border: 1px solid var(--glass-border);
      background: var(--glass);
    }

    .total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      border-radius: 11px;
      border: 1px solid var(--glass-border);
      background: linear-gradient(
        120deg,
        color-mix(in srgb, var(--brand) 20%, transparent),
        transparent
      );
    }

    .total-label {
      width: 64px;
      height: 7px;
      border-radius: 4px;
      background: var(--ink-3);
      opacity: 0.45;
    }

    .total-value {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      font-variant-numeric: tabular-nums;
      color: var(--brand);
    }

    .rows {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cell {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--ink-3);
      opacity: 0.25;
    }

    .cell.short {
      max-width: 70%;
    }

    .cell-amount {
      width: 36px;
      height: 6px;
      border-radius: 3px;
      background: var(--ink-3);
      opacity: 0.4;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteIllustration {
  /** Filas del desglose; `true` = línea corta. */
  protected readonly rows = [false, true, false];
}
