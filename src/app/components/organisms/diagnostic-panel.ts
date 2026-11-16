import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { HlmButton } from '@ui/button';
import { planById, priceLine } from '@app/content/plans';
import { Analytics } from '@app/core/analytics';
import { WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { tokenMs } from '@app/core/webgl';
import { AXES, FOCUS, type FocusKey, type Score } from '@app/diagnostic/axes';
import { recommend, toScores } from '@app/diagnostic/recommend';
import { AnswerOption } from '../atoms/answer-option';
import { Icon } from '../atoms/icon';
import { TextImports } from '../atoms/text';
import { CheckItem } from '../molecules/check-item';
import { RadarChart } from '../molecules/radar-chart';
import { DiagnosticLeadForm } from './diagnostic-lead-form';

const EMPTY: readonly (Score | null)[] = [null, null, null, null, null, null];
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * El Radar: una pregunta por pantalla, radar en vivo y resultado por el punto más débil. Al cambiar
 * de pregunta el foco va al título nuevo; al terminar, al título del resultado.
 */
@Component({
  selector: 'app-diagnostic-panel',
  imports: [
    AnswerOption,
    CheckItem,
    DiagnosticLeadForm,
    HlmButton,
    Icon,
    RadarChart,
    TextImports,
    WhatsappLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-white shadow-md md:grid-cols-3',
  },
  template: `
    <div class="min-w-0 p-6 sm:p-8 md:col-span-2 md:p-12">
      @if (result(); as r) {
        <div class="grid grid-cols-1 gap-6">
          <div class="grid animate-enter items-center gap-6 sm:grid-cols-5 md:block">
            <div class="grid gap-1 sm:col-span-3">
              <p appEyebrow class="mb-1">Tu resultado</p>
              <h3 appH3 #resultTitle tabindex="-1" class="outline-none">
                Tu siguiente paso: {{ plan()?.name }}
              </h3>
              <p class="font-bold">
                {{ price()?.main }} · <span appNote>{{ price()?.note }}</span>
              </p>
            </div>
            <app-radar-chart class="sm:col-span-2 md:hidden" [values]="answers()" grow />
          </div>
          <dl class="grid gap-4">
            <div class="animate-enter" style="--stagger: 1">
              <dt class="text-xs font-bold tracking-eyebrow text-plum uppercase">
                Tu prioridad: {{ focus(r.focus).name }}
              </dt>
              <dd class="mt-1">{{ focus(r.focus).line }}</dd>
            </div>
            <div class="animate-enter" style="--stagger: 2">
              <dt class="text-xs font-bold tracking-eyebrow text-plum uppercase">
                Lo primero que haríamos
              </dt>
              <dd class="mt-2">
                <ul class="grid gap-2">
                  @for (action of focus(r.focus).actions; track $index) {
                    <li appCheckItem>{{ capitalize(action) }}</li>
                  }
                </ul>
              </dd>
            </div>
            @if (r.best; as best) {
              <div class="animate-enter" style="--stagger: 3">
                <dt class="text-xs font-bold tracking-eyebrow text-plum uppercase">
                  Lo que ya tienes bien
                </dt>
                <dd class="mt-1">{{ focus(best).name }}.</dd>
              </div>
            }
            @if (r.next; as next) {
              <div class="animate-enter" style="--stagger: 4">
                <dt class="text-xs font-bold tracking-eyebrow text-plum uppercase">Después</dt>
                <dd class="mt-1">{{ focus(next).name }}.</dd>
              </div>
            }
          </dl>
          <div class="flex animate-enter flex-wrap gap-3" style="--stagger: 5">
            @if (!leadOpen()) {
              <button
                hlmBtn
                type="button"
                class="w-full whitespace-normal sm:w-auto"
                (click)="openLead()"
              >
                Recibe tu diagnóstico completo
              </button>
            }
            <a
              hlmBtn
              variant="outline"
              class="w-full whitespace-normal sm:w-auto"
              [appWhatsapp]="whatsappMessage()"
              location="diagnostico"
            >
              <app-icon name="chat" />Prefiero escribirles por WhatsApp
            </a>
          </div>
          @if (leadOpen()) {
            <app-diagnostic-lead-form
              class="animate-enter"
              [result]="r"
              [summary]="summary()"
              [whatsappMessage]="whatsappMessage()"
            />
          }
          <p>
            <button hlmBtn variant="text" type="button" class="px-1" (click)="restart()">
              <app-icon name="back" />Volver a empezar
            </button>
          </p>
        </div>
      } @else {
        <div class="flex justify-between gap-3 text-sm font-semibold text-muted-foreground">
          <span>Pregunta {{ index() + 1 }} de 6</span><span>{{ axis().name }}</span>
        </div>
        <div aria-hidden="true" class="mt-3 mb-6 h-1.5 overflow-hidden rounded-pill bg-sand">
          <span
            class="block h-full origin-left bg-pink transition-transform duration-(--motion-base)"
            [style.transform]="'scaleX(' + progress() + ')'"
          ></span>
        </div>
        <!-- Se vuelve a crear con cada pregunta, para que entre con movimiento. -->
        @for (current of [axis()]; track current.key) {
          <h3
            appH3
            #questionTitle
            id="q-title"
            tabindex="-1"
            class="outline-none"
            [class]="enter()"
          >
            {{ current.question }}
          </h3>
          <div role="group" aria-labelledby="q-title" class="mt-6 grid gap-3">
            @for (option of current.options; track $index) {
              <button
                appAnswerOption
                [class]="enter()"
                [style.--stagger]="$index + 1"
                [pressed]="answers()[index()] === $index + 1"
                (click)="choose($index + 1)"
              >
                {{ option }}
              </button>
            }
          </div>
        }
        <div class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <button
            hlmBtn
            variant="text"
            type="button"
            class="px-1"
            [disabled]="index() === 0"
            (click)="back()"
          >
            <app-icon name="back" />Anterior
          </button>
          <span appNote>Puedes regresar sin perder tus respuestas.</span>
        </div>
      }
      <p class="sr-only" aria-live="polite">{{ live() }}</p>
    </div>
    <aside
      class="hidden content-center gap-2 border-l border-border bg-surface p-8 md:grid"
      aria-label="Tu radar en vivo"
    >
      <p class="font-bold">Tu radar</p>
      <app-radar-chart [values]="answers()" />
      <p appNote>Se dibuja con tus respuestas.</p>
    </aside>
  `,
})
export class DiagnosticPanel {
  private readonly analytics = inject(Analytics);
  private readonly injector = inject(Injector);
  private readonly questionTitle = viewChild<ElementRef<HTMLElement>>('questionTitle');
  private readonly resultTitle = viewChild<ElementRef<HTMLElement>>('resultTitle');
  private started = false;

  protected readonly answers = signal(EMPTY);
  protected readonly index = signal(0);
  protected readonly done = signal(false);
  protected readonly leadOpen = signal(false);
  protected readonly live = signal('');
  /** Hacia dónde fue el último cambio de pregunta: 0 al cargar (sin animación de entrada). */
  private readonly direction = signal<-1 | 0 | 1>(0);
  /** Pausa breve para que se vea la opción elegida antes de pasar a la siguiente. */
  protected readonly advancing = signal(false);
  protected readonly enter = computed(() =>
    this.direction() === 0
      ? ''
      : this.direction() > 0
        ? 'animate-enter-next'
        : 'animate-enter-back',
  );

  protected readonly axis = computed(() => AXES[this.index()]);
  protected readonly progress = computed(() => (this.index() + 1) / AXES.length);
  protected readonly result = computed(() =>
    this.done() ? recommend(toScores(this.answers() as Score[])) : null,
  );
  protected readonly plan = computed(() => {
    const r = this.result();
    return r ? planById(r.plan) : null;
  });
  protected readonly price = computed(() => {
    const plan = this.plan();
    return plan ? priceLine(plan) : null;
  });
  protected readonly whatsappMessage = computed(() => {
    const r = this.result();
    const plan = this.plan();
    return r && plan ? WHATSAPP_MESSAGES.diagnostic(FOCUS[r.focus].name, plan.name) : '';
  });
  /** Respuestas en texto para el formulario: "V4 C3 F2 N4 D3 P4". */
  protected readonly summary = computed(() =>
    AXES.map((axis, i) => `${axis.key}${this.answers()[i] ?? '-'}`).join(' '),
  );

  protected readonly focus = (key: FocusKey) => FOCUS[key];
  protected readonly capitalize = capitalize;

  protected choose(value: number): void {
    if (!this.started) {
      this.started = true;
      this.analytics.track('diagnostico_inicio', {});
    }
    if (this.advancing()) return;
    const i = this.index();
    this.answers.update((list) => list.map((v, j) => (j === i ? (value as Score) : v)));
    this.advancing.set(true);
    setTimeout(() => {
      this.advancing.set(false);
      if (i < AXES.length - 1) {
        this.direction.set(1);
        this.index.set(i + 1);
        this.announceQuestion();
      } else {
        this.finish();
      }
    }, tokenMs('--motion-fast'));
  }

  protected back(): void {
    if (this.index() === 0 || this.advancing()) return;
    this.direction.set(-1);
    this.index.update((i) => i - 1);
    this.announceQuestion();
  }

  protected restart(): void {
    this.answers.set(EMPTY);
    this.direction.set(-1);
    this.index.set(0);
    this.done.set(false);
    this.leadOpen.set(false);
    this.announceQuestion();
  }

  protected openLead(): void {
    this.leadOpen.set(true);
    this.analytics.track('cta_click', {
      ubicacion: 'diagnostico-resultado',
      texto: 'Recibe tu diagnóstico completo',
    });
    afterNextRender(() => document.getElementById('lf-nombre')?.focus(), {
      injector: this.injector,
    });
  }

  private finish(): void {
    this.done.set(true);
    const r = this.result();
    const plan = this.plan();
    if (!r || !plan) return;
    this.analytics.track('diagnostico_fin', { plan: r.plan, foco: r.focus });
    this.live.set(
      `Resultado: tu siguiente paso es ${plan.name}. Tu prioridad es ${FOCUS[r.focus].name}.`,
    );
    afterNextRender(() => this.resultTitle()?.nativeElement.focus(), { injector: this.injector });
  }

  private announceQuestion(): void {
    const i = this.index();
    this.live.set(`Pregunta ${i + 1} de ${AXES.length}: ${AXES[i].question}`);
    afterNextRender(() => this.questionTitle()?.nativeElement.focus(), { injector: this.injector });
  }
}
