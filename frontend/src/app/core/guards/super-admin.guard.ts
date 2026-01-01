import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

/**
 * SuperAdmin Guard - Protects routes that require SuperAdmin role
 * Redirects to articles if user is not SuperAdmin
 */
export const superAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Check if user is SuperAdmin
  if (authService.isSuperAdmin()) {
    return true;
  }

  // User is not SuperAdmin
  console.warn('Access denied. SuperAdmin role required.');
  console.warn('User role:', authService.getUserRole());

  router.navigate(['/unauthorized']);
  return false;
};
