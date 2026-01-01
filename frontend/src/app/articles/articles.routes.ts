import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { permissionGuard } from '../core/guards/permission.guard';

export const ARTICLE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['view'] },
    loadComponent: () =>
      import('./components/article-list/article-list.component').then(
        (m) => m.ArticleListComponent
      ),
  },
  {
    path: 'create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['create'] },
    loadComponent: () =>
      import('./components/article-create/article-create.component').then(
        (m) => m.ArticleCreateComponent
      ),
  },
  {
    path: ':id/edit',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['edit'] },
    loadComponent: () =>
      import('./components/article-edit/article-edit.component').then(
        (m) => m.ArticleEditComponent
      ),
  },
];
