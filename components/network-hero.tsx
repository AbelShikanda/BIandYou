"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NetworkScene = dynamic(() => import("@/components/network-scene"), {
  ssr: false,
  loading: () => <HeroPlaceholder />,
});

export function HeroPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.22),transparent_70%)] animate-pulseGlow" />
      <div className="absolute h-52 w-52 rounded-full border border-cyan/20" />
      <div className="absolute h-72 w-72 rounded-full border border-violet/20" />
      <div className="absolute h-96 w-96 rounded-full border border-hairline" />
      <div className="h-24 w-24 rounded-2xl border border-cyan/40 bg-surface-800 shadow-glow-cyan animate-floaty" />
    </div>
  );
}

export function NetworkHero({ nodes }: { nodes: { id: string; label: string; kind: "Member" | "Project" | "Event" }[] }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return <NetworkScene nodes={nodes} reducedMotion={reduced} />;
}
