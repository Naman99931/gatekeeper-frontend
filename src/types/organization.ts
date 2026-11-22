export type OrganizationStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface Organization {
  id: number;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
}

export type UpdateOrganizationRequest = CreateOrganizationRequest;

export interface TenantAdmin {
  id: number;
  username: string;
  enabled: boolean;
  role?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantAdminRequest {
  username: string;
  passwordHash: string;
  enabled?: boolean;
}

export interface UpdateTenantAdminRequest {
  username: string;
  passwordHash: string;
  enabled: boolean;
}