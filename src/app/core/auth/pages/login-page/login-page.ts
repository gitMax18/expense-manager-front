import { AuthRequest } from './../../types';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AuthForm } from '../../components/auth-form/auth-form';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../user-store';

@Component({
  selector: 'app-login-page',
  imports: [CardModule, AuthForm, RouterLink],
  template: `
    <div class="container">
      <p-card>
        <ng-template #title>Login</ng-template>
        <app-auth-form
          [isLoading]="userStore.isLoading()"
          [serverError]="userStore.error()"
          [serverMessage]="userStore.message()"
          [serverErrorDetails]="userStore.errorDetails()"
          (onSubmit)="handleSubmit($event)"
        ></app-auth-form>
        <ng-template #footer>
          <span>Don't have an account? <a routerLink="/auth/register">Register</a></span>
        </ng-template>
      </p-card>
    </div>
  `,
  styleUrl: './login-page.scss',
})
export class LoginPage {
  userStore = inject(UserStore);

  handleSubmit(authData: AuthRequest) {
    this.userStore.login(authData);
  }
}
