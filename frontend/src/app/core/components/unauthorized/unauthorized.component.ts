import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent {
  constructor(private authService: AuthService, private router: Router) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }

  onGoBack(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/articles']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
