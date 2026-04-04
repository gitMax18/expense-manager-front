import { Component, inject } from '@angular/core';
import { NavItem } from '../nav-item/nav-item';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-navbar',
  host: {
    class: 'navbar',
  },
  imports: [NavItem, MenuModule, Button],
  template: `
    <p-menu [model]="items" styleClass="navbar__menu">
      <ng-template #start>
        <div class="navbar__logo">Expense Manager</div>
      </ng-template>
      <ng-template #item let-item>
        <app-nav-item [item]="item" />
      </ng-template>
      <ng-template #end>
        <p-button
          label="Logout"
          icon="pi pi-sign-out"
          class="p-button-text"
          severity="danger"
          (onClick)="handleLogout()"
        />
      </ng-template>
    </p-menu>
  `,
  styleUrl: './navbar.scss',
})
export class Navbar {
  authService = inject(AuthService);

  items: MenuItem[] = [
    { label: 'Dashbord', icon: 'pi pi-fw pi-home', routerLink: '/dashbord' },
    { label: 'Accounts', icon: 'pi pi-fw pi-home', routerLink: '/accounts' },
    { label: 'Categories', icon: 'pi pi-fw pi-home', routerLink: '/category' },
  ];

  handleLogout() {
    this.authService.logout();
  }
}
