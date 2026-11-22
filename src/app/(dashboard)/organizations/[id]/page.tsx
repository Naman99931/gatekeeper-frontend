'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Calendar, CheckCircle2, Edit2, Hash, Shield, Tag, UserCheck, UserPlus, XCircle } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RequireRole } from '@/components/auth/require-role';
import { AppShell } from '@/components/layout/app-shell';
import { useOrganization, useTenantAdmin } from '@/hooks/use-organizations';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditOrganizationModal } from '@/components/organizations/edit-organization-modal';
import { CreateTenantAdminModal } from '@/components/organizations/create-tenant-admin-modal';
import { OrganizationStatusDropdown } from '@/components/organizations/organization-status-dropdown';
import type { OrganizationStatus } from '@/types/organization';

const statusToneMap: Record<
  OrganizationStatus,
  'neutral' | 'success' | 'danger'
> = {
  ACTIVE: 'success',
  PENDING: 'neutral',
  SUSPENDED: 'danger',
  DELETED: 'neutral',
};

export default function OrganizationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orgId = Number(resolvedParams.id);

  return (
    <ProtectedRoute>
      <RequireRole role="PLATFORM_ADMIN">
        <AppShell>
          <OrganizationDetailsContent id={orgId} />
        </AppShell>
      </RequireRole>
    </ProtectedRoute>
  );
}

function OrganizationDetailsContent({ id }: { id: number }) {
  const { data: org, isLoading, error } = useOrganization(id);
  const { data: tenantAdmin, isLoading: isTenantLoading } = useTenantAdmin(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Loading organization details..." />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-md bg-danger/10 p-4 text-sm text-danger">
          Failed to load organization details. Organization may not exist.
        </div>
        <Link href="/organizations">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Organizations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/organizations">
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            {org.name}
          </h1>
          <p className="text-xs text-text-secondary">Organization ID: {org.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            General Information
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Hash className="h-4 w-4" /> ID
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
            Timestamps & Status
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Status</span>
              <OrganizationStatusDropdown
                organizationId={org.id}
                currentStatus={org.status}
              />
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

      {/* Tenant Administrator Details Card */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Tenant Administrator
          </h2>
          {!tenantAdmin && !isTenantLoading && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateAdminOpen(true)}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Assign Tenant Admin
            </Button>
          )}
        </div>

        {isTenantLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner label="Checking tenant administrator..." />
          </div>
        ) : tenantAdmin ? (
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Hash className="h-4 w-4" /> Admin ID
              </span>
              <span className="font-mono text-text-primary">{tenantAdmin.id}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <UserCheck className="h-4 w-4" /> Username
              </span>
              <span className="font-medium text-text-primary">{tenantAdmin.username}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Shield className="h-4 w-4" /> Role
              </span>
              <Badge tone="neutral">
                {tenantAdmin.role?.name || 'TENANT_ADMIN'}
              </Badge>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Account Status</span>
              {tenantAdmin.enabled ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-danger font-medium">
                  <XCircle className="h-3.5 w-3.5" /> Disabled
                </span>
              )}
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Calendar className="h-4 w-4" /> Created
              </span>
              <span className="text-text-secondary">
                {new Date(tenantAdmin.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border py-6 text-center">
            <p className="text-sm font-medium text-text-primary">No Tenant Administrator Assigned</p>
            <p className="mt-1 text-xs text-text-secondary">
              This organization does not have an admin account configured yet.
            </p>
          </div>
        )}
      </div>

      <EditOrganizationModal
        organization={org}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <CreateTenantAdminModal
        organizationId={org.id}
        open={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
      />
    </div>
  );
}
