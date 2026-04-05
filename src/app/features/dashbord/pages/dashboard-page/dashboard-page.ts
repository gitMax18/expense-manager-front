import { Component } from '@angular/core';
import { Dashbord } from '../../components/dashbord/dashbord';

@Component({
  selector: 'app-dashboard-page',
  imports: [Dashbord],
  template: `
    <section>
      <app-dashboard />
    </section>
  `,
  styleUrl: './dashboard-page.scss',
})
export class DashbordPage {}
