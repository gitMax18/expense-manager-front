import { Component, inject, output, signal } from '@angular/core';
import { accountStore } from '../../../account/account-store';
import { ButtonModule } from 'primeng/button';
import { UpsertRecuringTransactionForm } from '../../components/upsert-recuring-transaction-form/upsert-recuring-transaction-form';
import { recuringTransactionStore } from '../../recuring-transaction-store';
import { UpsertRecuringTransaction } from '../../types';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recuring-transaction-page',
  imports: [ButtonModule, UpsertRecuringTransactionForm],
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
    <section class="transaction-page__form">
      <app-upsert-recuring-transaction-form
        [isLoading]="recuringTransactionStore.isLoading()"
        [serverError]="recuringTransactionStore.error()"
        [serverMessage]="recuringTransactionStore.message()"
        [serverErrorDetails]="recuringTransactionStore.errorDetails()"
        (onSubmit)="handleSubmit($event)"
      />
      <div class="transaction-page__form-actions">
        <p-button label="Annuler" severity="danger" (onClick)="handleCancel()" />
      </div>
    </section>
    }
  `,
  styleUrl: './recuring-transaction-page.scss',
})
export class RecuringTransactionPage {
  readonly accountStore = inject(accountStore);
  readonly recuringTransactionStore = inject(recuringTransactionStore);
  readonly isFormVisible = signal(false);

  handleCreateRecuringTransaction() {
    this.isFormVisible.set(true);
  }

  handleCancel() {
    this.isFormVisible.set(false);
  }

  handleSubmit(recuringTransaction: UpsertRecuringTransaction) {
    this.recuringTransactionStore.addRecuringTransaction(recuringTransaction);
  }
}
