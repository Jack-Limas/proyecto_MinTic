import { PageHeader } from '@/components/ui/PageHeader';
import { PriceTable } from '@/components/ui/PriceTable';
import { RenderBadge } from '@/components/ui/RenderBadge';
import { priceService } from '@/lib/container';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ? raw : undefined;
}

export default async function SsrPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const city = readParam(params.city);
  const productSlug = readParam(params.product);

  const [quotes, markets, catalog] = await Promise.all([
    priceService.getQuotes({ city, productSlug }),
    priceService.getMarkets(),
    priceService.getCatalog(),
  ]);
  const generatedAt = new Date().toISOString();

  return (
    <>
      <PageHeader
        title="Buscador de precios"
        subtitle="Filtra por ciudad y producto. Cada búsqueda se renderiza en el servidor."
      />
      <RenderBadge pattern="ssr" generatedAt={generatedAt} />

      <form
        method="get"
        className="my-6 flex flex-wrap items-end gap-4 rounded-2xl border border-stone-200 bg-white p-4"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Ciudad
          <select
            name="city"
            defaultValue={city ?? ''}
            className="rounded-lg border border-stone-300 px-3 py-2 font-normal"
          >
            <option value="">Todas</option>
            {markets.map((market) => (
              <option key={market.id} value={market.city}>
                {market.city}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Producto
          <select
            name="product"
            defaultValue={productSlug ?? ''}
            className="rounded-lg border border-stone-300 px-3 py-2 font-normal"
          >
            <option value="">Todos</option>
            {catalog.map((product) => (
              <option key={product.id} value={product.slug}>
                {product.emoji} {product.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800"
        >
          Buscar
        </button>
      </form>

      <p className="mb-3 text-sm text-stone-600">{quotes.length} resultado(s)</p>
      <PriceTable quotes={quotes} />
    </>
  );
}