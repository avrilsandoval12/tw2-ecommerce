export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: UserProfile;
  };
}

export interface UserProfile {
  id: number;
  name: string;
  lastname: string;
  email: string;
  address: string;
  role: 'ADMIN' | 'USER'
}

export interface AuthRegister {
  name: string,
  lastname: string,
  address: string,
  email: string,
  password: string
}

export interface UpdateProfileRequest {
  name?: string;
  lastname?: string;
  address?: string;
}

export interface RegisterBackendErrors{
  type: string,
  value: string,
  msg: string
}

