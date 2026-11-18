import type { Organization, OrganizationStatus } from '@/types/organization';
import { Badge } from '@/components/ui/badge';

const statusVariantMap: Record<
  OrganizationStatus,
  'default' | 'success' | 'warning' | 'danger'
> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'danger',
  DELETED: 'default',
};

export function OrganizationTable({ organizations }: { organizations: Organization[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase text-text-secondary">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Slug</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {organizations.map((org) => (
            <tr key={org.id} className="hover:bg-muted/30">
              <td className="px-6 py-4 font-mono text-xs">{org.id}</td>
              <td className="px-6 py-4 font-medium text-text-primary">{org.name}</td>
              <td className="px-6 py-4 font-mono text-xs text-text-secondary">{org.slug}</td>
              <td className="px-6 py-4">
                <Badge variant={statusVariantMap[org.status] || 'default'}>
                  {org.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs text-text-secondary">
                {new Date(org.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
