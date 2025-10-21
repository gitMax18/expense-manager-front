import { Component, computed, inject, input } from '@angular/core';
import { Account, UpsertAccountRequest } from '../../types';
import { AccountService } from '../../account-service';
import { HttpRequestStateService } from '../../../../shared/services/http-request-state.service';
import { UpsertAccountForm } from '../../components/upsert-account-form/upsert-account-form';

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
        [isLoading]="isLoading()"
        [serverError]="serverError()"
        [serverMessage]="serverMessage()"
        [serverErrorDetails]="serverErrorDetails()"
      />
    </div>
  `,
  styleUrl: './upsert-account-page.scss',
})
export class UpsertAccountPage {
  account = input<Account | null>(null);
  accountService = inject(AccountService);
  httpRequestStateService = inject(HttpRequestStateService);
  title = computed(() => (this.account() ? 'Update Account' : 'Create new Account'));

  isLoading = computed(
    () => this.createAccountState.isLoading() || this.updateAccountState.isLoading()
  );
  serverError = computed(() => this.createAccountState.error() || this.updateAccountState.error());
  serverMessage = computed(
    () => this.createAccountState.message() || this.updateAccountState.message()
  );
  serverErrorDetails = computed(
    () => this.createAccountState.errorDetails() || this.updateAccountState.errorDetails()
  );

  readonly createAccountState = this.httpRequestStateService.create<Account>();
  readonly updateAccountState = this.httpRequestStateService.create<Account>();

  handleSubmit(upsertAccountRequest: UpsertAccountRequest) {
    this.createAccountState.reset();
    this.updateAccountState.reset();
    if (this.account()) {
      this.updateAccountState
        .execute(() => this.accountService.updateAccount(this.account()!.id, upsertAccountRequest))
        .subscribe();
    } else {
      this.createAccountState
        .execute(() => this.accountService.createAccount(upsertAccountRequest))
        .subscribe();
    }
  }
}
