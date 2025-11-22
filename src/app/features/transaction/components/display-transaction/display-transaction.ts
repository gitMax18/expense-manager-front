import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { Transaction, TransactionType } from '../../types';
import { TransactionService } from '../../transaction-service';
import { Category } from '../../../category/types';

@Component({
  selector: 'app-display-transaction',
  host: {
    class: 'display-transaction',
  },
  imports: [CardModule, ButtonModule, CurrencyPipe, DatePipe, ChipModule],
  template: `
    <p-card class="display-transaction__card" (click)="handleShowActions()">
      <ng-template #title>
        <div class="display-transaction__header">
          <span class="display-transaction__label">{{ transaction().label || 'No label' }}</span>
          <p-chip
            [label]="transaction().type.toLowerCase()"
            [class]="
              isTransactionOut()
                ? 'display-transaction__chips display-transaction__chips--out'
                : 'display-transaction__chips display-transaction__chips--in'
            "
          />
        </div>
      </ng-template>

      <div class="display-transaction__content">
        <div class="display-transaction__row">
          <span class="display-transaction__value">
            {{ displayAmount() | currency : currency() }}
          </span>
          <span class="display-transaction__meta">
            {{ transaction().createdAt | date : 'short' }}
          </span>
        </div>

        @if (transaction().merchant) {
        <div class="display-transaction__row">
          <span class="display-transaction__label">Commerçant</span>
          <span class="display-transaction__value">{{ transaction().merchant }}</span>
        </div>
        } @if (transaction().categoryId) {
        <div class="display-transaction__row">
          <span class="display-transaction__label">Catégorie</span>
          <span class="display-transaction__value">{{ category()?.name }}</span>
        </div>
        } @if (transaction().notes) {
        <p class="display-transaction__notes">{{ transaction().notes }}</p>
        }
      </div>

      @if(isShowActions()){
      <div class="display-transaction__actions">
        <p-button label="Modifier" icon="pi pi-pencil" (onClick)="handleUpdate()" />
        <p-button
          label="Supprimer"
          icon="pi pi-trash"
          severity="danger"
          (onClick)="handleDelete()"
        />
      </div>
      }
    </p-card>
  `,
  styleUrl: './display-transaction.scss',
})
export class DisplayTransaction {
  transactionService = inject(TransactionService);
  transaction = input.required<Transaction>();
  categories = input.required<Category[]>();
  currency = input.required<string>();
  onUpdate = output<Transaction>();
  onDelete = output<number>();

  isShowActions = signal<boolean>(false);
  category = computed(() =>
    this.categories().find((category) => category.id === this.transaction().categoryId)
  );

  isTransactionOut = computed(() => {
    if (this.transactionService.isTransactionOut(this.transaction())) {
      return true;
    }
    return false;
  });

  private readonly typeSeverities: Record<
    TransactionType,
    'success' | 'danger' | 'info' | 'warning'
  > = {
    [TransactionType.EXPENSE]: 'danger',
    [TransactionType.INCOME]: 'success',
    [TransactionType.TRANSFER_IN]: 'info',
    [TransactionType.TRANSFER_OUT]: 'warning',
  };

  readonly typeSeverity = computed(() => this.typeSeverities[this.transaction().type]);
  readonly displayAmount = computed(() => {
    const amount = this.transaction().amount;

    if (this.transactionService.isTransactionOut(this.transaction())) {
      return amount > 0 ? amount * -1 : amount;
    }

    return amount < 0 ? amount * -1 : amount;
  });

  handleUpdate() {
    this.onUpdate.emit(this.transaction());
  }

  handleDelete() {
    this.onDelete.emit(this.transaction().id);
  }

  handleShowActions() {
    this.isShowActions.update((val) => !val);
  }
}
