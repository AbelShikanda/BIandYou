"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Briefcase, GraduationCap, Wrench } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import type { MemberKind } from "@/lib/mock-data";

const kinds: { value: MemberKind; label: string; hint: string; icon: typeof Briefcase }[] = [
  { value: "startup", label: "Startup", hint: "Founder / building a company", icon: Briefcase },
  { value: "student", label: "Student", hint: "In school, hungry to build", icon: GraduationCap },
  { value: "tech", label: "Tech", hint: "Engineer / designer / product", icon: Wrench },
];

export default function SignupForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kind, setKind] = useState<MemberKind>("startup");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = signUp(name, email, password, kind);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast("Welcome to the network (demo mode).", "success");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={submit} className="hairline-card mt-6 space-y-4 p-6">
      <div>
        <label htmlFor="name" className="label">Name</label>
        <input id="name" required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" type="password" required minLength={3} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="≥ 3 characters (demo)" autoComplete="new-password" />
      </div>
      <fieldset>
        <legend className="label">I am a…</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Account type">
          {kinds.map(({ value, label, hint, icon: Icon }) => {
            const active = kind === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setKind(value)}
                className={`flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center transition-all ${
                  active ? "border-cyan/60 bg-cyan/5 shadow-glow-cyan" : "border-hairline bg-surface-900 hover:border-cyan/30"
                }`}
              >
                <Icon size={20} className={active ? "text-cyan" : "text-muted"} aria-hidden />
                <span className="text-xs font-semibold text-white">{label}</span>
                <span className="hidden text-[9px] leading-tight text-muted sm:block">{hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      <button type="submit" className="btn-primary w-full">Request access</button>
      <p className="text-center text-xs text-muted">
        Already a member? <Link href="/login" className="text-cyan hover:underline">Sign in</Link> · branding & copy are {siteConfig.logoPlaceholder.toLowerCase()}
      </p>
    </form>
  );
}
