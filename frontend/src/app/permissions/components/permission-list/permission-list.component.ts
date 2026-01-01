import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../../core/models';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css'],
})
export class PermissionListComponent implements OnInit {
  permissions: Permission[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private permissionService: PermissionService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.permissionService
      .getAllPermissions()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          console.log('Permissions loading complete. Count:', this.permissions.length);
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: { success: boolean; permissions: Permission[] }) => {
          console.log('Permissions response:', response);
          if (response && response.success && response.permissions) {
            this.permissions = response.permissions;
          } else if (response && response.permissions) {
            // Handle case where success field might be missing
            this.permissions = response.permissions;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Permissions error:', error);
          this.errorMessage = error.error?.message || 'Failed to load permissions';
        },
      });
  }
}
