import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export type SelectOption<TValue> = {
  label: string;
  value: TValue;
};

export type HttpRequestState<TResponse> = {
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  data: Signal<TResponse | null>;
  message: Signal<string | null>;
  errorDetails: Signal<Record<string, string> | null>;
  execute: (
    requestFactory: () => Observable<SuccessResponse<TResponse>>
  ) => Observable<SuccessResponse<TResponse>>;
  reset: () => void;
};

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ErrorResponse = {
  success: false;
  error: string;
  details: Record<string, string>;
};
