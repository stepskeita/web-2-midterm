import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/articles',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'articles',
    loadChildren: () => import('./articles/articles.routes').then((m) => m.ARTICLE_ROUTES),
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.routes').then((m) => m.ROLE_ROUTES),
  },
  {
    path: 'permissions',
    loadChildren: () => import('./permissions/permissions.routes').then((m) => m.PERMISSION_ROUTES),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/components/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/articles',
  },
];
