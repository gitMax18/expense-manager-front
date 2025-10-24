import { AuthRequest, AuthResponse, User } from './types';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SuccessResponse } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  route = inject(Router);

  private readonly tokenStorageKey = 'expense-manager-token';

  login(authRequest: AuthRequest) {
    return this.http
      .post<SuccessResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, authRequest)
      .pipe(
        tap((response) => {
          this.authSuccess(response.data);
        }),
        catchError((error) => {
          return this.authError(error);
        })
      );
  }

  register(authRequest: AuthRequest) {
    return this.http
      .post<SuccessResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, authRequest)
      .pipe(
        tap((response) => {
          this.authSuccess(response.data);
        }),
        catchError((error) => {
          return this.authError(error);
        })
      );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  logout() {
    this.clearToken();
    this.route.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  private authSuccess(authResponse: AuthResponse) {
    if (authResponse.token) {
      this.setToken(authResponse.token);
    }
    this.route.navigate(['/']);
  }

  private authError(error: any) {
    this.clearToken();
    return throwError(() => error);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  private clearToken() {
    localStorage.removeItem(this.tokenStorageKey);
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  }
}
