import { Routes } from '@angular/router';
import { RecuringTransactionPage } from './pages/recuring-transaction-page/recuring-transaction-page';

export default [
  {
    path: 'accounts/:id/recurring-transactions',
    component: RecuringTransactionPage,
  },
] as Routes;
