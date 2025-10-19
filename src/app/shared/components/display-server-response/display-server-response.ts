import { Component, input } from '@angular/core';

@Component({
  selector: 'app-display-server-response',
  imports: [],
  template: `
    @if (message !== null) {
    <div class="message message--success">{{ message() }}</div>
    }@if (error !== null) {
    <div class="message message--error">{{ error() }}</div>
    }
  `,
  styleUrl: './display-server-response.scss',
})
export class DisplayServerResponse {
  error = input<string | null>();
  message = input<string | null>();

  ngOnChanges() {
    console.log('error ', this.error());
  }
}
