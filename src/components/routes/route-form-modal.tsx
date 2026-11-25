'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateRoute, useUpdateRoute } from '@/hooks/use-routes';
import type { RouteRequest, RouteResponse } from '@/types/route';
import type { ApiError } from '@/lib/api/client';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

interface FormData {
  routeId: string;
  name: string;
  pathPattern: string;
  targetBaseUrl: string;
  targetPathPrefix: string;
  requestsPerMinute: number;
  responseTimeoutMs: number;
  idempotancyEnabled: boolean;
  active: boolean;
}

export function RouteFormModal({
  initialData,
  open,
  onClose,
}: {
  initialData?: RouteResponse;
  open: boolean;
  onClose: () => void;
}) {
  const isEditing = Boolean(initialData);
  const { mutateAsync: createRoute, isPending: isCreating } = useCreateRoute();
  const { mutateAsync: updateRoute, isPending: isUpdating } = useUpdateRoute();
  const isPending = isCreating || isUpdating;

  const [selectedMethods, setSelectedMethods] = useState<string[]>(
    initialData?.allowedMethods || ['GET']
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      routeId: initialData?.routeId || '',
      name: initialData?.name || '',
      pathPattern: initialData?.pathPattern || '',
      targetBaseUrl: initialData?.targetBaseUrl || '',
      targetPathPrefix: initialData?.targetPathPrefix || '',
      requestsPerMinute: initialData?.requestsPerMinute ?? 60,
      responseTimeoutMs: initialData?.responseTimeoutMs ?? 5000,
      idempotancyEnabled: initialData?.isIdempotencyEnabled || false,
      active: initialData?.active ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        routeId: initialData?.routeId || '',
        name: initialData?.name || '',
        pathPattern: initialData?.pathPattern || '',
        targetBaseUrl: initialData?.targetBaseUrl || '',
        targetPathPrefix: initialData?.targetPathPrefix || '',
        requestsPerMinute: initialData?.requestsPerMinute ?? 60,
        responseTimeoutMs: initialData?.responseTimeoutMs ?? 5000,
        idempotancyEnabled: initialData?.isIdempotencyEnabled || false,
        active: initialData?.active ?? true,
      });
      setSelectedMethods(initialData?.allowedMethods || ['GET']);
    }
  }, [open, initialData, reset]);

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const onSubmit = async (data: FormData) => {
    if (selectedMethods.length === 0) {
      toast.error('Please select at least one HTTP method');
      return;
    }

    const payload: RouteRequest = {
      ...data,
      requestsPerMinute: Number(data.requestsPerMinute) || 0,
      responseTimeoutMs: Number(data.responseTimeoutMs) || 5000,
      allowedMethods: selectedMethods,
      // Retain existing header rules on edit, or start with empty array on create
      headerRules:
        initialData?.headerRules?.map((r) => ({
          direction: r.direction,
          action: r.action,
          headerName: r.headerName,
          headerValue: r.headerValue,
        })) || [],
    };

    try {
      if (isEditing && initialData) {
        await updateRoute({ id: initialData.id, payload });
        toast.success('Route updated successfully');
      } else {
        await createRoute(payload);
        toast.success('API route created successfully');
      }
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || `Failed to ${isEditing ? 'update' : 'create'} route`);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={isEditing ? 'Edit API Route' : 'Create API Route'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="routeId">Route ID</Label>
            <Input
              id="routeId"
              placeholder="e.g. user-service-v1"
              {...register('routeId', {
                required: 'Route ID is required',
                maxLength: { value: 100, message: 'Max 100 characters' },
              })}
              error={!!errors.routeId}
            />
            <FieldError message={errors.routeId?.message} />
          </div>

          <div>
            <Label htmlFor="name">Route Name</Label>
            <Input
              id="name"
              placeholder="e.g. User Service"
              {...register('name', {
                required: 'Name is required',
                maxLength: { value: 200, message: 'Max 200 characters' },
              })}
              error={!!errors.name}
            />
            <FieldError message={errors.name?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="pathPattern">Path Pattern</Label>
          <Input
            id="pathPattern"
            placeholder="e.g. /api/v1/users/**"
            {...register('pathPattern', {
              required: 'Path pattern is required',
              maxLength: { value: 500, message: 'Max 500 characters' },
            })}
            error={!!errors.pathPattern}
          />
          <FieldError message={errors.pathPattern?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetBaseUrl">Target Base URL</Label>
            <Input
              id="targetBaseUrl"
              placeholder="e.g. http://user-backend:8080"
              {...register('targetBaseUrl')}
            />
          </div>

          <div>
            <Label htmlFor="targetPathPrefix">Target Path Prefix (Optional)</Label>
            <Input
              id="targetPathPrefix"
              placeholder="e.g. /internal"
              {...register('targetPathPrefix')}
            />
          </div>
        </div>

        {/* Allowed Methods Buttons */}
        <div>
          <Label>Allowed HTTP Methods</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {HTTP_METHODS.map((method) => {
              const checked = selectedMethods.includes(method);
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => toggleMethod(method)}
                  className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    checked
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface text-text-secondary hover:bg-bg'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="requestsPerMinute">Rate Limit (requests / min)</Label>
            <Input
              id="requestsPerMinute"
              type="number"
              min="0"
              placeholder="60"
              {...register('requestsPerMinute', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="responseTimeoutMs">Response Timeout (ms)</Label>
            <Input
              id="responseTimeoutMs"
              type="number"
              min="100"
              placeholder="5000"
              {...register('responseTimeoutMs', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex items-center gap-8 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              {...register('active')}
            />
            Active Route
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              {...register('idempotancyEnabled')}
            />
            Enable Idempotency
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Route'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
