import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
  title: "Join",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-20">
      <div className="text-center">
        <span className="chip border-lime/30 text-lime">demo mode</span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Request access</h1>
        <p className="mt-2 text-sm text-muted">Create your {siteConfig.name} account. Instant approval in demo mode.</p>
      </div>
      <SignupForm />
    </div>
  );
}
