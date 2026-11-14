import type { Metadata } from "next";
import { RequireAuth } from "@/components/require-auth";

export const metadata: Metadata = { robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth admin>
      <div className="pb-20 md:pb-0">{children}</div>
    </RequireAuth>
  );
}
