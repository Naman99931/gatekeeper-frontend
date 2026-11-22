'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateOrganization } from '@/hooks/use-organizations';
import type { ApiError } from '@/lib/api/client';

interface FormData {
  name: string;
  slug: string;
}

export function CreateOrganizationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: createOrg, isPending } = useCreateOrganization();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Helper to auto-generate slug from name as user types
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

  const onSubmit = async (data: FormData) => {
    try {
      await createOrg(data);
      toast.success('Organization created successfully');
      reset();
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to create organization');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Organization">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
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
          <Label htmlFor="slug">Slug (URL identifier)</Label>
          <Input
            id="slug"
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
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
