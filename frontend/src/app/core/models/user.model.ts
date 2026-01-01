export interface UserListItem {
  _id: string;
  fullName: string;
  email: string;
  profilePhoto: string | null;
  role: string;
  roleId: string;
  permissions: string[];
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  users: UserListItem[];
}

export interface AssignRoleRequest {
  roleId: string;
}

export interface AssignRoleResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profilePhoto: string | null;
    role: string;
    permissions: string[];
  };
}
