import { Component, computed, inject, input } from '@angular/core';
import { Account, UpsertAccountRequest } from '../../types';
import { UpsertAccountForm } from '../../components/upsert-account-form/upsert-account-form';
import { Router } from '@angular/router';
import { accountStore } from '../../account-store';

@Component({
  selector: 'app-upsert-account-page',
  host: {
    class: 'create-account-page',
  },
  imports: [UpsertAccountForm],
  template: `
    <div>
      <h1>{{ title() }}</h1>
      <app-upsert-account-form
        [account]="account()"
        (onSubmit)="handleSubmit($event)"
        [isLoading]="accountStore.isLoading()"
        [serverError]="accountStore.error()"
        [serverMessage]="accountStore.message()"
        [serverErrorDetails]="accountStore.errorDetails()"
      />
    </div>
  `,
  styleUrl: './upsert-account-page.scss',
})
export class UpsertAccountPage {
  accountStore = inject(accountStore);
  route = inject(Router);

  account = input<Account | null>(null);
  title = computed(() => (this.account() ? 'Update Account' : 'Create new Account'));

  ngOnInit() {
    this.accountStore.resetStatus();
  }

  handleSubmit(upsertAccountRequest: UpsertAccountRequest) {
    if (this.account()) {
      this.accountStore.updateAccount(upsertAccountRequest);
    } else {
      this.accountStore.addAccount(upsertAccountRequest);
    }
  }
}
