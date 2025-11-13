import { AbstractControl, ValidationErrors } from '@angular/forms';
 
export function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const hasMin = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const ok = hasMin && hasUpper && hasLower && hasNumber;
  return ok ? null : { weakPassword: true };
}
 