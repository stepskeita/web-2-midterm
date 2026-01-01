import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../core/models';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profilePhoto: string | null;
    role: string;
    permissions: string[];
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = 'auth_state';

  private authStateSubject = new BehaviorSubject<AuthState>(this.getStoredAuthState());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get stored authentication state from localStorage
   */
  private getStoredAuthState(): AuthState {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getEmptyAuthState();
      }
    }
    return this.getEmptyAuthState();
  }

  /**
   * Get empty authentication state
   */
  private getEmptyAuthState(): AuthState {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
    };
  }

  /**
   * Store authentication state
   */
  private storeAuthState(state: AuthState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    this.authStateSubject.next(state);
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((response) => {
        if (response.success) {
          this.storeAuthState({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
          });
        }
      })
    );
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        if (response.success) {
          this.storeAuthState({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
          });
        }
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.authStateSubject.next(this.getEmptyAuthState());
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.authStateSubject.value.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.authStateSubject.value.refreshToken;
  }

  /**
   * Get current user value (synchronous)
   */
  get currentUserValue(): AuthState['user'] {
    return this.authStateSubject.value.user;
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    return this.authStateSubject.value.user?.role || null;
  }

  /**
   * Get user permissions
   */
  getUserPermissions(): string[] {
    return this.authStateSubject.value.user?.permissions || [];
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authStateSubject.value.accessToken;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.some((permission) => userPermissions.includes(permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.every((permission) => userPermissions.includes(permission));
  }

  /**
   * Check if user is SuperAdmin
   */
  isSuperAdmin(): boolean {
    return this.getUserRole() === 'SuperAdmin';
  }
}
