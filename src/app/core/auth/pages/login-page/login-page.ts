import { HttpRequestStateService } from './../../../../shared/services/http-request-state.service';
import { AuthRequest, AuthResponse } from './../../types';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AuthForm } from '../../components/auth-form/auth-form';
import { AuthService } from '../../auth-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CardModule, AuthForm, RouterLink],
  template: `
    <div class="container">
      <p-card>
        <ng-template #title>Login</ng-template>
        <app-auth-form
          [isLoading]="loginState.isLoading()"
          [serverError]="loginState.error()"
          [serverMessage]="loginState.message()"
          [serverErrorDetails]="loginState.errorDetails()"
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
  authService = inject(AuthService);
  HttpRequestStateService = inject(HttpRequestStateService);

  readonly loginState = this.HttpRequestStateService.create<AuthResponse>();

  handleSubmit(authData: AuthRequest) {
    this.loginState.execute(() => this.authService.login(authData)).subscribe();
  }
}
