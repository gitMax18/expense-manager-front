import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Account } from '../../types';

@Component({
  selector: 'app-display-account',
  host: {
    class: 'display-account',
  },
  imports: [CardModule, CurrencyPipe, ButtonModule],
  template: `
    <p-card>
      <ng-template #title>
        {{ account().name }}
      </ng-template>

      <ng-template #subtitle>
        {{ account().type }}
      </ng-template>

      <div class="display-account__content">
        @if (account().description) {
        <p class="display-account__description">
          {{ account().description }}
        </p>
        }

        <div class="display-account__row">
          <span class="display-account__label">Balance</span>
          <span class="display-account__value">
            {{ account().balance | currency : account().currency }}
          </span>
        </div>

        <div class="display-account__row">
          <span class="display-account__label">Currency</span>
          <span class="display-account__value">{{ account().currency }}</span>
        </div>

        <div class="display-account__row">
          <span class="display-account__label">Status</span>
          <span class="display-account__value">
            {{ account().archived ? 'Archived' : 'Active' }}
          </span>
        </div>
      </div>

      <div class="display-account__actions">
        <p-button
          label="Update"
          icon="pi pi-pencil"
          severity="secondary"
          (onClick)="handleUpdate()"
        />
        <p-button
          label="Delete"
          [loading]="isDeleteLoading()"
          icon="pi pi-trash"
          severity="danger"
          (onClick)="handleDelete()"
        />
      </div>
    </p-card>
  `,
  styleUrl: './display-account.scss',
})
export class DisplayAccount {
  account = input.required<Account>();
  isDeleteLoading = input(false);
  onUpdate = output<Account>();
  onDelete = output<number>();

  handleUpdate() {
    this.onUpdate.emit(this.account());
  }

  handleDelete() {
    this.onDelete.emit(this.account().id);
  }
}
