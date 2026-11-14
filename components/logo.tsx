import { siteConfig } from "@/lib/site-config";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={siteConfig.name}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="16" cy="16" r="15" stroke="#00E5FF" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="16" cy="9" r="2.6" fill="#00E5FF" />
        <circle cx="9" cy="21" r="2.1" fill="#7C3AED" />
        <circle cx="23" cy="21" r="2.1" fill="#A3FF12" />
        <line x1="16" y1="9" x2="9" y2="21" stroke="#00E5FF" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="16" y1="9" x2="23" y2="21" stroke="#7C3AED" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="9" y1="21" x2="23" y2="21" stroke="#A3FF12" strokeOpacity="0.4" strokeWidth="1.2" />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-white">
          {siteConfig.logoText}
          <span className="text-cyan">.</span>
        </span>
      )}
    </span>
  );
}
