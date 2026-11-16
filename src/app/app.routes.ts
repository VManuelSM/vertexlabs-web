import type { Routes } from '@angular/router';
import { HomePage } from './pages/home-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'aviso-de-privacidad',
    loadComponent: () => import('./pages/privacy-page').then((m) => m.PrivacyPage),
  },
  {
    path: 'componentes',
    loadComponent: () => import('./pages/components-page').then((m) => m.ComponentsPage),
  },
  { path: '**', redirectTo: '' },
];
