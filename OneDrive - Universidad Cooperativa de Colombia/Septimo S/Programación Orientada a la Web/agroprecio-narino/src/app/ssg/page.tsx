import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { RenderBadge } from '@/components/ui/RenderBadge';
import { priceService } from '@/lib/container';

export const dynamic = 'force-static';

export default async function SsgCatalogPage() {
  const catalog = await priceService.getCatalog();
  const generatedAt = new Date().toISOString();

  return (
    <>
      <PageHeader
        title="Catálogo y guías de cultivo"
        subtitle="Contenido estable: se genera una sola vez durante el build."
      />
      <RenderBadge pattern="ssg" generatedAt={generatedAt} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {catalog.map((product) => (
          <Link
            key={product.id}
            href={`/ssg/${product.slug}`}
            className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-3xl">{product.emoji}</p>
            <h2 className="mt-2 text-xl font-extrabold">{product.name}</h2>
            <p className="mt-1 text-sm text-stone-600">{product.description}</p>
            <p className="mt-3 text-xs font-semibold text-amber-800">Ver guía de cultivo →</p>
          </Link>
        ))}
      </div>
    </>
  );
}