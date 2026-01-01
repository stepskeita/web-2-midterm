export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePhoto: string | null;
  role: string;
  roleId?: string;
  permissions: string[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profilePhoto: string | null;
    role: string;
    permissions: string[];
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
  profilePhoto?: string;
}
