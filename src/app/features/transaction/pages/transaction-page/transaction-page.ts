import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { transactionStore } from '../../transaction-store';
import { UpsertTransactionForm } from '../../components/upsert-transaction-form/upsert-transaction-form';
import { DisplayTransaction } from '../../components/display-transaction/display-transaction';
import { Transaction, UpsertTransaction } from '../../types';
import { accountStore } from '../../../account/account-store';
import { categoryStore } from '../../../category/category-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-page',
  host: {
    class: 'transaction-page',
  },
  imports: [CommonModule, ButtonModule, UpsertTransactionForm, DisplayTransaction],
  template: `
    <section class="transaction-page__header">
      <div>
        <h1 class="transaction-page__title">Transactions</h1>
        @if (accountStore.selectedAccount()) {
        <div class="transaction-page__account">
          Compte : {{ accountStore.selectedAccount()!.name }}
        </div>
        <div>
          Amount :
          {{
            accountStore.selectedAccount()!.balance
              | currency : accountStore.selectedAccount()!.currency
          }}
        </div>
        }
      </div>
      <p-button
        label="New Transaction"
        icon="pi pi-plus"
        severity="success"
        [disabled]="isFormVisible()"
        (onClick)="handleCreateTransaction()"
      />
      <p-button
        label="Recuring transaction"
        icon="pi pi-plus"
        severity="info"
        [disabled]="isFormVisible()"
        (onClick)="showRecuringTransactions()"
      />
    </section>

    @if (isFormVisible()) {
    <section class="transaction-page__form">
      <app-upsert-transaction-form
        [transaction]="transactionStore.selectedTransaction()"
        [isLoading]="transactionStore.isLoading()"
        [serverError]="transactionStore.error()"
        [serverMessage]="transactionStore.message()"
        [serverErrorDetails]="transactionStore.errorDetails()"
        (onSubmit)="handleSubmit($event)"
      />
      <div class="transaction-page__form-actions">
        <p-button label="Annuler" severity="danger" (onClick)="handleCancel()" />
      </div>
    </section>
    }

    <p class="transaction-page__meta">
      {{ transactionStore.transactionCount() }} transaction{{
        transactionStore.transactionCount() > 1 ? 's' : ''
      }}
    </p>
    <section class="transaction-page__list">
      @if (!transactions().length && !transactionStore.isLoading() && !isFormVisible()) {
      <p class="transaction-page__empty">Aucune transaction pour ce compte.</p>
      } @else { @for (transaction of transactions(); track transaction.id) {
      <app-display-transaction
        [categories]="categoryStore.entities()"
        [transaction]="transaction"
        [currency]="this.accountStore.selectedAccount()?.currency || 'EUR'"
        (onUpdate)="handleEditTransaction($event)"
        (onDelete)="handleDeleteTransaction($event)"
      />
      } }
    </section>
  `,
  styleUrl: './transaction-page.scss',
})
export class TransactionPage {
  readonly accountStore = inject(accountStore);
  readonly categoryStore = inject(categoryStore);
  readonly transactionStore = inject(transactionStore);
  readonly router = inject(Router);

  readonly transactions = computed(() => {
    return this.transactionStore
      .entities()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
  readonly isFormVisible = signal(false);

  constructor() {
    effect(() => {
      if (!this.categoryStore.isLoaded()) {
        this.categoryStore.getUserCategories();
      }
    });
    effect(() => {
      if (this.transactionStore.isSuccess()) {
        this.transactionStore.resetStatus();
        this.transactionStore.setSelectedId(null);
        this.isFormVisible.set(false);
      }
    });
  }

  ngOnInit() {
    this.transactionStore.resetStatus();
  }

  handleSubmit(request: UpsertTransaction) {
    if (this.transactionStore.selectedTransaction()) {
      this.transactionStore.updateTransaction(request);
      return;
    }

    this.transactionStore.addTransaction(request);
  }

  handleCreateTransaction() {
    this.transactionStore.resetStatus();
    this.transactionStore.setSelectedId(null);
    this.isFormVisible.set(true);
  }

  handleEditTransaction(transaction: Transaction) {
    this.transactionStore.resetStatus();
    this.transactionStore.setSelectedId(transaction.id);
    this.isFormVisible.set(true);
  }

  handleDeleteTransaction(transactionId: number) {
    this.transactionStore.removeTransaction(transactionId);
  }

  handleCancel() {
    this.transactionStore.resetStatus();
    this.transactionStore.setSelectedId(null);
    this.isFormVisible.set(false);
  }

  showRecuringTransactions() {
    this.router.navigate([
      `/accounts/${this.accountStore.selectedAccount()?.id}/recurring-transactions`,
    ]);
  }
}
