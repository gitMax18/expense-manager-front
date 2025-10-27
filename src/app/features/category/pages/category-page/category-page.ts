import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { categoryStore } from '../../category-store';
import { DisplayCategories } from '../../components/display-categories/display-categories';
import { Category } from '../../types';

@Component({
  selector: 'app-category-page',
  imports: [DisplayCategories, ButtonModule],
  template: `
    <section class="category-page">
      <header class="category-page__header">
        <div>
          <h2 class="category-page__title">Catégories</h2>
          <p class="category-page__subtitle">
            {{ categoryStore.categoryCount() }} catégorie{{
              categoryStore.categoryCount() > 1 ? 's' : ''
            }}
          </p>
        </div>
        <div class="category-page__actions">
          <p-button
            label="Créer une catégorie"
            icon="pi pi-plus"
            severity="success"
            (onClick)="handleCreateCategory()"
          />
        </div>
      </header>

      <app-display-categories
        [categories]="categoryStore.entities()"
        [isLoading]="categoryStore.isLoading()"
        (onUpdate)="handleUpdateCategory($event)"
        (onDelete)="handleDeleteCategory($event)"
      />
    </section>
  `,
  styleUrl: './category-page.scss',
})
export class CategoryPage {
  categoryStore = inject(categoryStore);
  private router = inject(Router);

  ngOnInit() {
    this.categoryStore.resetStatus();
    this.categoryStore.getUserCategories();
  }

  handleCreateCategory() {
    this.router.navigate(['/category/create']);
  }

  handleUpdateCategory(category: Category) {
    this.router.navigate([`/category/${category.id}/update`]);
  }

  handleDeleteCategory(categoryId: number) {
    this.categoryStore.removeCategory(categoryId);
  }
}
