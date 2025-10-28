import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FormItem } from '../../../../shared/components/form/form-item/form-item';
import { FormLabel } from '../../../../shared/components/form/form-label/form-label';
import { FormError } from '../../../../shared/components/form/form-error/form-error';
import { DisplayServerResponse } from '../../../../shared/components/display-server-response/display-server-response';
import { Transaction, TransactionType, UpsertTransaction } from '../../types';
import { SelectOption } from '../../../../shared/types';
import { HttpState } from '../../../../shared/abstract/http-state/http-state';
import { accountStore } from '../../../account/account-store';
import { categoryStore } from '../../../category/category-store';

@Component({
  selector: 'app-upsert-transaction-form',
  imports: [
    ReactiveFormsModule,
    FormItem,
    FormLabel,
    FormError,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    DisplayServerResponse,
  ],
  template: `
    <form [formGroup]="transactionForm" (ngSubmit)="handleSubmit()">
      <div class="upsert-transaction-form__grid">
        <app-form-item>
          <app-form-label for="amount">Montant</app-form-label>
          <p-inputNumber
            inputId="amount"
            formControlName="amount"
            mode="decimal"
            [minFractionDigits]="2"
            [useGrouping]="false"
            [min]="0.01"
          ></p-inputNumber>
          <app-form-error
            [control]="transactionForm.controls['amount']"
            fieldName="Amount"
            [errorDetails]="serverErrorDetails()"
          />
        </app-form-item>
        <app-form-item>
          <app-form-label for="type">Type</app-form-label>
          <p-select
            inputId="type"
            formControlName="type"
            [options]="transactionTypeOptions"
            optionLabel="label"
            optionValue="value"
          ></p-select>
          <app-form-error
            [control]="transactionForm.controls['type']"
            fieldName="Type"
            [errorDetails]="serverErrorDetails()"
          />
        </app-form-item>
      </div>

      <app-form-item>
        <app-form-label for="label">Libellé</app-form-label>
        <input id="label" type="text" formControlName="label" pInputText />
        <app-form-error
          [control]="transactionForm.controls['label']"
          fieldName="Label"
          [errorDetails]="serverErrorDetails()"
        />
      </app-form-item>

      <div class="upsert-transaction-form__grid">
        <app-form-item>
          <app-form-label for="merchant">Commerçant</app-form-label>
          <input id="merchant" type="text" formControlName="merchant" pInputText />
        </app-form-item>

        <app-form-item>
          <app-form-label for="categoryId">Catégorie</app-form-label>
          <p-select
            inputId="categoryId"
            formControlName="categoryId"
            [options]="categoryStore.entities()"
            optionLabel="name"
            optionValue="id"
            showClear="true"
            placeholder="Choose category"
          ></p-select>
        </app-form-item>
      </div>

      <app-form-item>
        <app-form-label for="notes">Notes</app-form-label>
        <textarea id="notes" rows="3" formControlName="notes" pTextarea></textarea>
      </app-form-item>

      <app-display-server-response [error]="serverError()" [message]="serverMessage()" />

      <p-button
        type="submit"
        [label]="btnLabel()"
        [disabled]="transactionForm.invalid || isLoading()"
        [loading]="isLoading()"
      />
    </form>
  `,
  styleUrl: './upsert-transaction-form.scss',
})
export class UpsertTransactionForm extends HttpState {
  transaction = input<Transaction | null>(null);
  onSubmit = output<UpsertTransaction>();

  readonly accountStore = inject(accountStore);
  readonly categoryStore = inject(categoryStore);

  readonly transactionTypeOptions: SelectOption<string>[] = Object.entries(TransactionType).map(
    ([key, value]) => {
      return {
        label: value.toLowerCase().replaceAll('_', ' '),
        value: key,
      };
    }
  );

  readonly btnLabel = computed(() => (this.transaction() ? 'Mettre à jour' : 'Créer'));

  readonly transactionForm = new FormGroup({
    accountId: new FormControl<number | null>(this.accountStore.selectedId(), {
      validators: [Validators.required],
    }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    type: new FormControl<TransactionType>(TransactionType.EXPENSE, {
      validators: [Validators.required],
    }),
    label: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    merchant: new FormControl(''),
    categoryId: new FormControl<number | null>(null),
    notes: new FormControl(''),
  });

  constructor() {
    super();
    effect(() => {
      if (!this.categoryStore.entities().length && !this.categoryStore.isLoading()) {
        this.categoryStore.getUserCategories();
      }
    });

    effect(() => {
      if (this.transaction()) {
        this.transactionForm.patchValue({
          accountId: this.transaction()!.account.id,
          amount: this.transaction()!.amount,
          type: this.transaction()!.type,
          label: this.transaction()!.label,
          merchant: this.transaction()!.merchant ?? '',
          categoryId: this.transaction()!.categoryId ?? null,
          notes: this.transaction()!.notes ?? '',
        });
      } else {
        this.transactionForm.reset({
          accountId: this.accountStore.selectedId(),
          amount: null,
          type: TransactionType.EXPENSE,
          label: '',
          merchant: '',
          categoryId: null,
          notes: '',
        });
      }
    });
  }

  handleSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.onSubmit.emit(this.transactionForm.value as UpsertTransaction);
  }
}
