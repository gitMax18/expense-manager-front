import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, tap } from 'rxjs';
import { Category } from './types';
import { categoryStore } from './category-store';

export const categoryResolver: ResolveFn<Category> = (route) => {
  const store = inject(categoryStore);
  const router = inject(Router);
  const categoryIdParam = route.paramMap.get('id');
  const categoryId = Number(categoryIdParam);

  if (!categoryIdParam || Number.isNaN(categoryId)) {
    void router.navigate(['/category']);
    throw new Error('Invalid category identifier');
  }

  store.setSelectedId(categoryId);

  if (!store.entities().length && !store.isLoading()) {
    store.getUserCategories();
  }

  return toObservable(store.selectedCategory!).pipe(
    tap((category) => {
      if (!category && !store.isLoading()) {
        void router.navigate(['/category']);
      }
    }),
    filter((category): category is Category => !!category),
    take(1)
  );
};
