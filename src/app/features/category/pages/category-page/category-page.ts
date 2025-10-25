import { Component, inject } from '@angular/core';
import { categoryStore } from '../../category-store';
import { DisplayCategories } from '../../components/display-categories/display-categories';
import { Category } from '../../types';

@Component({
  selector: 'app-category-page',
  imports: [DisplayCategories],
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

  ngOnInit() {
    this.categoryStore.getUserCategories();
  }

  handleUpdateCategory(category: Category) {
    this.categoryStore.setSelectedId(category.id);
  }

  handleDeleteCategory(categoryId: number) {
    this.categoryStore.removeCategory(categoryId);
  }
}
