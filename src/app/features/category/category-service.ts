import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SuccessResponse } from '../../shared/types';
import { Category, UpsertCategory } from './types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);

  createCategory(request: UpsertCategory) {
    return this.http.post<SuccessResponse<Category>>(`${environment.apiUrl}/categories`, request);
  }

  updateCategory(categoryId: number, request: UpsertCategory) {
    return this.http.put<SuccessResponse<Category>>(
      `${environment.apiUrl}/categories/${categoryId}`,
      request
    );
  }

  getUserCategories() {
    return this.http.get<SuccessResponse<Category[]>>(`${environment.apiUrl}/categories`);
  }

  getCategoryById(id: number) {
    return this.http.get<SuccessResponse<Category>>(`${environment.apiUrl}/categories/${id}`);
  }

  deleteCategoryById(id: number) {
    return this.http.delete<SuccessResponse<null>>(`${environment.apiUrl}/categories/${id}`);
  }
}
