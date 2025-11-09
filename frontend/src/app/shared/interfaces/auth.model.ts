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
}

export interface UpdateProfileRequest {
  name?: string;
  lastname?: string;
  address?: string;
}
