import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'componentes',
    loadComponent: () => import('./pages/components-page').then((m) => m.ComponentsPage),
  },
];
