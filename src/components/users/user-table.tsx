'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import type { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/providers/auth-provider';

export function UserTable({
  users,
  onDelete,
}: {
  users: User[];
  onDelete: (user: User) => void;
}) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.roles?.includes('ADMIN');

  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg text-left text-text-secondary">
            <th className="px-4 py-2.5 font-medium">Username</th>
            <th className="px-4 py-2.5 font-medium">Email</th>
            <th className="px-4 py-2.5 font-medium">Role</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            {isAdmin && <th className="px-4 py-2.5 font-medium" />}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/users/${user.id}`}
                  className="font-medium text-text-primary hover:text-accent"
                >
                  {user.username}
                </Link>
              </td>
              <td className="px-4 py-3 text-text-secondary">{user.email}</td>
              <td className="px-4 py-3">
                <Badge>{user.role}</Badge>
              </td>
              <td className="px-4 py-3">
                {user.enabled ? (
                  <Badge tone="success">Active</Badge>
                ) : (
                  <Badge tone="danger">Disabled</Badge>
                )}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/users/${user.id}/edit`}
                      aria-label={`Edit ${user.username}`}
                      className="rounded-sm p-1.5 text-text-secondary hover:bg-bg hover:text-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(user)}
                      aria-label={`Delete ${user.username}`}
                      className="rounded-sm p-1.5 text-text-secondary hover:bg-bg hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
