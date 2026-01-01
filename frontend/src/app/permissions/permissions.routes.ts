import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/permission-list/permission-list.component').then(
        (m) => m.PermissionListComponent
      ),
    canActivate: [authGuard],
  },
];
