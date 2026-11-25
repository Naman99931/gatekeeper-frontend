'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateRoute } from '@/hooks/use-routes';
import type { RouteResponse, RouteRequest } from '@/types/route';
import type { ApiError } from '@/lib/api/client';

interface FormData {
  direction: 'REQUEST' | 'RESPONSE';
  action: 'ADD' | 'REMOVE';
  headerName: string;
  headerValue: string;
}

export function CreateHeaderRuleModal({
  route,
  open,
  onClose,
}: {
  route: RouteResponse;
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: updateRoute, isPending } = useUpdateRoute();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      direction: 'REQUEST',
      action: 'ADD',
      headerName: '',
      headerValue: '',
    },
  });

  const selectedAction = watch('action');

  const onSubmit = async (data: FormData) => {
    // Append the new rule to existing rules
    const updatedRules = [
      ...(route.headerRules || []).map((r) => ({
        direction: r.direction,
        action: r.action,
        headerName: r.headerName,
        headerValue: r.headerValue,
      })),
      {
        direction: data.direction,
        action: data.action,
        headerName: data.headerName.trim(),
        headerValue: data.action === 'ADD' ? data.headerValue.trim() : '',
      },
    ];

    const payload: RouteRequest = {
      routeId: route.routeId,
      name: route.name,
      pathPattern: route.pathPattern,
      targetBaseUrl: route.targetBaseUrl || '',
      targetPathPrefix: route.targetPathPrefix || '',
      requestsPerMinute: route.requestsPerMinute || 0,
      responseTimeoutMs: route.responseTimeoutMs || 5000,
      idempotancyEnabled: route.isIdempotencyEnabled || false,
      active: route.active,
      allowedMethods: route.allowedMethods || ['GET'],
      headerRules: updatedRules,
    };

    try {
      await updateRoute({ id: route.id, payload });
      toast.success('Header rule added successfully');
      reset();
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || 'Failed to add header rule');
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" title="Add Custom Header Rule">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rule-direction">Direction</Label>
            <select
              id="rule-direction"
              className="w-full text-sm rounded border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
              {...register('direction')}
            >
              <option value="REQUEST">REQUEST (Forward to backend)</option>
              <option value="RESPONSE">RESPONSE (Return to client)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="rule-action">Action</Label>
            <select
              id="rule-action"
              className="w-full text-sm rounded border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
              {...register('action')}
            >
              <option value="ADD">ADD</option>
              <option value="REMOVE">REMOVE</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="rule-headerName">Header Name</Label>
          <Input
            id="rule-headerName"
            placeholder="e.g. X-Tenant-Id, Authorization"
            {...register('headerName', {
              required: 'Header name is required',
              maxLength: { value: 200, message: 'Max 200 characters' },
            })}
            error={!!errors.headerName}
          />
          <FieldError message={errors.headerName?.message} />
        </div>

        <div>
          <Label htmlFor="rule-headerValue">Header Value</Label>
          <Input
            id="rule-headerValue"
            placeholder={selectedAction === 'REMOVE' ? 'Not applicable for REMOVE action' : 'e.g. my-tenant-value'}
            disabled={selectedAction === 'REMOVE'}
            {...register('headerValue', {
              required: selectedAction === 'ADD' ? 'Header value is required for ADD' : false,
              maxLength: { value: 2000, message: 'Max 2000 characters' },
            })}
            error={!!errors.headerValue}
          />
          <FieldError message={errors.headerValue?.message} />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Add Header Rule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
