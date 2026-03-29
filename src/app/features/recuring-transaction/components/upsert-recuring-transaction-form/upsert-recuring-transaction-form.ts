import { TransactionService } from './../../../transaction/transaction-service';
import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FormItem } from '../../../../shared/components/form/form-item/form-item';
import { FormLabel } from '../../../../shared/components/form/form-label/form-label';
import { FormError } from '../../../../shared/components/form/form-error/form-error';
import { DisplayServerResponse } from '../../../../shared/components/display-server-response/display-server-response';
import { accountStore } from '../../../account/account-store';
import { categoryStore } from '../../../category/category-store';
import { TransactionType } from '../../../transaction/types';
import { HttpState } from '../../../../shared/abstract/http-state/http-state';
import {
  DayOfWeek,
  RecurrenceFrequency,
  RecuringTransaction,
  UpsertRecuringTransaction,
} from '../../types';
import { RecuringTransactionService } from '../../recuring-transaction-service';
import AppValidators from '../../../../shared/validators/appValidators';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateTimeService } from '../../../../shared/service/DateTimeService';

@Component({
  selector: 'app-upsert-recuring-transaction-form',
  imports: [
    ReactiveFormsModule,
    FormItem,
    FormLabel,
    FormError,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    ButtonModule,
    DisplayServerResponse,
  ],
  template: `
    <form
      class="upsert-recuring-transaction-form"
      [formGroup]="recurringTransactionForm"
      (ngSubmit)="handleSubmit()"
    >
      <div class="upsert-recuring-transaction-form__grid">
        <app-form-item>
          <app-form-label for="amount">Montant</app-form-label>
          <p-inputNumber
            inputId="amount"
            formControlName="amount"
            mode="decimal"
            [useGrouping]="false"
            [minFractionDigits]="2"
            [min]="0.01"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['amount']"
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
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['type']"
            fieldName="Type"
            [errorDetails]="serverErrorDetails()"
          />
        </app-form-item>
      </div>

      <app-form-item>
        <app-form-label for="label">Libellé</app-form-label>
        <input id="label" type="text" formControlName="label" pInputText />
        <app-form-error
          [control]="recurringTransactionForm.controls['label']"
          fieldName="Label"
          [errorDetails]="serverErrorDetails()"
        />
      </app-form-item>

      <div class="upsert-recuring-transaction-form__grid">
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
            placeholder="Choisir une catégorie"
            showClear="true"
          />
        </app-form-item>
      </div>

      <app-form-item>
        <app-form-label for="notes">Notes</app-form-label>
        <textarea id="notes" rows="3" formControlName="notes" pTextarea></textarea>
      </app-form-item>

      <div class="upsert-recuring-transaction-form__grid">
        <app-form-item>
          <app-form-label for="frequency">Fréquence</app-form-label>
          <p-select
            inputId="frequency"
            formControlName="frequency"
            [options]="frequencyOptions"
            optionLabel="label"
            optionValue="value"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['frequency']"
            fieldName="Frequency"
            [errorDetails]="serverErrorDetails()"
          />
        </app-form-item>

        <app-form-item>
          <app-form-label for="startDate">Date de début</app-form-label>
          <p-datepicker
            inputId="startDate"
            formControlName="startDate"
            dateFormat="yy-mm-dd"
            showIcon="true"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['startDate']"
            fieldName="Start date"
            [errorDetails]="serverErrorDetails()"
          />
        </app-form-item>

        <app-form-item>
          <app-form-label for="endDate">Date de fin</app-form-label>
          <p-datepicker
            inputId="endDate"
            formControlName="endDate"
            dateFormat="yy-mm-dd"
            showIcon="true"
            [showClear]="true"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['endDate']"
            fieldName="End date"
            [errorDetails]="serverErrorDetails()"
          />
          @if (recurringTransactionForm.controls['endDate'].hasError('endBeforeStart')) {
          <div class="error">La date de fin doit être postérieure à la date de début.</div>
          }
        </app-form-item>
      </div>

      <div
        class="upsert-recuring-transaction-form__grid upsert-recuring-transaction-form__grid--compact"
      >
        @if (showDayOfWeek()) {
        <app-form-item>
          <app-form-label for="dayOfWeek">Jour de la semaine</app-form-label>
          <p-select
            inputId="dayOfWeek"
            formControlName="dayOfWeek"
            [options]="dayOfWeekOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Choisir un jour"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['dayOfWeek']"
            fieldName="Day of week"
            [errorDetails]="serverErrorDetails()"
          />
        </app-form-item>
        } @if (showDayOfMonth()) {
        <app-form-item>
          <app-form-label for="dayOfMonth">Jour du mois</app-form-label>
          <p-inputNumber
            inputId="dayOfMonth"
            formControlName="dayOfMonth"
            [min]="1"
            [max]="31"
            [useGrouping]="false"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['dayOfMonth']"
            fieldName="Day of month"
            [errorDetails]="serverErrorDetails()"
          />
          @if ( recurringTransactionForm.controls['dayOfMonth'].hasError('max') &&
          (recurringTransactionForm.controls['dayOfMonth'].touched ||
          recurringTransactionForm.controls['dayOfMonth'].dirty) ) {
          <div class="error">Le jour du mois doit être inférieur ou égal à 31.</div>
          }
        </app-form-item>
        } @if (showMonthOfYear()) {
        <app-form-item>
          <app-form-label for="monthOfYear">Mois de l'année</app-form-label>
          <p-inputNumber
            inputId="monthOfYear"
            formControlName="monthOfYear"
            [min]="1"
            [max]="12"
            [useGrouping]="false"
          />
          <app-form-error
            [control]="recurringTransactionForm.controls['monthOfYear']"
            fieldName="Month of year"
            [errorDetails]="serverErrorDetails()"
          />
          @if ( recurringTransactionForm.controls['monthOfYear'].hasError('max') &&
          (recurringTransactionForm.controls['monthOfYear'].touched ||
          recurringTransactionForm.controls['monthOfYear'].dirty) ) {
          <div class="error">Le mois doit être compris entre 1 et 12.</div>
          }
        </app-form-item>
        }

        <app-form-item>
          <app-form-label for="executionTime">Heure d'exécution</app-form-label>
          <p-datepicker
            inputId="executionTime"
            formControlName="executionTime"
            [timeOnly]="true"
            hourFormat="24"
            showIcon="true"
            placeholder="Choisir une heure"
          />
        </app-form-item>
      </div>

      <app-display-server-response [error]="serverError()" [message]="serverMessage()" />

      <p-button type="submit" [label]="btnLabel()" [loading]="isLoading()" />
    </form>
  `,
  styleUrl: './upsert-recuring-transaction-form.scss',
})
export class UpsertRecuringTransactionForm extends HttpState {
  readonly recuringTransaction = input<RecuringTransaction | null>(null);
  readonly onSubmit = output<UpsertRecuringTransaction>();

