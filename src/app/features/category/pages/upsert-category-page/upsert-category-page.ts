import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { categoryStore } from '../../category-store';
import { Category, UpsertCategory } from '../../types';
import { UpsertCategoryForm } from '../../components/upsert-category-form/upsert-category-form';

@Component({
  selector: 'app-upsert-category-page',
  host: {
    class: 'upsert-category-page',
  },
  imports: [UpsertCategoryForm],
  template: `
    <section class="upsert-category-page__container">
      <h1 class="upsert-category-page__title">{{ title() }}</h1>
      <app-upsert-category-form
        [category]="category()"
        [isLoading]="categoryStore.isLoading()"
        [serverError]="categoryStore.error()"
        [serverMessage]="categoryStore.message()"
        [serverErrorDetails]="categoryStore.errorDetails()"
        (onSubmit)="handleSubmit($event)"
      />
    </section>
  `,
  styleUrl: './upsert-category-page.scss',
})
export class UpsertCategoryPage {
  private router = inject(Router);
  categoryStore = inject(categoryStore);

  category = input<Category | null>(null);
  title = computed(() => (this.category() ? 'Mettre à jour la catégorie' : 'Créer une catégorie'));

  constructor() {
    effect(() => {
      if (this.categoryStore.isSuccess()) {
        this.router.navigate(['/category']);
      }
    });

    effect(() => {
      if (this.category()) {
        this.categoryStore.setSelectedId(this.category()!.id);
      } else {
        this.categoryStore.setSelectedId(null);
      }
    });
  }

  ngOnInit() {
    this.categoryStore.resetStatus();
  }

  handleSubmit(request: UpsertCategory) {
    if (this.category()) {
      this.categoryStore.updateCategory(request);
      return;
    }

    this.categoryStore.addCategory(request);
  }
}
