import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SuccessResponse } from '../../shared/types';
import { ExpensesByCategory } from './types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);

  getExpensesByCategory() {
    return this.http.get<SuccessResponse<ExpensesByCategory[]>>(
      `${environment.apiUrl}/dashboard/expenses-per-category`
    );
  }

  transaformeExpensesByCategoryToPieChartData(expensesByCategory: ExpensesByCategory[]) {
    return {
      labels: expensesByCategory.map((expense) => expense.categoryName),
      datasets: [
        {
          data: expensesByCategory.map((expense) => expense.totalAmount),
          backgroundColor: expensesByCategory.map((expense) => expense.color),
          hoverBackgroundColor: expensesByCategory.map((expense) => expense.color),
        },
      ],
    };
  }
}
