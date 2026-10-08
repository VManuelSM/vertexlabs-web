import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadge } from '@ui/badge';
import { HlmButton } from '@ui/button';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { WhatsAppLink } from '@shared/lib/whatsapp';
import { PACKAGES } from '../data/catalog';
import { CATEGORY_TILES } from '../data/categories';
import { formatMxn, priceSuffix } from '../models/web-package';

@Component({
  selector: 'app-packages-section',
  imports: [HlmBadge, HlmButton, Reveal, SectionHeading, WhatsAppLink],
  templateUrl: './packages-section.html',
  styleUrl: './packages-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesSection {
  protected readonly tiles = CATEGORY_TILES;
  protected readonly packages = PACKAGES;
  protected readonly formatMxn = formatMxn;
  protected readonly priceSuffix = priceSuffix;
  protected readonly upsellMessage =
    'Hola, necesito algo más que una página web (un sistema o automatización) y quiero que lo veamos.';
}
