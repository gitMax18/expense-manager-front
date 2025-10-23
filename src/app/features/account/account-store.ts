import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Account, UpsertAccountRequest } from './types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap, throwError } from 'rxjs';
import { withRequestStatus } from '../../shared/ngrx/withRequestStatus';
import { computed, inject, signal } from '@angular/core';
import { AccountService } from './account-service';
import { ErrorResponse } from '../../shared/types';

type AccountState = {
  selectedId: string | null;
};

export const accountStore = signalStore(
  { providedIn: 'root' },
  withState<AccountState>({ selectedId: null }),
  withRequestStatus(),
  withEntities<Account>(),
  withComputed((store) => ({
    accountCount: computed(() => store.entities().length),
    selectedAccount: signal(
      store.entities().filter((account) => account.id === store.selectedId())
    ),
  })),
  withMethods((store, accountService = inject(AccountService)) => ({
    setSelectedId: (id: string) => {
      patchState(store, { selectedId: id });
    },
    addAccount: rxMethod<UpsertAccountRequest>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap((account) => {
          return accountService.createAccount(account).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, addEntity(response.data));
            }),
            catchError((error: ErrorResponse) => {
              store.setError(error.error, error.details);
              return throwError(() => error);
            }),
            finalize(() => store.stopLoading())
          );
        })
      )
    ),
    removeAccount: rxMethod<string>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap((id) => {
          return accountService.deleteAccountById(id).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, removeEntity(id));
            }),
            catchError((error: ErrorResponse) => {
              store.setError(error.error, error.details);
              return throwError(() => error);
            }),
            finalize(() => store.stopLoading())
          );
        })
      )
    ),
    updateAccount: rxMethod<UpsertAccountRequest>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap((account) => {
          return accountService.updateAccount(store.selectedId()!, account).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, setEntity(response.data));
            }),
            catchError((error: ErrorResponse) => {
              store.setError(error.error, error.details);
              return throwError(() => error);
            }),
            finalize(() => store.stopLoading())
          );
        })
      )
    ),
    getUserAccounts: rxMethod<void>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap(() => {
          return accountService.getUserAccounts().pipe(
            tap((response) => {
              patchState(store, setEntities(response.data));
            }),
            catchError((error: ErrorResponse) => {
              store.setError(error.error, error.details);
              return throwError(() => error);
            }),
            finalize(() => {
              store.stopLoading();
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.getUserAccounts();
    },
  })
);
