import { SuccessResponse } from './../../shared/types';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Account, CreateAccountRequest } from './types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  http = inject(HttpClient);

  createAccount(request: CreateAccountRequest) {
    return this.http.post<SuccessResponse<Account>>(`${environment.apiUrl}/accounts`, request);
  }
}
