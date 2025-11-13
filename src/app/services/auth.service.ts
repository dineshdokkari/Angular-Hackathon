import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, Credentials, User } from '../Models/authmodel';
 
const LS_USERS = 'demo.users';
const LS_AUTH = 'demo.auth';
 
function uid() { return Math.random().toString(36).slice(2, 10); }
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private state = signal<AuthState>(this.restoreAuth());
  isAuthenticated = computed(() => !!this.state().token);
  user = computed(() => this.state().user);
 
  constructor(private router: Router) {}
 
  // ---- Public API ----
  async register(data: { name: string; email: string; password: string }): Promise<void> {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('Email already registered.');
    }
    const newUser: User = {
      id: uid(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password, // NOTE: hash in real life
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    await this.login({ email: newUser.email, password: newUser.password });
  }
 
  async login(creds: Credentials): Promise<void> {
    const users = this.getUsers();
    const match = users.find(
      u => u.email === creds.email.trim().toLowerCase() && u.password === creds.password
    );
    if (!match) throw new Error('Invalid email or password.');
    const token = 'demo-' + uid();
    const auth: AuthState = { token, user: { id: match.id, name: match.name, email: match.email } };
    this.state.set(auth);
    localStorage.setItem(LS_AUTH, JSON.stringify(auth));
  }
 
  logout(): void {
    this.state.set({ token: null, user: null });
    localStorage.removeItem(LS_AUTH);
    this.router.navigateByUrl('/login');
  }
 
  // ---- Helpers ----
  private getUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem(LS_USERS) || '[]') as User[];
    } catch {
      return [];
    }
  }
 
  private restoreAuth(): AuthState {
    try {
      return JSON.parse(localStorage.getItem(LS_AUTH) || 'null') || { token: null, user: null };
    } catch {
      return { token: null, user: null };
    }
  }
}