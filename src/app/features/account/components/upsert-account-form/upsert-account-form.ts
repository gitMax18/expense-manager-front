import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormItem } from '../../../../shared/components/form/form-item/form-item';
import { FormLabel } from '../../../../shared/components/form/form-label/form-label';
import { FormError } from '../../../../shared/components/form/form-error/form-error';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Account, AccountType, UpsertAccountRequest } from '../../types';
import { SelectOption } from '../../../../shared/types';
import { DisplayServerResponse } from '../../../../shared/components/display-server-response/display-server-response';
import { HttpState } from '../../../../shared/abstract/http-state/http-state';

@Component({
  selector: 'app-upsert-account-form',
  imports: [
    FormItem,
    FormLabel,
    FormError,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    DisplayServerResponse,
  ],
  template: `
    <form [formGroup]="accountForm" (ngSubmit)="handleSubmit()">
      <app-form-item>
        <app-form-label for="name">Name</app-form-label>
        <input id="name" type="text" formControlName="name" pInputText />
        <app-form-error
          [errorDetails]="serverErrorDetails()"
          fieldName="Name"
          [control]="accountForm.controls['name']"
        />
      </app-form-item>

      <app-form-item>
        <app-form-label for="description">Description</app-form-label>
        <textarea id="description" rows="3" formControlName="description" pTextarea></textarea>
      </app-form-item>

      <div class="group">
        <div class="group__left">
          <app-form-item>
            <app-form-label for="balance">Balance</app-form-label>
            <p-inputNumber
              inputId="balance"
              formControlName="balance"
              mode="decimal"
              [min]="0"
              [useGrouping]="false"
            ></p-inputNumber>
            <app-form-error
              [errorDetails]="serverErrorDetails()"
              fieldName="Balance"
              [control]="accountForm.controls['balance']"
            />
          </app-form-item>
        </div>
        <div class="group__right">
          <app-form-item>
            <app-form-label for="currency">Currency</app-form-label>
            <p-select
              inputId="currency"
              formControlName="currency"
              [options]="currencyOptions()"
              optionLabel="label"
              optionValue="value"
            ></p-select>
            <app-form-error
              [errorDetails]="serverErrorDetails()"
              fieldName="Currency"
              [control]="accountForm.controls['currency']"
            />
          </app-form-item>
          <app-form-item>
            <app-form-label for="type">Account type</app-form-label>
            <p-select
              inputId="type"
              formControlName="type"
              [options]="accountTypeOptions()"
              optionLabel="label"
              optionValue="value"
            ></p-select>
            <app-form-error
              [errorDetails]="serverErrorDetails()"
              fieldName="Type"
              [control]="accountForm.controls['type']"
            />
          </app-form-item>
        </div>
      </div>
      <app-display-server-response [error]="serverError()" [message]="serverMessage()" />
      <p-button
        type="submit"
        [label]="btnLabel()"
        [disabled]="accountForm.invalid || isLoading()"
        [loading]="isLoading()"
      ></p-button>
    </form>
  `,
  styleUrl: './upsert-account-form.scss',
})
export class UpsertAccountForm extends HttpState {
  account = input<Account | null>(null);
  onSubmit = output<UpsertAccountRequest>();
  isUpdate = computed(() => this.account() != null);
  btnLabel = computed(() => (this.isUpdate() ? 'Update account' : 'Create account'));

  constructor() {
    super();
    console.log('CreateAccountForm initialized with account :', this.account());
    effect(() => {
      if (this.account()) {
        this.accountForm.patchValue({
          name: this.account()!.name,
          description: this.account()!.description || '',
          balance: this.account()!.balance,
          currency: this.account()!.currency,
          type: this.account()!.type,
        });
      }
    });
  }

  readonly currencyOptions = signal<SelectOption<string>[]>([
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Franc Pacifique (XPF)', value: 'XPF' },
  ]);

  readonly accountTypeOptions = signal<SelectOption<AccountType>[]>([
    { label: 'Checking', value: AccountType.CHECKING },
    { label: 'Savings', value: AccountType.SAVINGS },
    { label: 'Investment', value: AccountType.INVESTMENT },
  ]);

  readonly accountForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl(''),
    balance: new FormControl(0, {
      validators: [Validators.required, Validators.min(0)],
    }),
    currency: new FormControl(this.currencyOptions()[0].value, {
      validators: [Validators.required],
    }),
    type: new FormControl(this.accountTypeOptions()[0].value, {
      validators: [Validators.required],
    }),
  });

  handleSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.onSubmit.emit(this.accountForm.value as UpsertAccountRequest);
  }
}
