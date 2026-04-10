import { Component, inject, signal, effect } from '@angular/core';
import { Card } from 'primeng/card';
import { dashboardStore } from '../../dashboard-store';
import { PieChartData } from '../../types';
import { DashboardService } from '../../dashboard-service';
import { PieChart } from '../../../charts/components/pie-chart/pie-chart';

@Component({
  selector: 'app-dashboard',
  imports: [Card, PieChart],
  template: `
    <p-card>
      <header>
        <h1>Dashbord</h1>
      </header>
      <div>
        <app-pie-chart
          [data]="
            dashbordService.transaformeExpensesByCategoryToPieChartData(dashboardStore.entities())
          "
        />
      </div>
    </p-card>
  `,
  styleUrl: './dashboard.scss',
})
export class Dashbord {
  dashboardStore = inject(dashboardStore);
  dashbordService = inject(DashboardService);
  expensesByCategoryData = signal<PieChartData[]>([]);

  ngOnInit() {
    this.dashboardStore.resetStatus();
    this.dashboardStore.getExpensesByCategory();
  }
}
