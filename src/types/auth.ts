export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  role: string;
  organizationId: number | null;
}
export interface AuthUser {
  username: string;
  role: string;
  organizationId: number | null;
}