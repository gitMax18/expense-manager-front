import { Account } from './../../types';
import { AccountService } from './../../account-service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DisplayAccount } from '../../components/display-account/display-account';
import { accountStore } from '../../account-store';

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
        @for (account of accountStore.entities(); track account.id) {
        <app-display-account
          (onDelete)="handleDeleteAccount($event)"
          (onUpdate)="handleUpdateAccount($event)"
          (onViewTransactions)="handleViewTransactions($event)"
          [account]="account"
          [isDeleteLoading]="accountStore.isLoading()"
        />
        }
      </div>
    </div>
  `,
  styleUrl: './account-page.scss',
})
export class AccountPage {
  router = inject(Router);
  accountStore = inject(accountStore);
  accountService = inject(AccountService);

  ngOnInit() {
    this.accountStore.resetStatus();
  }

  handleClickCreateAccount() {
    this.router.navigate(['/accounts/create']);
  }

  handleUpdateAccount(account: Account) {
    this.accountStore.setSelectedId(account.id);
    this.router.navigate([`/accounts/${account.id}/update`]);
  }

  handleDeleteAccount(accountId: number) {
    this.accountStore.removeAccount(accountId);
  }

  handleViewTransactions(accountId: number) {
    this.accountStore.setSelectedId(accountId);
    void this.router.navigate([`/accounts/${accountId}/transactions`]);
  }
}
