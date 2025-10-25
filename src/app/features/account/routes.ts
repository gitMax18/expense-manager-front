import { Routes } from '@angular/router';
import { AccountPage } from './pages/account-page/account-page';
import { UpsertAccountPage } from './pages/upsert-account-page/upsert-account-page';
import { accountResolver } from './resolvers';

export default [
  {
    path: 'accounts',
    component: AccountPage,
  },
  {
    path: 'accounts/create',
    component: UpsertAccountPage,
  },
  {
    path: 'accounts/:id/update',
    component: UpsertAccountPage,
    resolve: {
      account: accountResolver,
    },
  },
] as Routes;
