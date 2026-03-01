import { Switch } from './switch';
import { cn } from '@/lib/utils';

interface FilterRowProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function FilterRow({ label, enabled, onToggle, children, className }: FilterRowProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary-foreground">{label}</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      <div className={cn('transition-opacity', enabled ? 'opacity-100' : 'opacity-40 pointer-events-none')}>
        {children}
      </div>
    </div>
  );
}
