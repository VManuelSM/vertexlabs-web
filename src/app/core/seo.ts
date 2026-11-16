import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from './site-config';

export interface PageHead {
  readonly title: string;
  /** Ruta de la página ("/", "/aviso-de-privacidad"), para la URL canónica. */
  readonly path: string;
  readonly description?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  /** Para páginas internas como /componentes. */
  readonly noindex?: boolean;
  /** Datos estructurados (JSON-LD) de la página. */
  readonly jsonLd?: Record<string, unknown>;
}

const JSON_LD_ID = 'datos-estructurados';

/**
 * `<head>` de cada página: título, descripción, URL canónica, Open Graph, Twitter y JSON-LD. Lo que
 * depende del dominio o de la imagen para compartir solo se escribe cuando existen (TODO(dato)).
 * Sale en el HTML prerenderizado.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly site = inject(SITE_CONFIG);

  set(page: PageHead): void {
    const url = this.site.siteUrl ? `${this.site.siteUrl}${page.path}` : null;
    const image =
      this.site.siteUrl && this.site.shareImage
        ? `${this.site.siteUrl}${this.site.shareImage}`
        : null;
    const ogTitle = page.ogTitle ?? page.title;
    const ogDescription = page.ogDescription ?? page.description ?? null;

    this.title.setTitle(page.title);
    this.tag('name', 'description', page.description ?? null);
    this.tag('name', 'robots', page.noindex ? 'noindex, nofollow' : null);
    this.tag('property', 'og:type', 'website');
    this.tag('property', 'og:locale', 'es_MX');
    this.tag('property', 'og:site_name', this.site.name);
    this.tag('property', 'og:title', ogTitle);
    this.tag('property', 'og:description', ogDescription);
    this.tag('property', 'og:url', url);
    this.tag('property', 'og:image', image);
    this.tag('property', 'og:image:width', image ? '1200' : null);
    this.tag('property', 'og:image:height', image ? '630' : null);
    this.tag('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    this.tag('name', 'twitter:title', ogTitle);
    this.tag('name', 'twitter:description', ogDescription);
    this.canonical(url);
    this.jsonLd(page.jsonLd ?? null);
  }

  private tag(attr: 'name' | 'property', key: string, content: string | null): void {
    const selector = `${attr}="${key}"`;
    if (content === null) this.meta.removeTag(selector);
    else this.meta.updateTag({ [attr]: key, content }, selector);
  }

  private canonical(url: string | null): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private jsonLd(data: Record<string, unknown> | null): void {
    let script = this.document.getElementById(JSON_LD_ID);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSON_LD_ID;
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    // Evita que un "</script>" dentro de los datos cierre la etiqueta.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }
}
