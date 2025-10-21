import { Account } from './../../types';
import { AccountService } from './../../account-service';
import { HttpRequestStateService } from './../../../../shared/services/http-request-state.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DisplayAccount } from '../../components/display-account/display-account';

@Component({
  selector: 'app-account-page',
  imports: [ButtonModule, DisplayAccount],
  template: `
    <div>
      <p-button
        (onClick)="handleClickCreateAccount()"
        label="Create Account"
        icon="pi pi-plus"
        severity="success"
      />
      <div class="account-page__list">
        @for (account of getUserAccountsState.data(); track account.id) {
        <app-display-account
          (onDelete)="handleDeleteAccount($event)"
          (onUpdate)="handleUpdateAccount($event)"
          [account]="account"
          [isDeleteLoading]="deleteAccountState.isLoading()"
        />
        }
      </div>
    </div>
  `,
  styleUrl: './account-page.scss',
})
export class AccountPage {
  router = inject(Router);
  httpRequestStateService = inject(HttpRequestStateService);
  accountService = inject(AccountService);

  getUserAccountsState = this.httpRequestStateService.create<Account[]>();
  deleteAccountState = this.httpRequestStateService.create<null>();

  ngOnInit() {
    this.getUserAccountsState.execute(() => this.accountService.getUserAccounts()).subscribe();
  }

  handleClickCreateAccount() {
    this.router.navigate(['/accounts/create']);
  }

  handleUpdateAccount(account: Account) {
    this.router.navigate([`/accounts/${account.id}/update`]);
  }

  handleDeleteAccount(accountId: string) {
    this.deleteAccountState
      .execute(() => this.accountService.deleteAccountById(accountId))
      .subscribe();
  }
}
