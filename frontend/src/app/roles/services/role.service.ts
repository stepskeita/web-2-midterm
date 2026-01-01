import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RolesResponse,
  AccessMatrixResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleResponse,
} from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly API_URL = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  /**
   * Get all roles
   */
  getAllRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(this.API_URL);
  }

  /**
   * Get access matrix (all roles with permissions)
   */
  getAccessMatrix(): Observable<AccessMatrixResponse> {
    return this.http.get<AccessMatrixResponse>(`${this.API_URL}/access-matrix`);
  }

  /**
   * Create a new role (SuperAdmin only)
   */
  createRole(data: CreateRoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.API_URL, data);
  }

  /**
   * Update role (SuperAdmin only)
   */
  updateRole(id: string, data: UpdateRoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.API_URL}/${id}`, data);
  }

  /**
   * Delete role (SuperAdmin only)
   */
  deleteRole(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }
}
