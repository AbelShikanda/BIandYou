import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-24">
      <div className="text-center">
        <span className="chip border-lime/30 text-lime">demo mode</span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to {siteConfig.name}. Use the seeded demo accounts below.</p>
      </div>
      <LoginForm />
    </div>
  );
}
