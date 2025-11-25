import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  DayOfWeek,
  RecuringTransaction,
  RecurrenceFrequency,
  UpsertRecuringTransaction,
} from './types';
import { environment } from '../../../environments/environment';
import { SelectOption, SuccessResponse } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class RecuringTransactionService {
  http = inject(HttpClient);

  getRecuringTransactionsByAccount(accountId: number) {
    const params = new HttpParams().set('accountId', accountId);

    return this.http.get<SuccessResponse<RecuringTransaction[]>>(
      `${environment.apiUrl}/recuring-transactions`,
      {
        params,
      }
    );
  }

  createRecuringTransaction(recuringTransaction: UpsertRecuringTransaction) {
    return this.http.post<SuccessResponse<RecuringTransaction>>(
      `${environment.apiUrl}/recuring-transactions`,
      recuringTransaction
    );
  }

  getFrequencyOptions(): SelectOption<RecurrenceFrequency>[] {
    return [
      { label: 'Daily', value: RecurrenceFrequency.DAILY },
      { label: 'Weekly', value: RecurrenceFrequency.WEEKLY },
      { label: 'Monthly', value: RecurrenceFrequency.MONTHLY },
      { label: 'Yearly', value: RecurrenceFrequency.YEARLY },
    ];
  }
  getDayOfWeekOptions(): SelectOption<DayOfWeek>[] {
    return [
      { label: 'Monday', value: DayOfWeek.MONDAY },
      { label: 'Tuesday', value: DayOfWeek.TUESDAY },
      { label: 'Wednesday', value: DayOfWeek.WEDNESDAY },
      { label: 'Thursday', value: DayOfWeek.THURSDAY },
      { label: 'Friday', value: DayOfWeek.FRIDAY },
      { label: 'Saturday', value: DayOfWeek.SATURDAY },
      { label: 'Sunday', value: DayOfWeek.SUNDAY },
    ];
  }
}
