import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission } from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly API_URL = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  /**
   * Get all permissions from API
   */
  getAllPermissions(): Observable<{ success: boolean; permissions: Permission[] }> {
    return this.http.get<{ success: boolean; permissions: Permission[] }>(this.API_URL);
  }
}
