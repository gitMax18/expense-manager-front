import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { authGuard } from './core/auth/guards/auth.guard';
import accountRoutes from './features/account/routes';
import authRoutes from './core/auth/routes';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [...accountRoutes],
  },
];
