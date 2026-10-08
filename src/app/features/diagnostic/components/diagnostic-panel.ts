import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HlmBadge } from '@ui/badge';
import { HlmButton } from '@ui/button';
import { HlmInput } from '@ui/input';
import { Reveal } from '@shared/lib/reveal';
import { WhatsAppLink } from '@shared/lib/whatsapp';
import {
  BUSINESS_MAX_LENGTH,
  GOAL_CHOICES,
  type Goal,
  type Recommendation,
  WEBSITE_CHOICES,
  type WebsiteStatus,
} from '../models/diagnostic';
import { diagnosticMessage, recommend } from '../services/recommendation';
import { ChoiceButton } from './choice-button';

type Step = 1 | 2 | 3;

/** Pausa para que se vea la opción elegida antes de pasar a la siguiente pregunta. */
const ADVANCE_DELAY_MS = 180;

/**
 * Mini-diagnóstico de 3 preguntas (doc 23 §3.2): recomienda un paquete y deja listo el mensaje
 * de WhatsApp. Lógica 100 % en cliente, sin backend.
 */
@Component({
  selector: 'app-diagnostic-panel',
  imports: [ChoiceButton, HlmBadge, HlmButton, HlmInput, Reveal, WhatsAppLink],
  templateUrl: './diagnostic-panel.html',
  styleUrl: './diagnostic-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagnosticPanel {
  private readonly injector = inject(Injector);
  private advanceTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly goalChoices = GOAL_CHOICES;
  protected readonly websiteChoices = WEBSITE_CHOICES;
  protected readonly businessMaxLength = BUSINESS_MAX_LENGTH;
  protected readonly steps: readonly Step[] = [1, 2, 3];

  protected readonly step = signal<Step>(1);
  protected readonly goal = signal<Goal | null>(null);
  protected readonly website = signal<WebsiteStatus | null>(null);
  protected readonly business = signal('');
  protected readonly recommendation = signal<Recommendation | null>(null);

  protected readonly message = computed(() => {
    const recommendation = this.recommendation();
    if (!recommendation) return '';
    return diagnosticMessage(
      { goal: this.goal(), website: this.website(), business: this.business() },
      recommendation,
    );
  });

  private readonly questionTitle = viewChild<ElementRef<HTMLElement>>('questionTitle');
  private readonly resultTitle = viewChild<ElementRef<HTMLElement>>('resultTitle');

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.advanceTimer));
  }

  protected chooseGoal(goal: Goal): void {
    this.goal.set(goal);
    this.advanceTo(2);
  }

  protected chooseWebsite(website: WebsiteStatus): void {
    this.website.set(website);
    this.advanceTo(3);
  }

  protected goTo(step: Step): void {
    clearTimeout(this.advanceTimer);
    this.step.set(step);
    this.focusAfterRender(() => this.questionTitle());
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.recommendation.set(recommend({ goal: this.goal(), website: this.website() }));
    this.focusAfterRender(() => this.resultTitle());
  }

  protected reset(): void {
    this.goal.set(null);
    this.website.set(null);
    this.business.set('');
    this.recommendation.set(null);
    this.goTo(1);
  }

  private advanceTo(step: Step): void {
    clearTimeout(this.advanceTimer);
    this.advanceTimer = setTimeout(() => this.goTo(step), ADVANCE_DELAY_MS);
  }

  /** Al cambiar de paso el botón pulsado desaparece; el foco pasa al nuevo título para no perderse. */
  private focusAfterRender(target: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => target()?.nativeElement.focus({ preventScroll: true }), {
      injector: this.injector,
    });
  }
}
