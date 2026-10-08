import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.routes') },
  { path: '**', redirectTo: '' },
];
