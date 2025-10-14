import { AuthRequest } from './types';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  login(authRequest: AuthRequest) {
    return this.http.post(`${environment.apiUrl}/auth/login`, authRequest);
  }

  register(authRequest: AuthRequest) {
    return this.http.post(`${environment.apiUrl}/auth/register`, authRequest);
  }
}
