import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEAM } from '@app/content/home';
import { WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { CopyText } from '../atoms/copy';
import { SectionHead, Wrap } from '../atoms/layout';
import { LinkArrow } from '../atoms/link-arrow';
import { TextImports } from '../atoms/text';

/** Quiénes somos. TODO(dato): fotos reales, nombres y roles. */
@Component({
  selector: 'app-team',
  imports: [CopyText, LinkArrow, SectionHead, TextImports, WhatsappLink, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="equipo" aria-labelledby="equipo-title" class="bg-surface py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>Quiénes somos</p>
          <h2 appH2 id="equipo-title">Un equipo pequeño, de principio a fin.</h2>
          <p appLead>
            Somos un estudio digital en Pachuca. El mismo equipo te acompaña desde el diagnóstico
            hasta el lanzamiento.
          </p>
        </header>
        <ul class="grid gap-6 sm:grid-cols-3">
          @for (person of team; track $index) {
            <li class="flex items-center gap-4 sm:grid sm:content-start sm:gap-3">
              <div
                class="grid aspect-square w-24 shrink-0 place-items-center rounded-md border-2 border-dashed border-input bg-surface p-2 text-center text-xs leading-snug font-semibold text-muted-foreground sm:aspect-4/5 sm:w-full sm:p-4 sm:text-sm"
              >
                Foto real<br />por agregar
              </div>
              <div class="grid gap-1">
                <b class="text-base"><app-copy [value]="person.name" /></b>
                <span appNote><app-copy [value]="person.role" /></span>
              </div>
            </li>
          }
        </ul>
        <p class="mt-8">
          <a appLinkArrow [appWhatsapp]="messages.team" location="equipo"
            >Escríbele al equipo por WhatsApp</a
          >
        </p>
      </div>
    </section>
  `,
})
export class Team {
  protected readonly team = TEAM;
  protected readonly messages = WHATSAPP_MESSAGES;
}
