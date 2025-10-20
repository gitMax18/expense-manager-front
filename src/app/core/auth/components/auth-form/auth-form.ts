import { Component, input, output } from '@angular/core';
import { FormItem } from '../../../../shared/components/form/form-item/form-item';
import { FormLabel } from '../../../../shared/components/form/form-label/form-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormError } from '../../../../shared/components/form/form-error/form-error';
import { AuthRequest } from '../../types';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DisplayServerResponse } from '../../../../shared/components/display-server-response/display-server-response';
import { HttpState } from '../../../../shared/abstract/http-state/http-state';

@Component({
  selector: 'app-auth-form',
  imports: [
    FormItem,
    FormLabel,
    ReactiveFormsModule,
    FormError,
    ButtonModule,
    InputTextModule,
    DisplayServerResponse,
  ],
  template: `
    <form [formGroup]="authForm" (ngSubmit)="handleSubmit()">
      <app-form-item>
        <app-form-label for="email">Email</app-form-label>
        <input type="text" pInputText id="email" formControlName="email" />
        <app-form-error
          [errorDetails]="serverErrorDetails()"
          fieldName="Email"
          [control]="authForm.controls['email']"
        ></app-form-error>
      </app-form-item>
      <app-form-item>
        <app-form-label for="password">Password</app-form-label>
        <input type="password" pInputText id="password" formControlName="password" />
        <app-form-error
          [errorDetails]="serverErrorDetails()"
          fieldName="password"
          [control]="authForm.controls['password']"
        ></app-form-error>
      </app-form-item>
      <app-display-server-response [error]="serverError()" [message]="serverMessage()" />
      <p-button
        [loading]="isLoading()"
        type="submit"
        label="submit"
        [disabled]="authForm.invalid"
      ></p-button>
    </form>
  `,
  styleUrl: './auth-form.scss',
})
export class AuthForm extends HttpState {
  onSubmit = output<AuthRequest>();

  authForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  });

  handleSubmit() {
    if (this.authForm.valid) {
      this.onSubmit.emit(this.authForm.value as AuthRequest);
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
