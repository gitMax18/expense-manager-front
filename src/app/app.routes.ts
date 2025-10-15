import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/pages/login-page/login-page';
import { RegisterPage } from './core/auth/pages/register-page/register-page';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { AccountPage } from './features/account/pages/account-page/account-page';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginPage,
  },
  {
    path: 'auth/register',
    component: RegisterPage,
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'accounts',
        component: AccountPage,
      },
    ],
  },
];
