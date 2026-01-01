import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/articles';
  sessionExpired = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get return URL from query params
    this.route.queryParams.subscribe((params: Params) => {
      this.returnUrl = params['returnUrl'] || '/articles';
      this.sessionExpired = params['expired'] === 'true';

      if (this.sessionExpired) {
        this.errorMessage = 'Your session has expired. Please login again.';
      }
    });

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnPermissions();
      return;
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginForm.value)
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
            // Redirect to return URL or based on permissions
            if (this.returnUrl && this.returnUrl !== '/auth/login') {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.redirectBasedOnPermissions();
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        },
      });
  }

  private redirectBasedOnPermissions(): void {
    const permissions = this.authService.getUserPermissions();

    // Redirect based on permissions
    if (permissions.includes('create') || permissions.includes('edit')) {
      this.router.navigate(['/articles']);
    } else if (permissions.includes('view')) {
      this.router.navigate(['/articles']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
