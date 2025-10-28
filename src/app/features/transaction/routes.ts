import { Routes } from '@angular/router';
import { accountResolver } from '../account/resolvers';
import { TransactionPage } from './pages/transaction-page/transaction-page';
import { transactionAccountResolver } from './resolvers';

export default [
  {
    path: 'accounts/:id/transactions',
    component: TransactionPage,
    resolve: {
      account: accountResolver,
      transactionsReady: transactionAccountResolver,
    },
  },
] as Routes;
