"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { FlaskConical, ShieldCheck, UserRound } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";

function Form() {
  const { signIn } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = signIn(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast("Signed in (demo mode).", "success");
    const next = search.get("next");
    router.push(next && next.startsWith("/") ? next : "/dashboard");
  };

  const quick = (acct: (typeof siteConfig.demoAccounts)[number]) => {
    setEmail(acct.email);
    setPassword(acct.password);
    setError(null);
  };

  return (
    <form onSubmit={submit} className="hairline-card mt-6 space-y-4 p-6">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      <button type="submit" className="btn-primary w-full">Sign in</button>

      <div className="border-t border-hairline pt-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <FlaskConical size={12} aria-hidden /> Demo accounts — tap to fill
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {siteConfig.demoAccounts.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => quick(a)}
              className="flex min-h-[44px] flex-col items-start rounded-lg border border-hairline bg-surface-900 px-3 py-2 text-left transition-colors hover:border-cyan/40"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                {a.role === "admin" ? <ShieldCheck size={12} className="text-lime" /> : <UserRound size={12} className="text-cyan" />}
                {a.role === "admin" ? "Admin" : "Member"}
              </span>
              <span className="mt-0.5 text-[11px] text-muted">{a.email} / {a.password}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-muted">
        No account? <Link href="/signup" className="text-cyan hover:underline">Request access</Link>
      </p>
    </form>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="skeleton mt-6 h-96 w-full" />}>
      <Form />
    </Suspense>
  );
}
