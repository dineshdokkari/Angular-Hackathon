/**
 * AuthService
 * ------------
 * This service:
 * ✅ Stores access and refresh tokens
 * ✅ Refreshes access tokens when expired
 * ✅ Saves last visited route if user is logged out
 * ✅ Redirects user after login to last visited page
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // We'll store tokens in localStorage
  private ACCESS_KEY = 'access_token';
  private REFRESH_KEY = 'refresh_token';
  private LAST_ROUTE_KEY = 'last_route';

  // Backend base URL
  private API_URL = 'https://localhost:7197';

  // Used by components to know login status
  isLoggedIn$ = new BehaviorSubject<boolean>(!!this.getAccessToken());

  /** Save tokens */
  private setTokens(access: string, refresh: string) {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
    this.isLoggedIn$.next(true);
  }

  /** Remove tokens (used for logout or expired sessions) */
  private clearTokens() {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.isLoggedIn$.next(false);
  }

  /** Get access token */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  /** Get refresh token */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /** Save last visited route before logout */
  saveLastRoute(route: string) {
    localStorage.setItem(this.LAST_ROUTE_KEY, route);
  }

  /** Get last visited route */
  getLastRoute(): string | null {
    return localStorage.getItem(this.LAST_ROUTE_KEY);
  }

  /** Clear last route (after redirect) */
  clearLastRoute() {
    localStorage.removeItem(this.LAST_ROUTE_KEY);
  }

  /** Signup API */
  signup(name: string, email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/api/Auth/signup`, { name, email, password }).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken))
    );
  }

  /** Login API */
  login(userName: string, password: string) {
    debugger;
    return this.http.post<any>(`${this.API_URL}/api/Auth/login`, { userName, password }).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken))
    );
  }

  /** Refresh access token using refresh token */
  refreshAccessToken() {
    const refresh = this.getRefreshToken();
    if (!refresh) return of(null);

    return this.http.post<any>(`${this.API_URL}/refresh`, { refreshToken: refresh }).pipe(
      map(res => {
        localStorage.setItem(this.ACCESS_KEY, res.accessToken);
        return res.accessToken;
      }),
      catchError(err => {
        // If refresh fails (token expired), logout user
        this.logout(true);
        return throwError(() => err);
      })
    );
  }

  /** Logout user */
  logout(expired = false) {
    const currentRoute = this.router.url;

    if (expired) {
      // Save the route so we can bring them back later
      this.saveLastRoute(currentRoute);
    }

    this.clearTokens();
    this.router.navigateByUrl('/login');
  }

  /** Check if user is currently logged in (used by auth.guard) */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }


}
