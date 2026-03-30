import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { accountStore } from '../../../account/account-store';
import { categoryStore } from '../../../category/category-store';
import { DisplayRecuringTransaction } from '../../components/display-recuring-transaction/display-recuring-transaction';
import { UpsertRecuringTransactionForm } from '../../components/upsert-recuring-transaction-form/upsert-recuring-transaction-form';
import { recuringTransactionStore } from '../../recuring-transaction-store';
import { RecuringTransaction, UpsertRecuringTransaction } from '../../types';

@Component({
  selector: 'app-recuring-transaction-page',
  host: {
    class: 'recuring-transaction-page',
  },
  imports: [CommonModule, ButtonModule, UpsertRecuringTransactionForm, DisplayRecuringTransaction],
  template: `
    <section class="recuring-transaction-page__header">
      <div>
        <h1 class="recuring-transaction-page__title">Recuring-transactions</h1>
        @if (accountStore.selectedAccount()) {
        <div class="recuring-transaction-page__account">
          Compte : {{ accountStore.selectedAccount()!.name }}
        </div>
        }
      </div>
      <p-button
        label="New recuring transaction"
        icon="pi pi-plus"
        severity="success"
        [disabled]="isFormVisible()"
        (onClick)="handleCreateRecuringTransaction()"
      />
    </section>

    @if (isFormVisible()) {
    <section class="recuring-transaction-page__form">
      <app-upsert-recuring-transaction-form
        [isLoading]="recuringTransactionStore.isLoading()"
        [serverError]="recuringTransactionStore.error()"
        [serverMessage]="recuringTransactionStore.message()"
        [serverErrorDetails]="recuringTransactionStore.errorDetails()"
        [recuringTransaction]="recuringTransactionStore.selectedRecuringTransaction()"
        (onSubmit)="handleSubmit($event)"
      />
      <div class="recuring-transaction-page__form-actions">
        <p-button label="Annuler" severity="danger" (onClick)="handleCancel()" />
      </div>
    </section>
    }

    <p class="recuring-transaction-page__meta">
      {{ recuringTransactionStore.recuringTransactionCount() }} transaction{{
        recuringTransactionStore.recuringTransactionCount() > 1 ? 's' : ''
      }}
    </p>

    <section class="recuring-transaction-page__list">
      @if (!recuringTransactions().length && !recuringTransactionStore.isLoading() &&
      !isFormVisible()) {
      <p class="recuring-transaction-page__empty">Aucune transaction récurrente pour ce compte.</p>
      } @else { @for (transaction of recuringTransactions(); track transaction.id) {
      <app-display-recuring-transaction
        [recuringTransaction]="transaction"
        [categories]="categoryStore.entities()"
        [currency]="currency()"
        (onUpdate)="handleEditRecuringTransaction($event)"
        (onChangeStatus)="handleChangeStatusRecuringTransaction($event)"
      />
      } }
    </section>
  `,
  styleUrl: './recuring-transaction-page.scss',
})
export class RecuringTransactionPage {
  readonly accountStore = inject(accountStore);
  readonly categoryStore = inject(categoryStore);
  readonly recuringTransactionStore = inject(recuringTransactionStore);
  readonly isFormVisible = signal(false);
  readonly recuringTransactions = computed(() => {
    return [...this.recuringTransactionStore.entities()].sort((a, b) => {
      const aDate = new Date(a.nextExecutionDate ?? a.startDate).getTime();
      const bDate = new Date(b.nextExecutionDate ?? b.startDate).getTime();
      return bDate - aDate;
    });
  });
  readonly currency = computed(() => this.accountStore.selectedAccount()?.currency ?? 'EUR');

  constructor() {
    effect(() => {
      if (!this.categoryStore.entities().length && !this.categoryStore.isLoading()) {
        this.categoryStore.getUserCategories();
      }
    });
    effect(() => {
      if (this.recuringTransactionStore.isSuccess()) {
        this.recuringTransactionStore.resetStatus();
        this.recuringTransactionStore.setSelectedId(null);
        this.isFormVisible.set(false);
      }
    });
  }

  ngOnInit() {
    this.recuringTransactionStore.loadAccountRecuringTransactions(this.accountStore.selectedId()!);
  }

  handleCreateRecuringTransaction() {
    this.recuringTransactionStore.resetStatus();
    this.recuringTransactionStore.setSelectedId(null);
    this.isFormVisible.set(true);
  }

  handleCancel() {
    this.recuringTransactionStore.resetStatus();
    this.recuringTransactionStore.setSelectedId(null);
    this.isFormVisible.set(false);
  }

  handleSubmit(recuringTransaction: UpsertRecuringTransaction) {
    if (this.recuringTransactionStore.selectedRecuringTransaction()) {
      this.recuringTransactionStore.updateRecuringTransaction(recuringTransaction);
      return;
    }

    this.recuringTransactionStore.addRecuringTransaction(recuringTransaction);
  }

  handleEditRecuringTransaction(recuringTransaction: RecuringTransaction) {
    this.recuringTransactionStore.resetStatus();
    this.recuringTransactionStore.setSelectedId(recuringTransaction.id);
    this.isFormVisible.set(true);
  }

  handleChangeStatusRecuringTransaction(recuringTransaction: RecuringTransaction) {
    this.recuringTransactionStore.resetStatus();
    this.recuringTransactionStore.setSelectedId(recuringTransaction.id);
    this.recuringTransactionStore.changeStatusRecuringTransaction(recuringTransaction);
  }
}
