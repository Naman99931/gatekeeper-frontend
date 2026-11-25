'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, LayoutGrid, Network } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isPlatformAdmin = user?.role === 'PLATFORM_ADMIN';
  const isTenantAdmin = user?.role === 'TENANT_ADMIN';

  const navItems = [
    { href: '/', label: 'Overview', icon: LayoutGrid, visible: true },
    {
      href: '/organizations',
      label: 'Organizations',
      icon: Building2,
      visible: isPlatformAdmin,
    },
    {
      href: '/routes',
      label: 'API Routes',
      icon: Network,
      visible: isTenantAdmin,
    },
  ];

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-sidebar md:flex">
      <div className="flex h-14 items-center px-5 text-sm font-semibold tracking-tight text-white">
        Product Console
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-accent text-white'
                    : 'text-white/70 hover:bg-sidebarhover hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
