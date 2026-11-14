import { AlertTriangle, Inbox, type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  hint,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-hairline bg-surface-800 px-6 py-14 text-center">
      <Icon size={36} className="text-muted" aria-hidden />
      <h3 className="mt-4 font-display text-base font-semibold text-white">{title}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
      <AlertTriangle size={32} className="text-red-400" aria-hidden />
      <h3 className="mt-3 font-display text-base font-semibold text-white">Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <button className="btn-ghost mt-4" onClick={onRetry}>Try again</button>
      )}
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="hairline-card space-y-3 p-5" aria-hidden="true">
      <div className="skeleton h-4 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3 w-full" />
      ))}
    </div>
  );
}

export function Avatar({ name, color, size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-black"
      style={{ width: size, height: size, fontSize: size * 0.36, background: color ?? "#00E5FF" }}
    >
      {initials}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
