import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RenderBadge } from '@/components/ui/RenderBadge';
import { priceService } from '@/lib/container';

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await priceService.getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await priceService.getProductBySlug(slug);
  return { title: product ? `${product.name} · AgroPrecio Nariño` : 'AgroPrecio Nariño' };
}

export default async function ProductGuidePage({ params }: Props) {
  const { slug } = await params;
  const product = await priceService.getProductBySlug(slug);
  if (!product) notFound();

  const generatedAt = new Date().toISOString();

  return (
    <>
      <Link href="/ssg" className="text-sm font-semibold text-amber-800 hover:underline">
        ← Volver al catálogo
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold text-emerald-950">
        {product.emoji} {product.name}
      </h1>
      <p className="mt-1 mb-6 text-stone-600">{product.description}</p>
      <RenderBadge pattern="ssg" generatedAt={generatedAt} />

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
        <p className="text-sm">
          <span className="font-semibold">Altitud recomendada:</span> {product.altitude}
        </p>
        <h2 className="mt-4 text-lg font-extrabold">Guía de cultivo</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
          {product.growingGuide.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </>
  );
}