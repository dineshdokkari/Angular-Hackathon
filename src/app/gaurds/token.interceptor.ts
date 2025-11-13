/**
 * Token Interceptor
 * -----------------
 * ✅ Adds Authorization header for every API
 * ✅ Automatically refreshes access token when expired
 * ✅ Logs out user if refresh token is also expired
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  // Add access token to outgoing requests
  const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // Access token expired → try refresh
      if (error.status === 401 && auth.getRefreshToken()) {
        return auth.refreshAccessToken().pipe(
          switchMap(newToken => {
            if (!newToken) throw error; // If refresh failed
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(() => {
            // If refresh also failed, logout completely
            auth.logout(true); // Save route before logging out
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
