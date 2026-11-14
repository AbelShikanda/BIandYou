import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold accent-text">404</p>
      <h1 className="mt-4 font-display text-xl font-semibold">Signal lost</h1>
      <p className="mt-2 text-sm text-muted">That node doesn&apos;t exist in the network — it may have moved or never shipped.</p>
      <Link href="/" className="btn-primary mt-6">Back to base</Link>
    </div>
  );
}
