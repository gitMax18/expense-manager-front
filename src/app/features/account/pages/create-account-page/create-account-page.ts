import { Component, inject } from '@angular/core';
import { CreateAccountForm } from '../../components/create-account-form/create-account-form';
import { Account, CreateAccountRequest } from '../../types';
import { AccountService } from '../../account-service';
import { HttpRequestStateService } from '../../../../shared/services/http-request-state.service';

@Component({
  selector: 'app-create-account-page',
  host: {
    class: 'create-account-page',
  },
  imports: [CreateAccountForm],
  template: `
    <div>
      <h1>Create new account</h1>
      <app-create-account-form
        (onSubmit)="handleSubmit($event)"
        [isLoading]="createAccountState.isLoading()"
        [serverError]="createAccountState.error()"
        [serverMessage]="createAccountState.message()"
        [serverErrorDetails]="createAccountState.errorDetails()"
      />
    </div>
  `,
  styleUrl: './create-account-page.scss',
})
export class CreateAccountPage {
  accountService = inject(AccountService);
  httpRequestStateService = inject(HttpRequestStateService);
  readonly createAccountState = this.httpRequestStateService.create<Account>();

  handleSubmit(createAccountRequest: CreateAccountRequest) {
    this.createAccountState
      .execute(() => this.accountService.createAccount(createAccountRequest))
      .subscribe();
  }
}
