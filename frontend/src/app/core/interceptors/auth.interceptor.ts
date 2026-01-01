import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();

  // Clone request and add authorization header if token exists
  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the request and catch errors
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized responses
      if (error.status === 401) {
        // Token is invalid or expired
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url, expired: 'true' },
        });
      }

      // Handle 403 Forbidden responses
      if (error.status === 403) {
        console.error('Access denied:', error.error?.message);
      }

      return throwError(() => error);
    })
  );
};
