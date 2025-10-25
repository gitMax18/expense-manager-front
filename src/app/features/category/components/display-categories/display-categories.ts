import { Component, input, output } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Category } from '../../types';
import { DisplayCategory } from '../display-category/display-category';

@Component({
  selector: 'app-display-categories',
  host: {
    class: 'display-categories',
  },
  imports: [DataView, DisplayCategory],
  template: `
    <p-dataView
      class="display-categories__data-view"
      [value]="categories()"
      [loading]="isLoading()"
      [trackBy]="trackByCategory"
    >
      <ng-template #list let-categories>
        <div class="display-categories__list">
          @for (category of categories; track category.id) {
          <app-display-category
            [category]="category"
            [isDeleteLoading]="isLoading()"
            (onUpdate)="handleUpdate($event)"
            (onDelete)="handleDelete($event)"
          />
          }
        </div>
      </ng-template>

      <ng-template #emptymessage>
        <div class="display-categories__empty">
          <span class="display-categories__empty-title">Aucune catégorie</span>
          <p class="display-categories__empty-text">
            Ajoutez vos premières catégories pour organiser vos dépenses.
          </p>
        </div>
      </ng-template>
    </p-dataView>
  `,
  styleUrl: './display-categories.scss',
})
export class DisplayCategories {
  categories = input.required<Category[]>();
  isLoading = input(false);
  onUpdate = output<Category>();
  onDelete = output<number>();

  handleUpdate(category: Category) {
    this.onUpdate.emit(category);
  }

  handleDelete(categoryId: number) {
    this.onDelete.emit(categoryId);
  }

  trackByCategory(index: number, category: Category) {
    return category.id || index;
  }
}
