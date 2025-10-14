import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { AuthForm } from '../../components/auth-form/auth-form';
import { AuthService } from '../../auth-service';
import { AuthRequest } from '../../types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [Card, AuthForm, RouterLink],
  template: `
    <div class="container">
      <p-card>
        <ng-template #title>Register</ng-template>
        <app-auth-form (onSubmit)="handleSubmit($event)"></app-auth-form>
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

  handleSubmit(authData: AuthRequest) {
    this.authService.register(authData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
