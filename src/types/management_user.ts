// Role is no longer a hardcoded union — it's fetched from /api/roles.
export interface RoleOption {
  id: number;
  name: string;
}

export interface ManagementUser {
  id: number;
  username: string;
  email: string;
  role: string;        // holds whatever RoleOption.name the user has
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserInput = Omit<ManagementUser, 'id' | 'createdAt' | 'updatedAt'> & {
  password?: string;
};
