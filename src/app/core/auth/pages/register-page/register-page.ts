import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { AuthForm } from '../../components/auth-form/auth-form';
import { AuthService } from '../../auth-service';
import { AuthRequest, AuthResponse } from '../../types';
import { RouterLink } from '@angular/router';
import { HttpRequestStateService } from '../../../../shared/services/http-request-state.service';

@Component({
  selector: 'app-register-page',
  imports: [Card, AuthForm, RouterLink],
  template: `
    <div class="container">
      <p-card>
        <ng-template #title>Register</ng-template>
        <app-auth-form
          [isLoading]="registerState.isLoading()"
          [serverError]="registerState.error()"
          [serverMessage]="registerState.message()"
          [serverErrorDetails]="registerState.errorDetails()"
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
  authService = inject(AuthService);
  httpRequestStateService = inject(HttpRequestStateService);

  readonly registerState = this.httpRequestStateService.create<AuthResponse>();

  handleSubmit(authData: AuthRequest) {
    this.registerState.execute(() => this.authService.register(authData)).subscribe();
  }
}
