'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { user, isInitializing } = useAuth();
  const router = useRouter();
  const allowed = user?.role === role;
  
  useEffect(() => {
    if (!isInitializing && !allowed) {
      router.replace('/users');
    }
  }, [isInitializing, allowed, router]);

  if (isInitializing || !allowed) return null;

  return <>{children}</>;
}
