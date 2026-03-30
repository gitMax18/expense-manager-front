import { RecuringTransaction } from './../../types';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { Category } from '../../../category/types';
import { TransactionService } from '../../../transaction/transaction-service';

@Component({
  selector: 'app-display-recuring-transaction',
  host: {
    class: 'display-recuring-transaction',
  },
  imports: [CardModule, ChipModule, ButtonModule, CurrencyPipe, DatePipe],
  template: `
    <p-card class="display-recuring-transaction__card">
      <ng-template #title>
        <div class="display-recuring-transaction__header">
          <div class="display-recuring-transaction__title">
            <p class="display-recuring-transaction__label">
              {{ recuringTransaction().label || 'No label' }}
            </p>
            <p class="display-recuring-transaction__meta">
              Débute le {{ recuringTransaction().startDate | date : 'mediumDate' }}
            </p>
          </div>

          <p-chip
            [label]="recuringTransaction().type.toLowerCase()"
            [class]="
              transactionService.isTransactionOut(recuringTransaction())
                ? 'display-recuring-transaction__chip display-recuring-transaction__chip--out'
                : 'display-recuring-transaction__chip display-recuring-transaction__chip--in'
            "
          />
        </div>
      </ng-template>

      <div class="display-recuring-transaction__content">
        <div class="display-recuring-transaction__row">
          <span class="display-recuring-transaction__value">
            {{ transactionService.displayAmount(recuringTransaction()) | currency : currency() }}
          </span>
          <span class="display-recuring-transaction__meta">
            {{ recuringTransaction().frequency }}
          </span>
        </div>

        <div class="display-recuring-transaction__row">
          <span class="display-recuring-transaction__label">Prochaine exécution</span>
          <span class="display-recuring-transaction__value">
            @if (recuringTransaction().nextExecutionDate) {
            {{ recuringTransaction().nextExecutionDate | date : 'medium' }}
            } @else { Non planifiée }
          </span>
        </div>

        <div class="display-recuring-transaction__row">
          <span class="display-recuring-transaction__label">Heure d'exécution</span>
          <span class="display-recuring-transaction__value">
            {{ recuringTransaction().executionTime ?? 'Non définie' }}
          </span>
        </div>

        @if (recuringTransaction().endDate) {
        <div class="display-recuring-transaction__row">
          <span class="display-recuring-transaction__label">Se termine le</span>
          <span class="display-recuring-transaction__value">
            {{ recuringTransaction().endDate | date : 'mediumDate' }}
          </span>
        </div>
        } @if (recuringTransaction().categoryId) {
        <div class="display-recuring-transaction__row">
          <span class="display-recuring-transaction__label">Catégorie</span>
          <span class="display-recuring-transaction__value">{{ category()?.name }}</span>
        </div>
        } @if (recuringTransaction().notes) {
        <p class="display-recuring-transaction__notes">{{ recuringTransaction().notes }}</p>
        }
      </div>

      <div class="display-recuring-transaction__actions">
        <p-button
          label="Modifier"
          icon="pi pi-pencil"
          severity="info"
          size="small"
          (onClick)="onUpdate.emit(recuringTransaction())"
        />
        <p-button
          [label]="recuringTransaction().isActive ? 'Pause' : 'Activer'"
          [icon]="recuringTransaction().isActive ? 'pi pi-pause' : 'pi pi-play'"
          severity="info"
          size="small"
          (onClick)="onChangeStatus.emit(recuringTransaction())"
        />
      </div>
    </p-card>
  `,
  styleUrl: './display-recuring-transaction.scss',
})
export class DisplayRecuringTransaction {
  readonly transactionService = inject(TransactionService);

  readonly recuringTransaction = input.required<RecuringTransaction>();
  readonly currency = input.required<string>();
  readonly categories = input.required<Category[]>();
  readonly onUpdate = output<RecuringTransaction>();
  readonly onChangeStatus = output<RecuringTransaction>();

  category = computed(() =>
    this.categories().find((category) => category.id === this.recuringTransaction().categoryId)
  );
}
