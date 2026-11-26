'use client';

import { useState } from 'react';
import { Building2, Calendar, Edit2, Hash, Tag } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RequireRole } from '@/components/auth/require-role';
import { AppShell } from '@/components/layout/app-shell';
import { useOwnOrganization } from '@/hooks/use-organizations';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditTenantOrganizationModal } from '@/components/organizations/edit-tenant-organization-modal';
import type { OrganizationStatus } from '@/types/organization';

const statusToneMap: Record<OrganizationStatus, 'neutral' | 'success' | 'danger'> = {
  ACTIVE: 'success',
  PENDING: 'neutral',
  SUSPENDED: 'danger',
  DELETED: 'neutral',
};

export default function TenantOrganizationPage() {
  return (
    <ProtectedRoute>
      <RequireRole role="TENANT_ADMIN">
        <AppShell>
          <TenantOrganizationContent />
        </AppShell>
      </RequireRole>
    </ProtectedRoute>
  );
}

function TenantOrganizationContent() {
  const { data: org, isLoading, error } = useOwnOrganization();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Loading organization details..." />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-danger/10 p-4 text-sm text-danger">
          Failed to load organization details. Please make sure you are logged in as a Tenant Administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Manage Organization
          </h1>
          <p className="text-sm text-text-secondary">
            View your tenant profile and update your organization details
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Name
        </Button>
      </div>

      {/* Organization Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            General Information
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Hash className="h-4 w-4" /> Organization ID
              </span>
              <span className="font-mono text-text-primary">{org.id}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Building2 className="h-4 w-4" /> Name
              </span>
              <span className="font-medium text-text-primary">{org.name}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Tag className="h-4 w-4" /> Slug
              </span>
              <span className="font-mono text-text-primary">{org.slug}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Status & Timestamps
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Status</span>
              <Badge tone={statusToneMap[org.status] || 'neutral'}>
                {org.status}
              </Badge>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Calendar className="h-4 w-4" /> Created At
              </span>
              <span className="text-text-secondary">
                {new Date(org.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Calendar className="h-4 w-4" /> Last Updated
              </span>
              <span className="text-text-secondary">
                {new Date(org.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <EditTenantOrganizationModal
        organization={org}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
