import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { HttpRequestStatus } from '../types';

export function withRequestStatus() {
  return signalStoreFeature(
    withState<HttpRequestStatus>({
      isLoading: false,
      error: null,
      message: null,
      errorDetails: null,
    }),
    withMethods((store) => ({
      startLoading() {
        patchState(store, { isLoading: true, error: null, message: null, errorDetails: null });
      },

      stopLoading() {
        patchState(store, { isLoading: false });
      },

      setError(error: string, details?: Record<string, string> | null) {
        patchState(store, { isLoading: false, error, errorDetails: details });
      },

      setMessage(message: string) {
        patchState(store, { message });
      },

      resetStatus() {
        patchState(store, {
          isLoading: false,
          error: null,
          message: null,
          errorDetails: null,
        });
      },
    }))
  );
}
