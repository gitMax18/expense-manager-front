import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/pages/login-page/login-page';
import { RegisterPage } from './core/auth/pages/register-page/register-page';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginPage,
  },
  {
    path: 'auth/register',
    component: RegisterPage,
  },
];
