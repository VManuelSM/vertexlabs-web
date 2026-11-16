/**
 * Un dato que el equipo todavía no confirma (`.tbd` en el prototipo). Se muestra subrayado con
 * puntos y con el título de la nota, para que nadie lo confunda con un hecho.
 * Cada uno equivale a un `TODO(dato)`: hay que cerrarlo antes de lanzar.
 */
export interface Tbd {
  readonly tbd: string;
  readonly note?: string;
}

/** Texto que puede mezclar partes confirmadas y datos por confirmar. */
export type Copy = string | Tbd | readonly (string | Tbd)[];

export const tbd = (text: string, note = 'Por confirmar'): Tbd => ({ tbd: text, note });

export const isTbd = (part: string | Tbd): part is Tbd => typeof part !== 'string';

export const copyParts = (copy: Copy): readonly (string | Tbd)[] =>
  typeof copy === 'string' || !Array.isArray(copy) ? [copy as string | Tbd] : copy;

/** Texto plano (para atributos, mensajes de WhatsApp o lectores de pantalla). */
export const copyText = (copy: Copy): string =>
  copyParts(copy)
    .map((part) => (isTbd(part) ? part.tbd : part))
    .join('');
