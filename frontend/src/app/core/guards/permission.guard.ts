import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Permission Guard - Protects routes that require specific permissions
 * Reads required permissions from route data
 * Usage: { path: 'articles/create', canActivate: [authGuard, permissionGuard], data: { permissions: ['create'] } }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated first
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Get required permissions from route data
  const requiredPermissions = getRequiredPermissions(route);

  // If no permissions required, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // Check if user has all required permissions
  const hasAllPermissions = requiredPermissions.every((permission) =>
    authService.hasPermission(permission)
  );

  if (hasAllPermissions) {
    return true;
  }

  // User doesn't have required permissions
  console.warn('Access denied. Required permissions:', requiredPermissions);
  console.warn('User permissions:', authService.getUserPermissions());

  // Redirect to unauthorized page
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Get required permissions from route data
 * Checks current route and all parent routes
 */
function getRequiredPermissions(route: ActivatedRouteSnapshot): string[] {
  const permissions: string[] = [];

  // Check current route
  if (route.data['permissions']) {
    permissions.push(...route.data['permissions']);
  }

  // Check parent routes
  let parent = route.parent;
  while (parent) {
    if (parent.data['permissions']) {
      permissions.push(...parent.data['permissions']);
    }
    parent = parent.parent;
  }

  return [...new Set(permissions)]; // Remove duplicates
}
