import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AccessMatrixItem, AccessMatrixResponse } from '../../../core/models';

@Component({
  selector: 'app-access-matrix',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './access-matrix.component.html',
  styleUrls: ['./access-matrix.component.css'],
})
export class AccessMatrixComponent implements OnInit {
  accessMatrix: AccessMatrixItem[] = [];
  availablePermissions: { key: string; _id: string }[] = [];
  isLoading = false;
  errorMessage = '';
  isSuperAdmin = false;

  constructor(
    private roleService: RoleService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.loadAccessMatrix();
  }

  private loadAccessMatrix(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.roleService
      .getAccessMatrix()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          console.log('Access matrix loading complete. Roles:', this.accessMatrix.length);
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: AccessMatrixResponse) => {
          console.log('Access matrix response:', response);
          if (response && response.success) {
            this.accessMatrix = response.accessMatrix || [];
            this.availablePermissions = response.availablePermissions || [];
          } else if (response) {
            // Handle case where success field might be missing
            this.accessMatrix = response.accessMatrix || [];
            this.availablePermissions = response.availablePermissions || [];
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Access matrix error:', error);
          this.errorMessage = error.error?.message || 'Failed to load access matrix';
        },
      });
  }

  hasPermission(role: AccessMatrixItem, permissionKey: string): boolean {
    return role.permissions.some((p) => p.key === permissionKey);
  }

  getPermissionCount(role: AccessMatrixItem): number {
    return role.permissions.length;
  }
}
