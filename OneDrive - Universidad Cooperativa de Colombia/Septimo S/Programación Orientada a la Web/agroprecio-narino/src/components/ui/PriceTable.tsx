import type { PriceQuote } from '@/domain/entities/PriceQuote';
import { formatCOP } from '@/lib/format';

export function PriceTable({ quotes }: { quotes: readonly PriceQuote[] }) {
  if (quotes.length === 0) {
    return (
      <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
        No hay resultados para esos filtros.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-100 text-stone-600">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Mercado</th>
            <th className="px-4 py-3">Ciudad</th>
            <th className="px-4 py-3 text-right">Precio</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={`${quote.productSlug}-${quote.city}`} className="border-t border-stone-100">
              <td className="px-4 py-3 font-semibold">
                {quote.emoji} {quote.productName}
              </td>
              <td className="px-4 py-3">{quote.marketName}</td>
              <td className="px-4 py-3">{quote.city}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatCOP(quote.pricePerUnit)} / {quote.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}