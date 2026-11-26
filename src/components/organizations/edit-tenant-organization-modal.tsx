'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateOwnOrganization } from '@/hooks/use-organizations';
import type { Organization, UpdateTenantOrganizationRequest } from '@/types/organization';
import type { ApiError } from '@/lib/api/client';

export function EditTenantOrganizationModal({
  organization,
  open,
  onClose,
}: {
  organization: Organization;
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: updateOrg, isPending } = useUpdateOwnOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTenantOrganizationRequest>({
    defaultValues: {
      name: organization.name,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: organization.name,
      });
    }
  }, [open, organization, reset]);

  const onSubmit = async (data: UpdateTenantOrganizationRequest) => {
    try {
      await updateOrg(data);
      toast.success('Organization name updated successfully');
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to update organization');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Organization Name">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="tenant-org-name">Organization Name</Label>
          <Input
            id="tenant-org-name"
            placeholder="e.g. Acme Corporation"
            {...register('name', {
              required: 'Organization name is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 50, message: 'Maximum 50 characters' },
            })}
            error={!!errors.name}
          />
          <FieldError message={errors.name?.message} />
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
