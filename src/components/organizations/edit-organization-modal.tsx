'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateOrganization } from '@/hooks/use-organizations';
import type { Organization, UpdateOrganizationRequest } from '@/types/organization';
import type { ApiError } from '@/lib/api/client';

export function EditOrganizationModal({
  organization,
  open,
  onClose,
}: {
  organization: Organization;
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: updateOrg, isPending } = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateOrganizationRequest>({
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
    },
  });

  // Keep form in sync when organization changes or modal opens
  useEffect(() => {
    if (open) {
      reset({
        name: organization.name,
        slug: organization.slug,
      });
    }
  }, [open, organization, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setValue('slug', generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (data: UpdateOrganizationRequest) => {
    try {
      await updateOrg({ id: organization.id, payload: data });
      toast.success('Organization updated successfully');
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to update organization');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Organization">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="edit-name">Organization Name</Label>
          <Input
            id="edit-name"
            placeholder="e.g. Acme Corporation"
            {...register('name', {
              required: 'Organization name is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 50, message: 'Maximum 50 characters' },
              onChange: handleNameChange,
            })}
            error={!!errors.name}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="edit-slug">Slug (URL identifier)</Label>
          <Input
            id="edit-slug"
            placeholder="e.g. acme-corporation"
            {...register('slug', {
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Must be lowercase alphanumeric and hyphens only',
              },
            })}
            error={!!errors.slug}
          />
          <FieldError message={errors.slug?.message} />
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
