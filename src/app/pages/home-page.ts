import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Cases } from '@app/components/organisms/cases';
import { Closing } from '@app/components/organisms/closing';
import { Faq } from '@app/components/organisms/faq';
import { Hero } from '@app/components/organisms/hero';
import { Plans } from '@app/components/organisms/plans';
import { Problems } from '@app/components/organisms/problems';
import { Process } from '@app/components/organisms/process';
import { Team } from '@app/components/organisms/team';
import { TrustStrip } from '@app/components/organisms/trust-strip';

/** Inicio: una sola página con todas las secciones, en el orden del prototipo. */
@Component({
  selector: 'app-home-page',
  imports: [Cases, Closing, Faq, Hero, Plans, Problems, Process, Team, TrustStrip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-trust-strip />
    <app-problems />
    <app-plans />
    <app-cases />
    <app-process />
    <app-team />
    <app-faq />
    <app-closing />
  `,
})
export class HomePage {}
