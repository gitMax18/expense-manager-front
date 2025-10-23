import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { AuthForm } from '../../components/auth-form/auth-form';
import { AuthRequest } from '../../types';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../user-store';

@Component({
  selector: 'app-register-page',
  imports: [Card, AuthForm, RouterLink],
  template: `
    <div class="container">
      <p-card>
        <ng-template #title>Register</ng-template>
        <app-auth-form
          [isLoading]="userStore.isLoading()"
          [serverError]="userStore.error()"
          [serverMessage]="userStore.message()"
          [serverErrorDetails]="userStore.errorDetails()"
          (onSubmit)="handleSubmit($event)"
        ></app-auth-form>
        <ng-template #footer>
          <span>Already have an account <a routerLink="/auth/login">Login</a></span>
        </ng-template>
      </p-card>
    </div>
  `,
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  userStore = inject(UserStore);

  handleSubmit(authData: AuthRequest) {
    this.userStore.register(authData);
  }
}
