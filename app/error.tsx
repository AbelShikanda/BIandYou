"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-xl font-semibold">Something broke</h1>
      <p className="mt-2 text-sm text-muted">An unexpected error occurred while rendering this view.</p>
      <div className="mt-6 flex gap-2">
        <button className="btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  );
}
