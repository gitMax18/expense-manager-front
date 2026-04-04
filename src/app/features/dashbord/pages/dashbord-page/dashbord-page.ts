import { Component } from '@angular/core';
import { Dashbord } from '../../components/dashbord/dashbord';

@Component({
  selector: 'app-dashbord-page',
  imports: [Dashbord],
  template: `
    <section>
      <app-dashbord />
    </section>
  `,
  styleUrl: './dashbord-page.scss',
})
export class DashbordPage {}
