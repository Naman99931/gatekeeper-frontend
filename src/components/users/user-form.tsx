'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  createUserSchema,
  updateUserSchema,
  type UserFormValues,
} from '@/lib/validations/user';
import { useRoles } from '@/hooks/use-roles';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/user';

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  submitting,
}: {
  mode: 'create' | 'edit';
  defaultValues?: Partial<User>;
  onSubmit: (values: UserFormValues) => void;
  submitting: boolean;
}) {
  const router = useRouter();
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: {
      username: defaultValues?.username ?? '',
      email: defaultValues?.email ?? '',
      role: defaultValues?.role ?? '',
      enabled: defaultValues?.enabled ?? true,
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" error={!!errors.username} {...register('username')} />
        <FieldError message={errors.username?.message} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" error={!!errors.email} {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          disabled={rolesLoading}
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
          {...register('role')}
        >
          <option value="">Select a role…</option>
          {roles?.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.role?.message} />
      </div>

      <div>
        <Label htmlFor="password">
          Password {mode === 'edit' && <span className="text-text-muted">(leave blank to keep current)</span>}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          error={!!errors.password}
          {...register('password')}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="enabled"
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          {...register('enabled')}
        />
        <Label htmlFor="enabled" className="mb-0">
          Account enabled
        </Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={submitting}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  createUserSchema,
  updateUserSchema,
  type UserFormValues,
} from '@/lib/validations/user';
import { useRoles } from '@/hooks/use-roles';
import { Input } from '@/components/ui/input';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/user';

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  submitting,
}: {
  mode: 'create' | 'edit';
  defaultValues?: Partial<User>;
  onSubmit: (values: UserFormValues) => void;
  submitting: boolean;
}) {
  const router = useRouter();
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: {
      username: defaultValues?.username ?? '',
      email: defaultValues?.email ?? '',
      role: defaultValues?.role ?? '',
      enabled: defaultValues?.enabled ?? true,
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" error={!!errors.username} {...register('username')} />
        <FieldError message={errors.username?.message} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" error={!!errors.email} {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          disabled={rolesLoading}
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
          {...register('role')}
        >
          <option value="">Select a role…</option>
          {roles?.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.role?.message} />
      </div>

      <div>
        <Label htmlFor="password">
          Password {mode === 'edit' && <span className="text-text-muted">(leave blank to keep current)</span>}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          error={!!errors.password}
          {...register('password')}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="enabled"
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          {...register('enabled')}
        />
        <Label htmlFor="enabled" className="mb-0">
          Account enabled
        </Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={submitting}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
