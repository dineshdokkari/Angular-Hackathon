import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
 
  submitted = false;
 
  // ✅ use nonNullable form so fields are typed as string
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
 
  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
 
    const creds = this.form.getRawValue(); // now { email: string, password: string }
 
    try {
      await this.auth.login(creds);
      location.href = '/home';
    } catch (e: any) {
      alert(e.message || 'Login failed');
    }
  }
}