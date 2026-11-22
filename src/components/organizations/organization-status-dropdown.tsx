'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useUpdateOrganizationStatus } from '@/hooks/use-organizations';
import type { OrganizationStatus } from '@/types/organization';
import type { ApiError } from '@/lib/api/client';

const statusOptions: OrganizationStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED'];

const statusToneMap: Record<OrganizationStatus, 'neutral' | 'success' | 'danger'> = {
  ACTIVE: 'success',
  PENDING: 'neutral',
  SUSPENDED: 'danger',
  DELETED: 'neutral',
};

export function OrganizationStatusDropdown({
  organizationId,
  currentStatus,
}: {
  organizationId: number;
  currentStatus: OrganizationStatus;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: updateStatus, isPending } = useUpdateOrganizationStatus();

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSelectStatus = async (status: OrganizationStatus) => {
    if (status === currentStatus) {
      setOpen(false);
      return;
    }

    try {
      await updateStatus({ id: organizationId, status });
      toast.success(`Organization status updated to ${status}`);
      setOpen(false);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to update organization status');
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((prev) => !prev)}
        className="group inline-flex items-center gap-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 disabled:opacity-50"
      >
        <Badge tone={statusToneMap[currentStatus] || 'neutral'}>
          <span className="flex items-center gap-1">
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              currentStatus
            )}
            <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-hover:opacity-100" />
          </span>
        </Badge>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-36 origin-top-right rounded-md border border-border bg-surface p-1 shadow-md animate-in fade-in zoom-in-95">
          {statusOptions.map((status) => {
            const isSelected = status === currentStatus;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleSelectStatus(status)}
                className={cn(
                  'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-bg',
                  isSelected ? 'text-accent font-semibold' : 'text-text-primary'
                )}
              >
                <span>{status}</span>
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    status === 'ACTIVE' && 'bg-success',
                    status === 'PENDING' && 'bg-amber-500',
                    status === 'SUSPENDED' && 'bg-danger'
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
