import Link from 'next/link';
import { RENDERING_PATTERNS } from '@/lib/patterns';

export default function HomePage() {
  return (
    <>
      <section className="mb-10 rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-600 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-100">
          Taller · Patrones de rendering
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">AgroPrecio Nariño</h1>
        <p className="mt-3 max-w-2xl text-emerald-50">
          Precios de papa, café, panela y leche en las plazas de mercado de Nariño. Cada sección resuelve una
          parte del problema con un patrón de rendering distinto.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {RENDERING_PATTERNS.map((pattern) => (
          <Link
            key={pattern.id}
            href={pattern.href}
            className={`block rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${pattern.accent}`}
          >
            <h2 className="text-2xl font-extrabold">{pattern.label}</h2>
            <p className="text-sm font-semibold">{pattern.title}</p>
            <p className="mt-3 text-sm">{pattern.useCase}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-semibold">Funcionamiento</dt>
                <dd>{pattern.how}</dd>
              </div>
              <div>
                <dt className="font-semibold">Ventaja</dt>
                <dd>{pattern.advantage}</dd>
              </div>
              <div>
                <dt className="font-semibold">Cuello de botella</dt>
                <dd>{pattern.bottleneck}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </>
  );
}