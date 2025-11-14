/**
 * Login Component
 * ---------------
 * ✅ Handles user login
 * ✅ Redirects to last visited route (if available)
 * ✅ Clears old route after successful redirect
 */

import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  submitted = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    let key = this.generateKey(password);

    this.auth.login(email!, key!).subscribe({
      next: () => {
        debugger;
        // Redirect to saved route or home
        const last = this.auth.getLastRoute();
        if (last) {
          this.router.navigateByUrl(last);
          this.auth.clearLastRoute();
        } else {
          this.router.navigateByUrl('/home');
        }
      },
      error: err => alert(err.error?.message || 'Login failed'),
    });
  }
  generateKey(key: any) {
    const password = key;
    const encryptedPassword = window.btoa(password);
    return encryptedPassword;
  }
}
