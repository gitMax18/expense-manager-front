import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import { withRequestStatus } from '../../shared/ngrx/withRequestStatus';
import { computed, inject } from '@angular/core';
import { AuthService } from './auth-service';
import { AuthRequest, User } from './types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap, throwError } from 'rxjs';
import { withState } from '@ngrx/signals';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<{ user: User | null }>({
    user: null,
  }),
  withRequestStatus(),
  withComputed((store) => ({
    isAuthenticated: computed(() => store.user() == null),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<AuthRequest>(
      pipe(
        tap(() => {
          console.log('hello login');
          store.resetStatus();
          store.startLoading();
        }),
        switchMap((credentials) => {
          return authService.login(credentials).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, { user: response.data.user });
            }),
            catchError((error) => {
              store.setError(error.error.error, error.error.details);
              return throwError(() => error);
            }),
            finalize(() => store.stopLoading())
          );
        })
      )
    ),
    register: rxMethod<AuthRequest>(
      pipe(
        tap(() => {
          store.resetStatus();
          store.startLoading();
        }),
        switchMap((credentials) => {
          return authService.register(credentials).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, { user: response.data.user });
            }),
            catchError((error) => {
              store.setError(error.error.error, error.error.details);
              return throwError(() => error);
            }),
            finalize(() => store.stopLoading())
          );
        })
      )
    ),
  }))
);
