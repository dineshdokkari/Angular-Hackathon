import { AbstractControl, ValidationErrors } from '@angular/forms';
 
export function matchValidator(sourceKey: string, confirmKey: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const groupAny = group as any;
    const s = groupAny.get(sourceKey);
    const c = groupAny.get(confirmKey);
    if (!s || !c) return null;
    const match = s.value === c.value;
    if (!match) {
      c.setErrors({ ...(c.errors || {}), mismatch: true });
    } else {
      if (c.errors) {
        delete c.errors['mismatch'];
        if (!Object.keys(c.errors).length) c.setErrors(null);
      }
    }
    return null;
  };
}