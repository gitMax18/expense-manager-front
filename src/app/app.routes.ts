import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { authGuard } from './core/auth/guards/auth.guard';
import accountRoutes from './features/account/routes';
import authRoutes from './core/auth/routes';
import categoryRoutes from './features/category/routes';
import transactionRoutes from './features/transaction/routes';
import recuringTransactionRoutes from './features/recuring-transaction/routes';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      ...accountRoutes,
      ...categoryRoutes,
      ...transactionRoutes,
      ...recuringTransactionRoutes,
    ],
  },
];
