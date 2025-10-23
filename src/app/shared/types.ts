import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export type SelectOption<TValue> = {
  label: string;
  value: TValue;
};

export type HttpRequestStatus = {
  isLoading: boolean;
  message: string | null;
  error: string | null;
  errorDetails: Record<string, string> | null;
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
