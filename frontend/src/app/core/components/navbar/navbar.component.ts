import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMenuOpen = false;
  isUserMenuOpen = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe(
      (state: {
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
      }) => {
        this.currentUser = state.user;
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  canViewArticles(): boolean {
    return this.hasPermission('view');
  }

  canCreateArticles(): boolean {
    return this.hasPermission('create');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  closeMenus(): void {
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      this.closeMenus();
    }
  }
}
