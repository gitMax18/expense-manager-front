import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-account-page',
  imports: [ButtonModule],
  template: `
    <div>
      <p-button
        (onClick)="handleClickCreateAccount()"
        label="Create Account"
        icon="pi pi-plus"
        severity="success"
      />
    </div>
  `,
  styleUrl: './account-page.scss',
})
export class AccountPage {
  router = inject(Router);
  handleClickCreateAccount() {
    this.router.navigate(['/accounts/create']);
  }
}
