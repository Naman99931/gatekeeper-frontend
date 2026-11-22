'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateTenantAdmin } from '@/hooks/use-organizations';
import type { TenantAdmin, UpdateTenantAdminRequest } from '@/types/organization';
import type { ApiError } from '@/lib/api/client';

export function EditTenantAdminModal({
  organizationId,
  tenantAdmin,
  open,
  onClose,
}: {
  organizationId: number;
  tenantAdmin: TenantAdmin;
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: updateAdmin, isPending } = useUpdateTenantAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTenantAdminRequest>({
    defaultValues: {
      username: tenantAdmin.username,
      passwordHash: '',
      enabled: tenantAdmin.enabled,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        username: tenantAdmin.username,
        passwordHash: '',
        enabled: tenantAdmin.enabled,
      });
    }
  }, [open, tenantAdmin, reset]);

  const onSubmit = async (data: UpdateTenantAdminRequest) => {
    try {
      await updateAdmin({ organizationId, payload: data });
      toast.success('Tenant administrator updated successfully');
      reset();
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to update tenant admin');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Tenant Administrator">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="edit-tenant-username">Admin Username</Label>
          <Input
            id="edit-tenant-username"
            placeholder="e.g. org_admin"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 50, message: 'Maximum 50 characters' },
            })}
            error={!!errors.username}
          />
          <FieldError message={errors.username?.message} />
        </div>

        <div>
          <Label htmlFor="edit-tenant-password">New Password</Label>
          <Input
            id="edit-tenant-password"
            type="password"
            placeholder="Min 8 characters (required by backend)"
            {...register('passwordHash', {
              required: 'New password is required to update credentials',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            error={!!errors.passwordHash}
          />
          <FieldError message={errors.passwordHash?.message} />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="edit-tenant-enabled"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            {...register('enabled')}
          />
          <Label htmlFor="edit-tenant-enabled" className="cursor-pointer mb-0">
            Account Enabled
          </Label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
