import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class AppValidators {
  static validateEndDate = (startDate: Date): ValidatorFn => {
    return (control: AbstractControl) => {
      const endDate = control.value as Date | null;

      if (endDate && startDate && endDate < startDate) {
        return { validateEndDate: true };
      }
      return null;
    };
  };
}
