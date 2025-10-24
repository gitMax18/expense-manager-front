import { SuccessResponse } from './../../shared/types';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Account, UpsertAccountRequest } from './types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  http = inject(HttpClient);

  createAccount(request: UpsertAccountRequest) {
    return this.http.post<SuccessResponse<Account>>(`${environment.apiUrl}/accounts`, request);
  }

  updateAccount(accountId: number, request: UpsertAccountRequest) {
    return this.http.put<SuccessResponse<Account>>(
      `${environment.apiUrl}/accounts/${accountId}`,
      request
    );
  }

  getUserAccounts() {
    return this.http.get<SuccessResponse<Account[]>>(`${environment.apiUrl}/accounts`);
  }

  getAccountById(id: number) {
    return this.http.get<SuccessResponse<Account>>(`${environment.apiUrl}/accounts/${id}`);
  }

  deleteAccountById(id: number) {
    return this.http.delete<SuccessResponse<null>>(`${environment.apiUrl}/accounts/${id}`);
  }
}
