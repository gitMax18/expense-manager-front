import { Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, UpsertCategory } from '../../types';
import { FormItem } from '../../../../shared/components/form/form-item/form-item';
import { FormLabel } from '../../../../shared/components/form/form-label/form-label';
import { FormError } from '../../../../shared/components/form/form-error/form-error';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DisplayServerResponse } from '../../../../shared/components/display-server-response/display-server-response';
import { HttpState } from '../../../../shared/abstract/http-state/http-state';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-upsert-category-form',
  host: {
    class: 'upsert-category-form',
  },
  imports: [
    ReactiveFormsModule,
    FormItem,
    FormLabel,
    FormError,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DisplayServerResponse,
    ColorPickerModule,
  ],
  template: `
    <form [formGroup]="categoryForm" (ngSubmit)="handleSubmit()">
      <app-form-item>
        <app-form-label for="name">Nom</app-form-label>
        <input id="name" type="text" formControlName="name" pInputText />
        <app-form-error
          [control]="categoryForm.controls['name']"
          fieldName="Name"
          [errorDetails]="serverErrorDetails()"
        />
      </app-form-item>

      <app-form-item>
        <app-form-label for="description">Description</app-form-label>
        <textarea id="description" rows="4" formControlName="description" pTextarea></textarea>
      </app-form-item>
      <app-form-item>
        <app-form-label for="color">Color</app-form-label>
        <p-colorpicker formControlName="color" />
      </app-form-item>

      <app-display-server-response [error]="serverError()" [message]="serverMessage()" />

      <p-button
        type="submit"
        [label]="btnLabel()"
        [disabled]="categoryForm.invalid || isLoading()"
        [loading]="isLoading()"
      />
    </form>
  `,
  styleUrl: './upsert-category-form.scss',
})
export class UpsertCategoryForm extends HttpState {
  category = input<Category | null>(null);
  onSubmit = output<UpsertCategory>();

  isUpdate = computed(() => this.category() != null);
  btnLabel = computed(() => (this.isUpdate() ? 'Mettre à jour' : 'Créer'));
  readonly defaultColor = '#6466f1';

  readonly categoryForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl(''),
    color: new FormControl(this.defaultColor),
  });

  constructor() {
    super();
    effect(() => {
      if (this.category()) {
        this.categoryForm.patchValue({
          name: this.category()!.name,
          description: this.category()!.description ?? '',
          color: this.category()!.color ?? this.defaultColor,
        });
      } else {
        this.categoryForm.reset({
          name: '',
          description: '',
        });
      }
    });
  }

  handleSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.onSubmit.emit(this.categoryForm.value as UpsertCategory);
  }
}
