'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  TRANSPORT_OPTIONS,
  createTransportStrategy,
  type TransportKind,
} from '@/application/strategies/TransportCostStrategy';
import { PageHeader } from '@/components/ui/PageHeader';
import { RenderBadge } from '@/components/ui/RenderBadge';
import type { PriceQuote } from '@/domain/entities/PriceQuote';
import { formatCOP } from '@/lib/format';

interface PricesResponse {
  readonly generatedAt: string;
  readonly quotes: PriceQuote[];
}

interface ProductOption {
  readonly slug: string;
  readonly label: string;
  readonly unit: string;
}

export function ProfitSimulator() {
  const [data, setData] = useState<PricesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [kind, setKind] = useState<TransportKind>('per-km');
  const [rate, setRate] = useState(TRANSPORT_OPTIONS[0].defaultRate);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/prices', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<PricesResponse>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo<ProductOption[]>(() => {
    const options = new Map<string, ProductOption>();
    data?.quotes.forEach((quote) => {
      if (!options.has(quote.productSlug)) {
        options.set(quote.productSlug, {
          slug: quote.productSlug,
          label: `${quote.emoji} ${quote.productName}`,
          unit: quote.unit,
        });
      }
    });
    return [...options.values()];
  }, [data]);

  const activeSlug = selectedSlug || products[0]?.slug || '';
  const activeUnit = products.find((product) => product.slug === activeSlug)?.unit ?? '';
  const activeOption = TRANSPORT_OPTIONS.find((option) => option.kind === kind) ?? TRANSPORT_OPTIONS[0];

  const results = useMemo(() => {
    if (!data) return [];
    const strategy = createTransportStrategy(kind, rate);
    return data.quotes
      .filter((quote) => quote.productSlug === activeSlug)
      .map((quote) => {
        const gross = quote.pricePerUnit * quantity;
        const cost = strategy.calculate(quote.distanceKm, quantity);
        return { quote, gross, cost, net: gross - cost };
      })
      .sort((a, b) => b.net - a.net);
  }, [data, activeSlug, quantity, kind, rate]);

  const handleKindChange = (next: TransportKind) => {
    setKind(next);
    const option = TRANSPORT_OPTIONS.find((item) => item.kind === next);
    if (option) setRate(option.defaultRate);
  };

  return (
    <>
      <PageHeader
        title="Simulador de ganancias"
        subtitle="Descubre en qué plaza de Nariño te conviene vender tu cosecha."
      />
      <RenderBadge pattern="csr" generatedAt={data?.generatedAt ?? null} />

      {error && (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
          No se pudieron cargar los precios ({error}).
        </p>
      )}

      {!data && !error && (
        <p className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
          Descargando precios desde /api/prices…
        </p>
      )}

      {data && (
        <>
          <div className="my-6 grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Producto
              <select
                value={activeSlug}
                onChange={(event) => setSelectedSlug(event.target.value)}
                className="rounded-lg border border-stone-300 px-3 py-2 font-normal"
              >
                {products.map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Cantidad ({activeUnit})
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                className="rounded-lg border border-stone-300 px-3 py-2 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Costo de transporte
              <select
                value={kind}
                onChange={(event) => handleKindChange(event.target.value as TransportKind)}
                className="rounded-lg border border-stone-300 px-3 py-2 font-normal"
              >
                {TRANSPORT_OPTIONS.map((option) => (
                  <option key={option.kind} value={option.kind}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Tarifa ({activeOption.rateLabel})
              <input
                type="number"
                min={0}
                value={rate}
                onChange={(event) => setRate(Math.max(0, Number(event.target.value) || 0))}
                className="rounded-lg border border-stone-300 px-3 py-2 font-normal"
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-100 text-stone-600">
                <tr>
                  <th className="px-4 py-3">Mercado</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Ingreso bruto</th>
                  <th className="px-4 py-3 text-right">Transporte</th>
                  <th className="px-4 py-3 text-right">Ganancia neta</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ quote, gross, cost, net }, index) => (
                  <tr
                    key={quote.city}
                    className={`border-t border-stone-100 ${index === 0 ? 'bg-emerald-50 font-semibold' : ''}`}
                  >
                    <td className="px-4 py-3">
                      {index === 0 ? '🏆 ' : ''}
                      {quote.city} <span className="text-xs text-stone-500">({quote.distanceKm} km)</span>
                    </td>
                    <td className="px-4 py-3 text-right">{formatCOP(quote.pricePerUnit)}</td>
                    <td className="px-4 py-3 text-right">{formatCOP(gross)}</td>
                    <td className="px-4 py-3 text-right">{formatCOP(cost)}</td>
                    <td className="px-4 py-3 text-right">{formatCOP(net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}