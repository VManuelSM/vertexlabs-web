import { ChangeDetectionStrategy, Component, Directive, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { HlmBadge } from '@ui/badge';
import { HlmButton } from '@ui/button';
import { HlmCheckbox } from '@ui/checkbox';
import { HlmInput } from '@ui/input';
import { HlmNativeSelect } from '@ui/native-select';
import { AnswerOption } from '@app/components/atoms/answer-option';
import { TbdMark } from '@app/components/atoms/copy';
import { Icon, ICON_NAMES } from '@app/components/atoms/icon';
import { Wrap } from '@app/components/atoms/layout';
import { LinkArrow } from '@app/components/atoms/link-arrow';
import { Logo } from '@app/components/atoms/logo';
import { PhoneFrame } from '@app/components/atoms/phone-frame';
import { TextImports } from '@app/components/atoms/text';
import { CaseCard } from '@app/components/molecules/case-card';
import { CheckItem } from '@app/components/molecules/check-item';
import { FaqItem } from '@app/components/molecules/faq-item';
import { CheckField, FormField } from '@app/components/molecules/form-field';
import { Price } from '@app/components/molecules/price';
import { ProblemCard } from '@app/components/molecules/problem-card';
import { ProcessStep } from '@app/components/molecules/process-step';
import { Testimonial } from '@app/components/molecules/testimonial';
import { CASES } from '@app/content/cases';
import { tbd } from '@app/content/copy';
import { planById, PLANS } from '@app/content/plans';
import { AXES } from '@app/diagnostic/axes';

interface Swatch {
  readonly name: string;
  readonly value: string;
  readonly origin: 'Manual' | 'Derivado';
  readonly use: string;
  readonly className: string;
}

interface ContrastPair {
  readonly label: string;
  readonly ratio: string;
  readonly use: string;
  readonly className: string;
}

/** Rótulo de cada muestra en la vista de componentes. */
@Directive({
  selector: '[appDemoLabel]',
  host: { class: 'text-xs font-bold tracking-eyebrow text-muted-foreground uppercase' },
})
export class DemoLabel {}

/*
 * /componentes: sistema de diseño en vivo (sin indexar). Muestra cada átomo y molécula con sus
 * estados; los estados de interacción se fuerzan con `data-demo` (ver styles.css).
 */
@Component({
  selector: 'app-components-page',
  imports: [
    AnswerOption,
    BrnAccordion,
    CaseCard,
    CheckField,
    CheckItem,
    DemoLabel,
    FaqItem,
    FormField,
    HlmBadge,
    HlmButton,
    HlmCheckbox,
    HlmInput,
    HlmNativeSelect,
    Icon,
    LinkArrow,
    Logo,
    PhoneFrame,
    Price,
    ProblemCard,
    ProcessStep,
    RouterLink,
    TbdMark,
    Testimonial,
    TextImports,
    Wrap,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-page.html',
})
export class ComponentsPage {
  protected readonly swatches: readonly Swatch[] = [
    {
      name: 'Azul marino',
      value: '#203441',
      origin: 'Manual',
      use: 'Texto y fondos oscuros',
      className: 'bg-navy',
    },
    {
      name: 'Ciruela',
      value: '#6E2451',
      origin: 'Manual',
      use: 'Etiquetas, acentos, hover',
      className: 'bg-plum',
    },
    {
      name: 'Rosa',
      value: '#F55786',
      origin: 'Manual',
      use: 'Botón principal',
      className: 'bg-pink',
    },
    {
      name: 'Azul acero',
      value: '#809DAC',
      origin: 'Manual',
      use: 'Líneas y decoración',
      className: 'bg-steel',
    },
    {
      name: 'Arena',
      value: '#E0CFBF',
      origin: 'Manual',
      use: 'Bandas y fondos cálidos',
      className: 'bg-sand',
    },
    {
      name: 'Blanco',
      value: '#FFFFFF',
      origin: 'Manual',
      use: 'Fondo base',
      className: 'bg-white border-b border-border',
    },
    {
      name: 'Superficie suave',
      value: '#F6F1EC',
      origin: 'Derivado',
      use: 'Arena al 30 %',
      className: 'bg-surface',
    },
    {
      name: 'Texto secundario',
      value: '#586770',
      origin: 'Derivado',
      use: 'Azul marino al 75 %',
      className: 'bg-muted-foreground',
    },
  ];

  protected readonly pairs: readonly ContrastPair[] = [
    {
      label: 'Azul marino sobre blanco',
      ratio: '12.9:1',
      use: 'Todo el texto',
      className: 'bg-white text-navy border border-border',
    },
    {
      label: 'Azul marino sobre arena',
      ratio: '8.5:1',
      use: 'Todo el texto',
      className: 'bg-sand text-navy',
    },
    {
      label: 'Blanco sobre azul marino',
      ratio: '12.9:1',
      use: 'Todo el texto',
      className: 'bg-navy text-white',
    },
    {
      label: 'Blanco sobre ciruela',
      ratio: '10.3:1',
      use: 'Todo el texto',
      className: 'bg-plum text-white',
    },
    {
      label: 'Blanco sobre rosa',
      ratio: '3.2:1',
      use: 'Solo 19 px o más en negrita',
      className: 'bg-pink text-white text-btn',
    },
    {
      label: 'Rosa sobre azul marino',
      ratio: '4.05:1',
      use: 'Solo texto grande',
      className: 'bg-navy text-pink text-btn',
    },
    {
      label: 'Azul acero sobre blanco',
      ratio: '2.9:1',
      use: 'Nunca para texto',
      className: 'bg-white text-steel border border-border',
    },
  ];

  protected readonly icons = ICON_NAMES;
  protected readonly plans = PLANS;
  protected readonly firstPlan = planById('empezar');
  protected readonly sampleAxis = AXES[0];
  protected readonly cases = CASES;
  protected readonly sampleTbd = tbd('unas 2 semanas');
  protected readonly pendingQuote = tbd('[Cita del cliente, con permiso por escrito]', 'Pendiente');
  protected readonly pendingAuthor = tbd('[Nombre, cargo, negocio]', 'Pendiente');

  constructor() {
    inject(Title).setTitle('Componentes · Vertex Labs');
    inject(Meta).updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}
