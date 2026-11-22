'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { RequireRole } from '@/components/auth/require-role';
import { AppShell } from '@/components/layout/app-shell';
import { useOrganizations } from '@/hooks/use-organizations';
import { OrganizationTable } from '@/components/organizations/organization-table';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateOrganizationModal } from '@/components/organizations/create-organization-modal';

export default function OrganizationsPage() {
  return (
    <ProtectedRoute>
      <RequireRole role="PLATFORM_ADMIN">
        <AppShell>
          <OrganizationsContent />
        </AppShell>
      </RequireRole>
    </ProtectedRoute>
  );
}

function OrganizationsContent() {
  const { data: organizations, isLoading, error } = useOrganizations();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Loading organizations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-danger/10 p-4 text-sm text-danger">
        Failed to load organizations. Please ensure you have PLATFORM_ADMIN privileges.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Organizations
          </h1>
          <p className="text-sm text-text-secondary">
            Manage all platform tenant organizations
          </p>
        </div>

      <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
        <Plus className="h-4 w-4" />
        Create Organization
      </Button>
      </div>

      {!organizations || organizations.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="There are currently no registered organizations on the platform."
        />
      ) : (
        <OrganizationTable organizations={organizations} />
      )}

      <CreateOrganizationModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
