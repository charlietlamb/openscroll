import { Switch } from "@openscroll/ui/components/ui/switch";
import { cn } from "@openscroll/ui/lib/utils";

interface FilterRowProps {
  children: React.ReactNode;
  className?: string;
  enabled: boolean;
  label: string;
  onToggle: (enabled: boolean) => void;
}

export function FilterRow({
  label,
  enabled,
  onToggle,
  children,
  className,
}: FilterRowProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-secondary-foreground text-sm">{label}</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      <div
        className={cn(
          "transition-opacity",
          enabled ? "opacity-100" : "pointer-events-none opacity-40"
        )}
      >
        {children}
      </div>
    </div>
  );
}
