'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateTenantAdmin } from '@/hooks/use-organizations';
import type { CreateTenantAdminRequest } from '@/types/organization';
import type { ApiError } from '@/lib/api/client';

export function CreateTenantAdminModal({
  organizationId,
  open,
  onClose,
}: {
  organizationId: number;
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: createAdmin, isPending } = useCreateTenantAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTenantAdminRequest>({
    defaultValues: {
      enabled: true,
    },
  });

  const onSubmit = async (data: CreateTenantAdminRequest) => {
    try {
      await createAdmin({ organizationId, payload: data });
      toast.success('Tenant administrator created successfully');
      reset();
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to create tenant admin');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign Tenant Administrator">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="tenant-username">Admin Username</Label>
          <Input
            id="tenant-username"
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
          <Label htmlFor="tenant-password">Password</Label>
          <Input
            id="tenant-password"
            type="password"
            placeholder="Min 8 characters"
            {...register('passwordHash', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            error={!!errors.passwordHash}
          />
          <FieldError message={errors.passwordHash?.message} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create Admin
          </Button>
        </div>
      </form>
    </Modal>
  );
}
