'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useChangeRouteStatus } from '@/hooks/use-routes';
import type { RouteResponse } from '@/types/route';
import type { ApiError } from '@/lib/api/client';

export function RouteTable({ routes }: { routes: RouteResponse[] }) {
  const { mutateAsync: changeStatus, isPending } = useChangeRouteStatus();

  const handleToggleStatus = async (route: RouteResponse) => {
    try {
      await changeStatus({ id: route.id, active: !route.active });
      toast.success(`Route ${route.name} is now ${!route.active ? 'active' : 'inactive'}`);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to update route status');
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase text-text-secondary">
          <tr>
            <th className="px-6 py-3">Route ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Path Pattern</th>
            <th className="px-6 py-3">Target Base URL</th>
            <th className="px-6 py-3">Allowed Methods</th>
            <th className="px-6 py-3">Rate Limit</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {routes.map((route) => (
            <tr key={route.id} className="hover:bg-muted/30">
              <td className="px-6 py-4 font-mono text-xs font-semibold text-text-primary">
                {route.routeId}
              </td>
              <td className="px-6 py-4 font-medium text-text-primary">{route.name}</td>
              <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                {route.pathPattern}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                {route.targetBaseUrl || '-'}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {route.allowedMethods?.map((method) => (
                    <Badge key={method} tone="neutral">
                      {method}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-text-secondary">
                {route.requestsPerMinute ? `${route.requestsPerMinute} req/min` : 'No limit'}
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleStatus(route)}
                  className="cursor-pointer focus:outline-none disabled:opacity-50"
                  title="Click to toggle status"
                >
                  <Badge tone={route.active ? 'success' : 'danger'}>
                    {route.active ? 'Active' : 'Inactive'}
                  </Badge>
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <Link href={`/routes/${route.id}`}>
                  <Button variant="secondary" size="sm" className="inline-flex items-center gap-1.5 text-xs">
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
