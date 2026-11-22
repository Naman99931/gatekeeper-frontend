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