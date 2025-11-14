import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { passwordStrength } from '../../../validators/password-strength.validator';
import { matchValidator } from '../../../validators/match.validator';
 
@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
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
      let key = this.generateKey(password);
      this.auth.signup(name!, email!, key!).subscribe({
        next: () => location.href = '/home',
        error: err => alert(err.error?.message || 'Signup failed')
      });

      location.href = '/home';
    } catch (e: any) {
      alert(e.message || 'Signup failed');
    }
  }
  generateKey(key: any) {
    const password = key;
    const encryptedPassword = window.btoa(password);
    return encryptedPassword;
  }
}
 
 