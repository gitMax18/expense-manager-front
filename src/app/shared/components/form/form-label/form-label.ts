import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-label',
  imports: [],
  template: `
    <label class="label" [for]="for()">
      <ng-content></ng-content>
    </label>
  `,
  styleUrl: './form-label.scss',
})
export class FormLabel {
  for = input.required<string>();
}
