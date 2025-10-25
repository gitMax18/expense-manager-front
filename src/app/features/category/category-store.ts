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
import { Category, UpsertCategory } from './types';
import { withRequestStatus } from '../../shared/ngrx/withRequestStatus';
import { computed, inject } from '@angular/core';
import { CategoryService } from './category-service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type CategoryState = {
  selectedId: number | null;
};

export const categoryStore = signalStore(
  { providedIn: 'root' },
  withState<CategoryState>({
    selectedId: null,
  }),
  withRequestStatus(),
  withEntities<Category>(),
  withComputed((store) => ({
    categoryCount: computed(() => store.entities().length),
    selectedCategory: computed(() => {
      const selectedId = store.selectedId();
      if (selectedId === null) {
        return null;
      }

      return store.entities().find((category) => category.id === selectedId) ?? null;
    }),
  })),
  withMethods((store, categoryService = inject(CategoryService)) => ({
    setSelectedId: (id: number | null) => {
      patchState(store, { selectedId: id });
    },
    addCategory: rxMethod<UpsertCategory>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap((category) =>
          categoryService.createCategory(category).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, addEntity(response.data));
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
    updateCategory: rxMethod<UpsertCategory>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap((category) =>
          categoryService.updateCategory(store.selectedId()!, category).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, setEntity(response.data));
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
    removeCategory: rxMethod<number>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap((id) =>
          categoryService.deleteCategoryById(id).pipe(
            tap((response) => {
              store.setMessage(response.message);
              patchState(store, removeEntity(id));
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
    getUserCategories: rxMethod<void>(
      pipe(
        tap(() => {
          store.startLoading();
        }),
        switchMap(() =>
          categoryService.getUserCategories().pipe(
            tap((response) => {
              store.setMessage(response.message);
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
