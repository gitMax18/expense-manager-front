import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, tap } from 'rxjs';
import { Account } from './types';
import { accountStore } from './account-store';

export const accountResolver: ResolveFn<Account> = (route) => {
  const store = inject(accountStore);
  const router = inject(Router);
  const accountIdParam = route.paramMap.get('id');
  const accountId = Number(accountIdParam);

  if (!accountIdParam || Number.isNaN(accountId)) {
    void router.navigate(['/accounts']);
    throw new Error('Invalid account identifier');
  }

  if (!store.entities().length && !store.isLoading()) {
    store.getUserAccounts();
  }

  return toObservable(store.selectedAccount!).pipe(
    tap((account) => {
      if (!account && !store.isLoading()) {
        void router.navigate(['/accounts']);
      }
    }),
    filter((account): account is Account => !!account),
    take(1)
  );
};
