import { Component } from '@angular/core';

@Component({
  selector: 'app-form-item',
  imports: [],
  template: `
    <div class="item">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './form-item.scss',
})
export class FormItem {}
