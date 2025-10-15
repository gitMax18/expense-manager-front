import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar],
  template: `
    <div class="layout">
      <app-navbar />
      <main class="layout__content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
