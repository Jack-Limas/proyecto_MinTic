import { PageHeader } from '@/components/ui/PageHeader';
import { RenderBadge } from '@/components/ui/RenderBadge';
import { priceService } from '@/lib/container';
import { formatCOP } from '@/lib/format';

export const revalidate = 30;

export default async function IsrBulletinPage() {
  const bulletin = await priceService.getBulletin();
  const generatedAt = new Date().toISOString();

  return (
    <>
      <PageHeader
        title="Boletín de precios"
        subtitle="Mejor y peor plaza por producto. La página se regenera en segundo plano cada 30 segundos."
      />
      <RenderBadge pattern="isr" generatedAt={generatedAt} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {bulletin.map(({ product, best, lowest, average }) => (
          <article key={product.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-extrabold">
              {product.emoji} {product.name}
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-emerald-800">🏆 Mejor precio para vender</dt>
                <dd>
                  {best.city}: {formatCOP(best.pricePerUnit)} / {product.unit}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-red-800">Precio más bajo</dt>
                <dd>
                  {lowest.city}: {formatCOP(lowest.pricePerUnit)} / {product.unit}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Promedio departamental</dt>
                <dd>
                  {formatCOP(average)} / {product.unit}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}