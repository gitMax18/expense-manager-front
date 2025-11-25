import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, skip, take } from 'rxjs';
import { transactionStore } from './transaction-store';

export const transactionAccountResolver: ResolveFn<true> = async (route): Promise<true> => {
  const store = inject(transactionStore);
  const router = inject(Router);

  const accountIdParam = route.paramMap.get('id');
  const accountId = Number(accountIdParam);

  if (!accountIdParam || Number.isNaN(accountId)) {
    await router.navigate(['/accounts']);
    throw new Error('Invalid account identifier');
  }

  store.loadAccountTransactions(accountId);

  await firstValueFrom(
    toObservable(store.isLoading).pipe(
      skip(1),
      filter((isLoading) => !isLoading),
      take(1)
    )
  );

  if (store.error()) {
    await router.navigate(['/accounts']);
    throw new Error('Unable to load transactions for the selected account');
  }

  return true;
};
