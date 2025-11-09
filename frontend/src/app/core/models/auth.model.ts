export interface AuthRegister {
  name: string;
  lastname: string;
  address: string;
  email: string;
  password: string;
}

export interface RegisterBackendErrors  {
  value: string;
  type: string;
  msg: string;
}
