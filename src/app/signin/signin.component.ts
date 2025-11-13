import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { passwordStrength } from '../../validators/password-strength.validator';
import { matchValidator } from '../../validators/match.validator';
 
@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `./signin.component.html`
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
 
  submitted = false;
 
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrength]],
    confirm: ['', [Validators.required]]
  }, { validators: matchValidator('password', 'confirm') });
 
  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    try {
      const { name, email, password } = this.form.getRawValue();
      await this.auth.register({ name: name!, email: email!, password: password! });
      location.href = '/home';
    } catch (e: any) {
      alert(e.message || 'Signup failed');
    }
  }
}
 
 