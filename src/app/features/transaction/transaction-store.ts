import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { withRequestStatus } from '../../shared/ngrx/withRequestStatus';
import { Transaction, UpsertTransaction } from './types';
import { TransactionService } from './transaction-service';
import { accountStore } from '../account/account-store';

export const transactionStore = signalStore(
  { providedIn: 'root' },
  withState({
    selectedId: null as number | null,
  }),
  withRequestStatus(),
  withEntities<Transaction>(),
  withComputed((store) => {
    return {
      transactionCount: computed(() => store.entities().length),
      selectedTransaction: computed(() => {
        if (store.selectedId() === null) {
          return null;
        }

        return (
          store.entities().find((transaction) => transaction.id === store.selectedId()) ?? null
        );
      }),
    };
  }),
  withMethods(
    (store, transactionService = inject(TransactionService), accStore = inject(accountStore)) => {
      return {
        setSelectedId: (id: number | null) => {
          patchState(store, { selectedId: id });
        },
        loadAccountTransactions: rxMethod<number>(
          pipe(
            tap(() => {
              store.startLoading();
            }),
            switchMap((accountId) =>
              transactionService.getTransactionsByAccount(accountId).pipe(
                tap((response) => {
                  patchState(store, setEntities(response.data));
                  patchState(store, { isLoaded: true });
                }),
                catchError((error: HttpErrorResponse) => {
                  store.setError(error.error.error, error.error.details);
                  return throwError(() => error);
                }),
                finalize(() => {
                  store.stopLoading();
                })
              )
            )
          )
        ),
        addTransaction: rxMethod<UpsertTransaction>(
          pipe(
            tap(() => {
              store.startLoading();
            }),
            switchMap((transaction) =>
              transactionService.createTransaction(transaction).pipe(
                tap((response) => {
                  store.setMessage(response.message);
                  patchState(store, addEntity(response.data));
                  accStore.modifyAccount(response.data.account);
                }),
                catchError((error: HttpErrorResponse) => {
                  store.setError(error.error.error, error.error.details);
                  return throwError(() => error);
                }),
                finalize(() => {
                  store.stopLoading();
                })
              )
            )
          )
        ),
        updateTransaction: rxMethod<UpsertTransaction>(
          pipe(
            tap(() => {
              store.startLoading();
            }),
            switchMap((transaction) => {
              return transactionService.updateTransaction(store.selectedId()!, transaction).pipe(
                tap((response) => {
                  store.setMessage(response.message);
                  accStore.modifyAccount(response.data.account);
                  patchState(store, setEntity(response.data));
                }),
                catchError((error: HttpErrorResponse) => {
                  store.setError(error.error.error, error.error.details);
                  return throwError(() => error);
                }),
                finalize(() => {
                  store.stopLoading();
                })
              );
            })
          )
        ),
        removeTransaction: rxMethod<number>(
          pipe(
            tap(() => {
              store.startLoading();
            }),
            switchMap((transactionId) => {
              return transactionService.deleteTransactionById(transactionId).pipe(
                tap((response) => {
                  store.setMessage(response.message);
                  patchState(store, removeEntity(transactionId));
                  accStore.modifyAccount(response.data);
                }),
                catchError((error: HttpErrorResponse) => {
                  store.setError(error.error.error, error.error.details);
                  return throwError(() => error);
                }),
                finalize(() => {
                  store.stopLoading();
                })
              );
            })
          )
        ),
      };
    }
  )
);
