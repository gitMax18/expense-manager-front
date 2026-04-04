import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pie-chart',
  imports: [ChartModule],
  template: `<div>
    <p-chart type="pie" [data]="data" [options]="options" />
  </div>`,
  styleUrl: './pie-chart.scss',
})
export class PieChart implements OnInit {
  data: any;
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

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: ['red', 'blue', 'green'],
          hoverBackgroundColor: ['red', 'blue', 'green'],
        },
      ],
    };
  }
}
