'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
      <div />
      <div className="flex items-center gap-3">
        {user?.username && (
          <span className="text-sm text-text-secondary">{user.username}</span>
        )}
        <button
          onClick={logout}
          aria-label="Log out"
          className="rounded-sm p-1.5 text-text-secondary hover:bg-bg hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
