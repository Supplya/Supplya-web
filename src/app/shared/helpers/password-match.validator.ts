import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function PasswordMatchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const formGroup = control as FormGroup;
    const controlValue = formGroup.controls[controlName].value;
    const matchingControlValue = formGroup.controls[matchingControlName].value;

    if (controlValue !== matchingControlValue) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}
