import { Component } from '@angular/core';
import { Card } from 'primeng/card';
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
        <app-pie-chart />
      </div>
    </p-card>
  `,
  styleUrl: './dashboard.scss',
})
export class Dashbord {}
