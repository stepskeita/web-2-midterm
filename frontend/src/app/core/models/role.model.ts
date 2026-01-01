export interface Permission {
  _id: string;
  key: 'create' | 'edit' | 'delete' | 'publish' | 'view';
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface RolesResponse {
  success: boolean;
  count: number;
  roles: Role[];
}

export interface AccessMatrixResponse {
  success: boolean;
  accessMatrix: AccessMatrixItem[];
  availablePermissions: {
    key: string;
    _id: string;
  }[];
}

export interface AccessMatrixItem {
  roleId: string;
  roleName: string;
  permissions: {
    key: string;
    _id: string;
  }[];
}

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: string[];
}

export interface RoleResponse {
  success: boolean;
  message: string;
  role: Role;
}