  readonly accountStore = inject(accountStore);
  readonly categoryStore = inject(categoryStore);
  readonly transactionService = inject(TransactionService);
  readonly recuringTransactionService = inject(RecuringTransactionService);

  readonly transactionTypeOptions = this.transactionService.getTransactionTypes();

  readonly frequencyOptions = this.recuringTransactionService.getFrequencyOptions();
  readonly dayOfWeekOptions = this.recuringTransactionService.getDayOfWeekOptions();

  readonly btnLabel = computed(() =>
    this.recuringTransaction() ? 'Mettre à jour la transaction' : 'Planifier la transaction'
  );

  readonly recurringTransactionForm = new FormGroup({
    accountId: new FormControl<number | null>(this.accountStore.selectedId(), {
      validators: [Validators.required],
    }),
    amount: new FormControl<number>(0, {
      nonNullable: true,
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
    frequency: new FormControl<RecurrenceFrequency>(RecurrenceFrequency.MONTHLY, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    startDate: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    endDate: new FormControl<Date | null>(null),
    dayOfMonth: new FormControl<number | null>(null),
    monthOfYear: new FormControl<number | null>(null),
    dayOfWeek: new FormControl<DayOfWeek | null>(null),
    executionTime: new FormControl<Date | null>(null),
  });

  readonly frequency = toSignal(this.recurringTransactionForm.controls['frequency'].valueChanges, {
    initialValue:
      this.recurringTransactionForm.controls['frequency'].value ?? RecurrenceFrequency.MONTHLY,
  });

  readonly showDayOfWeek = computed(() => this.frequency() === RecurrenceFrequency.WEEKLY);
  readonly showDayOfMonth = computed(() => {
    const freq = this.frequency();
    return freq === RecurrenceFrequency.MONTHLY || freq === RecurrenceFrequency.YEARLY;
  });
  readonly showMonthOfYear = computed(() => this.frequency() === RecurrenceFrequency.YEARLY);

  constructor() {
    super();
    effect(() => {
      if (!this.categoryStore.entities().length && !this.categoryStore.isLoading()) {
        this.categoryStore.getUserCategories();
      }
    });

    effect(() => {
      const transaction = this.recuringTransaction();
      if (transaction) {
        this.recurringTransactionForm.patchValue({
          accountId: transaction.account.id,
          amount: transaction.amount,
          type: transaction.type,
          label: transaction.label ?? '',
          merchant: transaction.merchant ?? '',
          categoryId: transaction.categoryId ?? null,
          notes: transaction.notes ?? '',
          frequency: transaction.frequency,
          startDate: new Date(transaction.startDate),
          endDate: transaction.endDate ? new Date(transaction.endDate) : null,
          dayOfMonth: transaction.dayOfMonth ?? null,
          monthOfYear: transaction.monthOfYear ?? null,
          dayOfWeek: transaction.dayOfWeek ?? null,
          executionTime: this.toDateFromTime(transaction.executionTime ?? null),
        });
      } else {
        this.recurringTransactionForm.reset({
          accountId: this.accountStore.selectedId(),
          amount: 0,
          type: TransactionType.EXPENSE,
          label: '',
          merchant: '',
          categoryId: null,
          notes: '',
          frequency: RecurrenceFrequency.MONTHLY,
          startDate: null,
          endDate: null,
          dayOfMonth: null,
          monthOfYear: null,
          dayOfWeek: null,
          executionTime: null,
        });
      }
    });

    this.recurringTransactionForm.valueChanges.subscribe(() => {
      if (
        this.recurringTransactionForm.controls['endDate'].value &&
        this.recurringTransactionForm.controls['startDate'].value
      ) {
        this.recurringTransactionForm.controls['endDate'].addValidators(
          AppValidators.validateEndDate(this.recurringTransactionForm.controls['startDate'].value!)
        );
      }
      this.recurringTransactionForm.controls['startDate'].updateValueAndValidity({
        emitEvent: false,
      });
      this.recurringTransactionForm.controls['endDate'].updateValueAndValidity({
        emitEvent: false,
      });
    });

    // this.recurringTransactionForm.controls['endDate'].addValidators(
    //   AppValidators.validateEndDate(this.recurringTransactionForm.controls['startDate'].value!)
    // );
    // this.applyFrequencyValidators(this.frequency());

    // this.recurringTransactionForm.controls['frequency'].valueChanges.subscribe((frequency) => {
    //   const normalizedFrequency = frequency ?? RecurrenceFrequency.MONTHLY;
    //   this.frequency.set(normalizedFrequency);
    //   this.applyFrequencyValidators(normalizedFrequency);
    // });

    // this.recurringTransactionForm.controls['startDate'].valueChanges.subscribe(() => {
    //   this.recurringTransactionForm.controls['endDate'].updateValueAndValidity({
    //     emitEvent: false,
    //   });
    // });
  }

  handleSubmit() {
    if (this.recurringTransactionForm.invalid) {
      this.recurringTransactionForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.recurringTransactionForm.value!,
      executionTime: DateTimeService.toTime(
        this.recurringTransactionForm.value.executionTime ?? null
      ),
      dayOfMonth: this.showDayOfMonth()
        ? this.recurringTransactionForm.value.dayOfMonth ?? null
        : null,
      monthOfYear: this.showMonthOfYear()
        ? this.recurringTransactionForm.value.monthOfYear ?? null
        : null,
      dayOfWeek: this.showDayOfWeek()
        ? this.recurringTransactionForm.value.dayOfWeek ?? null
        : null,
      isActive: true,
    };

    this.onSubmit.emit(payload as UpsertRecuringTransaction);
  }

  private toDateFromTime(time: string | null) {
    if (!time) {
      return null;
    }

    const [hours, minutes] = time.split(':').map((value) => Number(value));
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // private applyFrequencyValidators(frequency: RecurrenceFrequency) {
  //   const dayOfMonthControl = this.recurringTransactionForm.controls['dayOfMonth'];
  //   const monthOfYearControl = this.recurringTransactionForm.controls['monthOfYear'];
  //   const dayOfWeekControl = this.recurringTransactionForm.controls['dayOfWeek'];

  //   dayOfMonthControl.setValidators([
  //     Validators.min(1),
  //     Validators.max(31),
  //     ...(this.shouldIncludeDayOfMonth(frequency) ? [Validators.required] : []),
  //   ]);
  //   dayOfMonthControl.updateValueAndValidity({ emitEvent: false });

  //   monthOfYearControl.setValidators([
  //     Validators.min(1),
  //     Validators.max(12),
  //     ...(this.shouldIncludeMonthOfYear(frequency) ? [Validators.required] : []),
  //   ]);
  //   monthOfYearControl.updateValueAndValidity({ emitEvent: false });

  //   dayOfWeekControl.setValidators(
  //     this.shouldIncludeDayOfWeek(frequency) ? [Validators.required] : []
  //   );
  //   dayOfWeekControl.updateValueAndValidity({ emitEvent: false });
  // }

  // private shouldIncludeDayOfWeek(frequency: RecurrenceFrequency) {
  //   return frequency === RecurrenceFrequency.WEEKLY;
  // }

  // private shouldIncludeDayOfMonth(frequency: RecurrenceFrequency) {
  //   return frequency === RecurrenceFrequency.MONTHLY || frequency === RecurrenceFrequency.YEARLY;
  // }

  // private shouldIncludeMonthOfYear(frequency: RecurrenceFrequency) {
  //   return frequency === RecurrenceFrequency.YEARLY;
  // }
}
