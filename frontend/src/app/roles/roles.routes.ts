import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { superAdminGuard } from '../core/guards/super-admin.guard';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, superAdminGuard],
    loadComponent: () =>
      import('./components/role-list/role-list.component').then((m) => m.RoleListComponent),
  },
  {
    path: 'access-matrix',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/access-matrix/access-matrix.component').then(
        (m) => m.AccessMatrixComponent
      ),
  },
];
