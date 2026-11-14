import { RequireAuth } from "@/components/require-auth";
import { BottomTabBar } from "@/components/bottom-tab-bar";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="pb-20 md:pb-0">{children}</div>
      <BottomTabBar />
    </RequireAuth>
  );
}
