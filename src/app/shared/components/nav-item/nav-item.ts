import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a class="p-menu-item-link" [routerLink]="item().routerLink" routerLinkActive="active">
      <i [class]="item().icon"></i>
      <span>{{ item().label }}</span>
    </a>
  `,
  styleUrl: './nav-item.scss',
})
export class NavItem {
  item = input.required<MenuItem>();
}
