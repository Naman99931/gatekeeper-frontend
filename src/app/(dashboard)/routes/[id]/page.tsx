'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Globe,
  Hash,
  Layers,
  Network,
  Plus,
  Shield,
  Trash2,
  XCircle,
  Zap,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RequireRole } from '@/components/auth/require-role';
import { AppShell } from '@/components/layout/app-shell';
import { useChangeRouteStatus, useDeleteRoute, useRoute } from '@/hooks/use-routes';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { RouteFormModal } from '@/components/routes/route-form-modal';
import { CreateHeaderRuleModal } from '@/components/routes/create-header-rule-modal';
import type { ApiError } from '@/lib/api/client';

export default function RouteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const routeId = Number(resolvedParams.id);

  return (
    <ProtectedRoute>
      <RequireRole role="TENANT_ADMIN">
        <AppShell>
          <RouteDetailsContent id={routeId} />
        </AppShell>
      </RequireRole>
    </ProtectedRoute>
  );
}

function RouteDetailsContent({ id }: { id: number }) {
  const router = useRouter();
  const { data: route, isLoading, error } = useRoute(id);
  const { mutateAsync: changeStatus, isPending: isUpdatingStatus } = useChangeRouteStatus();
  const { mutateAsync: deleteRoute, isPending: isDeleting } = useDeleteRoute();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Loading route details..." />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-md bg-danger/10 p-4 text-sm text-danger">
          Failed to load route details. Route may not exist or does not belong to your organization.
        </div>
        <Link href="/routes">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Routes
          </Button>
        </Link>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    try {
      await changeStatus({ id: route.id, active: !route.active });
      toast.success(`Route status changed to ${!route.active ? 'Active' : 'Inactive'}`);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to update route status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoute(id);
      toast.success('Route deleted successfully');
      router.push('/routes');
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to delete route');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <Link href="/routes">
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              {route.name}
            </h1>
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={handleToggleStatus}
              title="Click to toggle status"
              className="cursor-pointer focus:outline-none disabled:opacity-50"
            >
              <Badge tone={route.active ? 'success' : 'danger'}>
                {route.active ? 'Active' : 'Inactive'}
              </Badge>
            </button>
          </div>
          <p className="text-xs font-mono text-text-secondary mt-0.5">
            ID: {route.routeId}
          </p>
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
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Grid of detail cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Routing Configuration Card */}
        <div className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Network className="h-4 w-4 text-accent" /> Routing Configuration
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Hash className="h-4 w-4" /> Database ID
              </span>
              <span className="font-mono text-text-primary">{route.id}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Globe className="h-4 w-4" /> Path Pattern
              </span>
              <span className="font-mono text-text-primary font-medium">{route.pathPattern}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Target Base URL</span>
              <span className="font-mono text-text-primary">{route.targetBaseUrl || 'None'}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Target Path Prefix</span>
              <span className="font-mono text-text-primary">{route.targetPathPrefix || 'None'}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Allowed HTTP Methods</span>
              <div className="flex flex-wrap gap-1">
                {route.allowedMethods?.map((m) => (
                  <Badge key={m} tone="neutral">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Policies and Limits Card */}
        <div className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" /> Policies & Versioning
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Zap className="h-4 w-4" /> Rate Limit
              </span>
              <span className="font-medium text-text-primary">
                {route.requestsPerMinute ? `${route.requestsPerMinute} requests / min` : 'Unlimited'}
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Clock className="h-4 w-4" /> Response Timeout
              </span>
              <span className="font-mono text-text-primary">
                {route.responseTimeoutMs} ms
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-text-secondary">Idempotency</span>
              {route.isIdempotencyEnabled ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                  <XCircle className="h-3.5 w-3.5" /> Disabled
                </span>
              )}
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Layers className="h-4 w-4" /> Config Version
              </span>
              <Badge tone="neutral">v{route.configurationVersion || 1}</Badge>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="flex items-center gap-2 text-text-secondary">
                <Calendar className="h-4 w-4" /> Created
              </span>
              <span className="text-text-secondary">
                {new Date(route.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Transformation Rules */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Header Transformation Rules ({route.headerRules?.length || 0})
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddRuleOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Header Rule
          </Button>
        </div>

        {!route.headerRules || route.headerRules.length === 0 ? (
          <p className="text-xs text-text-secondary">No custom header rules defined for this route.</p>
        ) : (
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-text-secondary uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-2">Direction</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Header Name</th>
                  <th className="px-4 py-2">Header Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {route.headerRules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-4 py-2 font-mono">{rule.direction}</td>
                    <td className="px-4 py-2">
                      <Badge tone="neutral">{rule.action}</Badge>
                    </td>
                    <td className="px-4 py-2 font-mono font-medium">{rule.headerName}</td>
                    <td className="px-4 py-2 font-mono text-text-secondary">{rule.headerValue || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RouteFormModal
        initialData={route}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <CreateHeaderRuleModal
        route={route}
        open={isAddRuleOpen}
        onClose={() => setIsAddRuleOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete API Route"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete <strong className="text-text-primary font-semibold">{route.name}</strong> ({route.routeId})?
            This will immediately remove the route from the gateway.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete Route
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
