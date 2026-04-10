import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { ExpensesByCategory } from './types';
import { withRequestStatus } from '../../shared/ngrx/withRequestStatus';
import { inject } from '@angular/core';
import { DashboardService } from './dashboard-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const dashboardStore = signalStore(
  { providedIn: 'root' },
  withRequestStatus(),
  withEntities<ExpensesByCategory>(),
  withMethods((store, dashboardService = inject(DashboardService)) => ({
    getExpensesByCategory: rxMethod<void>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap(() =>
          dashboardService.getExpensesByCategory().pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, { isLoaded: true });
              patchState(store, setEntities(response.data));
            }),
            catchError((error: HttpErrorResponse) => {
              store.setError(error.error.error, error.error.details);
              return throwError(() => error);
            }),
            finalize(() => store.stopLoading())
          )
        )
      )
    ),
  }))
);
