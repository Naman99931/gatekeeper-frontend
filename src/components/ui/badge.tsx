import { cn } from '@/lib/utils';

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'danger';
}) {
  const toneClasses = {
    neutral: 'bg-bg text-text-secondary border-border',
    success: 'bg-success-soft text-success border-success/20',
    danger: 'bg-danger-soft text-danger border-danger/20',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium',
        toneClasses
      )}
    >
      {children}
    </span>
  );
}
