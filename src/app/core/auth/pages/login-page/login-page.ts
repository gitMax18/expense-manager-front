import { AuthRequest } from './../../types';
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
        <app-auth-form (onSubmit)="handleSubmit($event)"></app-auth-form>
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

  handleSubmit(authData: AuthRequest) {
    this.authService.login(authData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
