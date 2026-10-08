import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DiagnosticPanel } from '../diagnostic/components/diagnostic-panel';
import { PackagesSection } from '../packages/components/packages-section';
import { CasesSection } from './components/cases-section';
import { FaqSection } from './components/faq-section';
import { FinalCtaSection } from './components/final-cta-section';
import { HeroSection } from './components/hero-section';
import { MetricsBand } from './components/metrics-band';
import { ProblemSection } from './components/problem-section';
import { ProcessSection } from './components/process-section';
import { TeamSection } from './components/team-section';
import { WhyUsSection } from './components/why-us-section';

/**
 * Landing packages-led (doc 23 §4): promesa → diagnóstico → empatía → oferta → por qué valemos
 * más → transparencia → prueba → humanidad → objeciones → cierre.
 */
@Component({
  selector: 'app-landing-page',
  imports: [
    CasesSection,
    DiagnosticPanel,
    FaqSection,
    FinalCtaSection,
    HeroSection,
    MetricsBand,
    PackagesSection,
    ProblemSection,
    ProcessSection,
    TeamSection,
    WhyUsSection,
  ],
  template: `
    <app-hero-section />
    <app-metrics-band />
    <app-diagnostic-panel />
    <app-problem-section />
    <app-packages-section />
    <app-why-us-section />
    <app-process-section />
    <app-cases-section />
    <app-team-section />
    <app-faq-section />
    <app-final-cta-section />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {}
