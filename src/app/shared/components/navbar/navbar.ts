import { Component } from '@angular/core';
import { NavItem } from '../nav-item/nav-item';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  host: {
    class: 'navbar',
  },
  imports: [NavItem, MenuModule],
  template: `
    <p-menu [model]="items" styleClass="navbar__menu">
      <ng-template #start>
        <div class="navbar__logo">Expense Manager</div>
      </ng-template>
      <ng-template #item let-item>
        <app-nav-item [item]="item" />
      </ng-template>
      <ng-template #end> </ng-template>
    </p-menu>
  `,
  styleUrl: './navbar.scss',
})
export class Navbar {
  items: MenuItem[] = [{ label: 'Accounts', icon: 'pi pi-fw pi-home', routerLink: '/accounts' }];
}
