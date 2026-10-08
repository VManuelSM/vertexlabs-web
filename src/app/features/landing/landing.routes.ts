import type { Routes } from '@angular/router';
import { LandingPage } from './landing-page';

export default [
  {
    path: '',
    component: LandingPage,
    title: 'VertexLabs · Páginas web y tiendas en línea para PyME, con precio cerrado',
  },
] satisfies Routes;
