import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { addEntity, setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { withRequestStatus } from '../../shared/ngrx/withRequestStatus';
import { RecuringTransaction, UpsertRecuringTransaction } from './types';
import { RecuringTransactionService } from './recuring-transaction-service';

export const recuringTransactionStore = signalStore(
  { providedIn: 'root' },
  withState({
    selectedId: null as number | null,
  }),
  withRequestStatus(),
  withEntities<RecuringTransaction>(),
  withComputed((store) => {
    return {
      recuringTransactionCount: computed(() => store.entities().length),
      selectedRecuringTransaction: computed(() => {
        if (store.selectedId() === null) {
          return null;
        }

        return (
          store.entities().find((transaction) => transaction.id === store.selectedId()) ?? null
        );
      }),
    };
  }),
  withMethods((store, recuringTransactionService = inject(RecuringTransactionService)) => {
    return {
      setSelectedId: (id: number | null) => {
        patchState(store, { selectedId: id });
      },
      loadAccountRecuringTransactions: rxMethod<number>(
        pipe(
          tap(() => {
            store.startLoading();
          }),
          switchMap((accountId) =>
            recuringTransactionService.getRecuringTransactionsByAccount(accountId).pipe(
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
      addRecuringTransaction: rxMethod<UpsertRecuringTransaction>(
        pipe(
          tap(() => {
            store.startLoading();
          }),
          switchMap((transaction) =>
            recuringTransactionService.createRecuringTransaction(transaction).pipe(
              tap((response) => {
                store.setMessage(response.message);
                patchState(store, addEntity(response.data));
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
      updateRecuringTransaction: rxMethod<UpsertRecuringTransaction>(
        pipe(
          tap(() => {
            store.startLoading();
          }),
          switchMap((transaction) =>
            recuringTransactionService
              .updateRecuringTransaction(store.selectedId()!, transaction)
              .pipe(
                tap((response) => {
                  store.setMessage(response.message);
                  patchState(store, setEntity(response.data));
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
      changeStatusRecuringTransaction: rxMethod<RecuringTransaction>(
        pipe(
          tap(() => {
            store.startLoading();
          }),
          switchMap((transaction) =>
            recuringTransactionService.changeStatusRecuringTransaction(transaction).pipe(
              tap((response) => {
                store.setMessage(response.message);
                patchState(store, setEntity(response.data));
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
      // updateTransaction: rxMethod<UpsertTransaction>(
      //   pipe(
      //     tap(() => {
      //       store.startLoading();
      //     }),
      //     switchMap((transaction) => {
      //       return transactionService.updateTransaction(store.selectedId()!, transaction).pipe(
      //         tap((response) => {
      //           store.setMessage(response.message);
      //           accStore.modifyAccount(response.data.account);
      //           patchState(store, setEntity(response.data));
      //         }),
      //         catchError((error: HttpErrorResponse) => {
      //           store.setError(error.error.error, error.error.details);
      //           return throwError(() => error);
      //         }),
      //         finalize(() => {
      //           store.stopLoading();
      //         })
      //       );
      //     })
      //   )
      // ),
      // removeTransaction: rxMethod<number>(
      //   pipe(
      //     tap(() => {
      //       store.startLoading();
      //     }),
      //     switchMap((transactionId) => {
      //       return transactionService.deleteTransactionById(transactionId).pipe(
      //         tap((response) => {
      //           store.setMessage(response.message);
      //           patchState(store, removeEntity(transactionId));
      //           accStore.modifyAccount(response.data);
      //         }),
      //         catchError((error: HttpErrorResponse) => {
      //           store.setError(error.error.error, error.error.details);
      //           return throwError(() => error);
      //         }),
      //         finalize(() => {
      //           store.stopLoading();
      //         })
      //       );
      //     })
      //   )
      // ),
    };
  })
);
