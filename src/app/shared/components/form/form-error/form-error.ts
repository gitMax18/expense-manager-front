import { Component, computed, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  imports: [],
  template: `
    @if (control().invalid && (control().dirty || control().touched)) {
    <div class="error">
      @if (control().hasError('required')) {
      <div>{{ fieldName() }} is required.</div>
      } @if (control().hasError('minlength') && minLengthRequired() !== null) {
      <div>{{ fieldName() }} must be at least {{ minLengthRequired() }} characters long.</div>
      } @if (control().hasError('min') && minValueRequired() !== null) {
      <div>{{ fieldName() }} must be at least {{ minValueRequired() }}.</div>
      } @if (control().hasError('validateEndDate')) {
      <div>{{ fieldName() }} must be after the start date.</div>
      }
    </div>
    } @if (errorDetails !== null && errorDetails()?.[fieldName().toLowerCase()]) {
    <div class="error">
      <div>{{ fieldName() + " " + errorDetails()?.[fieldName().toLowerCase()]}}</div>
    </div>
    }
  `,
  styleUrl: './form-error.scss',
})
export class FormError {
  control = input.required<FormControl>();
  fieldName = input.required<string>();
  errorDetails = input<Record<string, string> | null>();

  minLengthRequired = computed(() => {
    const minLengthError = this.control().errors?.['minlength'] as
      | { requiredLength?: number }
      | undefined;

    return minLengthError?.requiredLength ?? null;
  });

  minValueRequired = computed(() => {
    const minError = this.control().errors?.['min'] as { min?: number } | undefined;

    return minError?.min ?? null;
  });
}
