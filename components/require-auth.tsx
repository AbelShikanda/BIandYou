"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { CardSkeleton } from "@/components/states";

export function RequireAuth({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { session, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={4} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="rounded-2xl border border-hairline bg-surface-800 p-4">
          <Lock size={28} className="text-cyan" aria-hidden />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted">This area is members-only. Sign in with a demo account to explore.</p>
        <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="btn-primary mt-6">Go to sign in</Link>
      </div>
    );
  }

  if (admin && session.role !== "admin") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="rounded-2xl border border-hairline bg-surface-800 p-4">
          <Lock size={28} className="text-lime" aria-hidden />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-sm text-muted">Your account ({session.role}) can&apos;t view the admin console.</p>
        <Link href="/dashboard" className="btn-ghost mt-6">Back to dashboard</Link>
      </div>
    );
  }

  return <>{children}</>;
}
