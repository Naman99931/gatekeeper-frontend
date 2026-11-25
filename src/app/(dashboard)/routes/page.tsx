'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RequireRole } from '@/components/auth/require-role';
import { AppShell } from '@/components/layout/app-shell';
import { useRoutes } from '@/hooks/use-routes';
import { RouteTable } from '@/components/routes/route-table';
import { RouteFormModal } from '@/components/routes/route-form-modal';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default function TenantRoutesPage() {
  return (
    <ProtectedRoute>
      <RequireRole role="TENANT_ADMIN">
        <AppShell>
          <TenantRoutesContent />
        </AppShell>
      </RequireRole>
    </ProtectedRoute>
  );
}

function TenantRoutesContent() {
  const { data: routes, isLoading, error } = useRoutes();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Loading routes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-danger/10 p-4 text-sm text-danger">
          Failed to load routes. Please make sure you are logged in as a Tenant Administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            API Routes
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your organization's API gateway routes and routing rules
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create Route
        </Button>
      </div>

      {!routes || routes.length === 0 ? (
        <EmptyState
          title="No routes configured"
          description="Your organization does not have any active API routes configured."
        />
      ) : (
        <RouteTable routes={routes} />
      )}

      <RouteFormModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
