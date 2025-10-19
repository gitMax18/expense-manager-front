import { HttpErrorResponse } from '@angular/common/http';
import { HttpRequestState, SuccessResponse, ErrorResponse } from './../types';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestStateService {
  create<TResponse>(): HttpRequestState<TResponse> {
    const isLoadingSignal = signal(false);
    const errorSignal = signal<string | null>(null);
    const errorDetailsSignal = signal<Record<string, string> | null>(null);
    const messageSignal = signal<string | null>(null);
    const dataSignal = signal<TResponse | null>(null);

    const execute = (requestFactory: () => Observable<SuccessResponse<TResponse>>) => {
      isLoadingSignal.set(true);
      errorSignal.set(null);
      dataSignal.set(null);
      messageSignal.set(null);

      return requestFactory().pipe(
        tap((response) => {
          dataSignal.set(response.data);
          messageSignal.set(response.message);
        }),
        catchError((error: HttpErrorResponse) => {
          const errorResponse = error.error as ErrorResponse;
          errorSignal.set(errorResponse.error || 'An unknown error occurred.');
          errorDetailsSignal.set(errorResponse.details || null);
          return throwError(() => error);
        }),
        finalize(() => {
          isLoadingSignal.set(false);
        })
      );
    };

    const reset = () => {
      isLoadingSignal.set(false);
      errorSignal.set(null);
      dataSignal.set(null);
      messageSignal.set(null);
      errorDetailsSignal.set(null);
    };

    return {
      isLoading: isLoadingSignal.asReadonly(),
      error: errorSignal.asReadonly(),
      errorDetails: errorDetailsSignal.asReadonly(),
      data: dataSignal.asReadonly(),
      message: messageSignal.asReadonly(),
      execute,
      reset,
    };
  }
}
