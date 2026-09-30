import Link from 'next/link';
import { RENDERING_PATTERNS } from '@/lib/patterns';

export function SiteNav() {
  return (
    <header className="bg-emerald-900 text-emerald-50">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
        <Link href="/" className="mr-auto text-base font-extrabold">
          🌱 AgroPrecio Nariño
        </Link>
        {RENDERING_PATTERNS.map((pattern) => (
          <Link
            key={pattern.id}
            href={pattern.href}
            className="rounded-full px-3 py-1 font-semibold hover:bg-emerald-700"
          >
            {pattern.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}