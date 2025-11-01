import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard]
  },
];
