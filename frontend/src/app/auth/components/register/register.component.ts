import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../../roles/services/role.service';
import { Role, AuthResponse, RolesResponse } from '../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  roles: Role[] = [];
  isLoading = false;
  isLoadingRoles = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/articles']);
      return;
    }

    this.initializeForm();
    this.loadRoles();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      profilePhoto: [''],
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
          console.error('Failed to load roles:', error);
          // Set default roles if API fails
          this.roles = [];
        },
      });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const registerData = {
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      ...(formValue.profilePhoto && { profilePhoto: formValue.profilePhoto }),
    };

    this.authService
      .register(registerData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: AuthResponse) => {
          if (response.success) {
            // Auth state is automatically saved by the service
            this.router.navigate(['/articles']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        },
      });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get role() {
    return this.registerForm.get('role');
  }

  get profilePhoto() {
    return this.registerForm.get('profilePhoto');
  }
}
