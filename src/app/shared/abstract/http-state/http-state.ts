import { Component, input } from '@angular/core';

@Component({
  imports: [],
  template: ``,
})
export abstract class HttpState {
  isLoading = input(false);
  serverMessage = input<string | null>(null);
  serverError = input<string | null>(null);
  serverErrorDetails = input<Record<string, string> | null>(null);
}
