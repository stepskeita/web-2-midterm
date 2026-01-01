import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Role, RolesResponse, AccessMatrixResponse, RoleResponse } from '../../../core/models';

interface PermissionOption {
  _id: string;
  key: string;
  selected: boolean;
}

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  permissions: PermissionOption[] = [];
  roleForm!: FormGroup;
  isLoading = false;
  isLoadingRoles = false;
  errorMessage = '';
  successMessage = '';
  showCreateForm = false;
  isSuperAdmin = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.isSuperAdmin();

    if (!this.isSuperAdmin) {
      this.router.navigate(['/articles']);
      return;
    }

    this.initializeForm();
    this.loadRoles();
    this.loadPermissions();
  }

  private initializeForm(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private loadRoles(): void {
    this.isLoadingRoles = true;
    this.roleService
      .getAllRoles()
      .pipe(
        finalize(() => {
          this.isLoadingRoles = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: RolesResponse) => {
          if (response.success) {
            this.roles = response.roles;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to load roles';
        },
      });
  }

  private loadPermissions(): void {
    this.roleService
      .getAccessMatrix()
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: (response: AccessMatrixResponse) => {
          if (response.success) {
            this.permissions = response.availablePermissions.map((p) => ({
              _id: p._id,
              key: p.key,
              selected: false,
            }));
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load permissions:', error);
        },
      });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  togglePermission(permission: PermissionOption): void {
    permission.selected = !permission.selected;
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.markFormGroupTouched(this.roleForm);
      return;
    }

    const selectedPermissions = this.permissions.filter((p) => p.selected).map((p) => p._id);

    if (selectedPermissions.length === 0) {
      this.errorMessage = 'Please select at least one permission';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const roleData = {
      name: this.roleForm.value.name,
      permissions: selectedPermissions,
    };

    this.roleService
      .createRole(roleData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: RoleResponse) => {
          if (response.success) {
            this.successMessage = `Role "${response.role.name}" created successfully!`;
            this.resetForm();
            this.loadRoles(); // Reload roles list
            this.showCreateForm = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to create role';
        },
      });
  }

  onDeleteRole(role: Role): void {
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      this.roleService.deleteRole(role._id).subscribe({
        next: (response: { success: boolean; message: string }) => {
          if (response.success) {
            this.successMessage = `Role "${role.name}" deleted successfully!`;
            this.loadRoles();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to delete role';
        },
      });
    }
  }

  private resetForm(): void {
    this.roleForm.reset();
    this.permissions.forEach((p) => (p.selected = false));
    this.errorMessage = '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() {
    return this.roleForm.get('name');
  }

  getSelectedPermissionsCount(): number {
    return this.permissions.filter((p) => p.selected).length;
  }
}
