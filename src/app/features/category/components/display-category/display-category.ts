import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Category } from '../../types';

@Component({
  selector: 'app-display-category',
  host: {
    class: 'display-category',
  },
  imports: [CardModule, ButtonModule, DatePipe],
  template: `
    <p-card>
      <div class="display-category__body" (click)="toggleDetails()">
        <div class="display-category__info">
          <h3 class="display-category__title">{{ category().name }}</h3>
          @if (category().description) {
          <p class="display-category__description">
            {{ category().description }}
          </p>
          } @else {
          <p class="display-category__description display-category__description--muted">
            No description provided
          </p>
          }
        </div>

        <div class="display-category__actions">
          <p-button
            label="Update"
            icon="pi pi-pencil"
            severity="secondary"
            [text]="true"
            (onClick)="handleUpdate($event)"
          />
          <p-button
            label="Delete"
            [loading]="isDeleteLoading()"
            icon="pi pi-trash"
            severity="danger"
            [text]="true"
            (onClick)="handleDelete($event)"
          />
        </div>
      </div>

      @if (showDetails()) {
      <div class="display-category__meta">
        <div class="display-category__meta-item">
          <span class="display-category__label">Created</span>
          <span class="display-category__value">
            {{ category().createdAt | date : 'mediumDate' }}
          </span>
        </div>

        <div class="display-category__meta-item">
          <span class="display-category__label">Last updated</span>
          <span class="display-category__value">
            {{ category().updatedAt | date : 'medium' }}
          </span>
        </div>
      </div>
      }
    </p-card>
  `,
  styleUrl: './display-category.scss',
})
export class DisplayCategory {
  category = input.required<Category>();
  isDeleteLoading = input(false);
  onUpdate = output<Category>();
  onDelete = output<number>();
  showDetails = signal(false);

  toggleDetails() {
    this.showDetails.update((value) => !value);
  }

  handleUpdate(event: Event) {
    event.stopPropagation();
    this.onUpdate.emit(this.category());
  }

  handleDelete(event: Event) {
    event.stopPropagation();
    this.onDelete.emit(this.category().id);
  }
}
