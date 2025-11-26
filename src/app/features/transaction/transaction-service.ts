import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataType, SelectOption, SuccessResponse } from '../../shared/types';
import { Transaction, TransactionType, UpsertTransaction } from './types';
import { Account } from '../account/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly http = inject(HttpClient);

  private readonly typeSeverities: Record<TransactionType, DataType> = {
    [TransactionType.EXPENSE]: 'danger',
    [TransactionType.INCOME]: 'success',
    [TransactionType.TRANSFER_IN]: 'info',
    [TransactionType.TRANSFER_OUT]: 'warning',
  };

  createTransaction(request: UpsertTransaction) {
    return this.http.post<SuccessResponse<Transaction>>(
      `${environment.apiUrl}/transactions`,
      request
    );
  }

  updateTransaction(transactionId: number, request: UpsertTransaction) {
    return this.http.put<SuccessResponse<Transaction>>(
      `${environment.apiUrl}/transactions/${transactionId}`,
      request
    );
  }

  getTransactionsByAccount(accountId: number) {
    const params = new HttpParams().set('accountId', accountId);

    return this.http.get<SuccessResponse<Transaction[]>>(`${environment.apiUrl}/transactions`, {
      params,
    });
  }

  getTransactionById(id: number) {
    return this.http.get<SuccessResponse<Transaction>>(`${environment.apiUrl}/transactions/${id}`);
  }

  deleteTransactionById(id: number) {
    return this.http.delete<SuccessResponse<Account>>(`${environment.apiUrl}/transactions/${id}`);
  }

  isTransactionOut(transaction: Transaction) {
    if (
      transaction.type === TransactionType.EXPENSE ||
      transaction.type === TransactionType.TRANSFER_OUT
    ) {
      return true;
    }
    return false;
  }

  displayAmount(transaction: Transaction) {
    const amount = transaction.amount;
    if (this.isTransactionOut(transaction)) {
      return amount > 0 ? amount * -1 : amount;
    }

    return amount < 0 ? amount * -1 : amount;
  }

  getTransactionTypes(): SelectOption<string>[] {
    return Object.entries(TransactionType).map(([key, value]) => {
      return {
        label: value.toLowerCase().replaceAll('_', ' '),
        value: key,
      };
    });
  }

  getTypeSeverity(transaction: Transaction): DataType {
    return this.typeSeverities[transaction.type];
  }
}
