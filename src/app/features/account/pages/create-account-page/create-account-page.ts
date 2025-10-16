import { Component, inject } from '@angular/core';
import { CreateAccountForm } from '../../components/create-account-form/create-account-form';
import { CreateAccountRequest } from '../../types';
import { AccountService } from '../../account-service';

@Component({
  selector: 'app-create-account-page',
  imports: [CreateAccountForm],
  template: `
    <div>
      <h1>Create new account</h1>
      <app-create-account-form (onSubmit)="handleSubmit($event)" />
    </div>
  `,
  styleUrl: './create-account-page.scss',
})
export class CreateAccountPage {
  accountService = inject(AccountService);

  handleSubmit(createAccountRequest: CreateAccountRequest) {
    this.accountService.createAccount(createAccountRequest).subscribe({
      next: (response) => {
        console.log('Account created successfully', response);
      },
      error: (error) => {
        console.error('Error creating account', error);
      },
    });
  }
}
