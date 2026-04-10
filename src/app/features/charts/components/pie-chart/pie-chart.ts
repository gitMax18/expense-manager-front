import { Component, OnInit, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pie-chart',
  imports: [ChartModule],
  template: `<div>
    <p-chart type="pie" [data]="data()" [options]="options" />
  </div>`,
  styleUrl: './pie-chart.scss',
})
export class PieChart {
  data = input.required<any>();
  options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: '#000',
        },
      },
    },
  };
}
