export type PatternId = 'csr' | 'ssr' | 'ssg' | 'isr';

export interface RenderingPattern {
  readonly id: PatternId;
  readonly label: string;
  readonly title: string;
  readonly href: string;
  readonly useCase: string;
  readonly how: string;
  readonly advantage: string;
  readonly bottleneck: string;
  readonly verifyHint: string;
  readonly accent: string;
}

export const RENDERING_PATTERNS: readonly RenderingPattern[] = [
  {
    id: 'csr',
    label: 'CSR',
    title: 'Client-Side Rendering',
    href: '/csr',
    useCase: 'Simulador de ganancias: compara en qué plaza te conviene vender.',
    how: 'El servidor envía HTML casi vacío. El navegador descarga el JS, lo ejecuta y pide los datos.',
    advantage: 'UI muy interactiva; el servidor solo sirve archivos estáticos.',
    bottleneck: 'Cascada de red en el cliente; FCP y TTI lentos por el peso del bundle.',
    verifyHint: 'Abre la pestaña Network: los precios llegan con una petición a /api/prices hecha desde el navegador.',
    accent: 'border-sky-300 bg-sky-50 text-sky-900',
  },
  {
    id: 'ssr',
    label: 'SSR',
    title: 'Server-Side Rendering',
    href: '/ssr',
    useCase: 'Buscador de precios por ciudad y producto.',
    how: 'El servidor consulta los datos, compila el HTML y lo envía; luego el cliente lo hidrata con JS.',
    advantage: 'Excelente SEO y FCP muy rápido.',
    bottleneck: 'El servidor retiene la respuesta hasta tener todos los datos.',
    verifyHint: 'Recarga varias veces: la antigüedad siempre es de 0–1 s porque cada visita se renderiza en el servidor.',
    accent: 'border-violet-300 bg-violet-50 text-violet-900',
  },
  {
    id: 'ssg',
    label: 'SSG',
    title: 'Static Site Generation',
    href: '/ssg',
    useCase: 'Catálogo de productos y guías de cultivo.',
    how: 'El HTML se genera en tiempo de compilación (build time).',
    advantage: 'TTFB casi instantáneo; se cachea en CDN.',
    bottleneck: 'Inviable para datos muy dinámicos; builds enormes a gran escala.',
    verifyHint: 'La fecha es la del último despliegue: la antigüedad sigue creciendo aunque recargues.',
    accent: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  {
    id: 'isr',
    label: 'ISR',
    title: 'Incremental Static Regeneration',
    href: '/isr',
    useCase: 'Boletín de precios que se regenera cada 30 segundos.',
    how: 'Genera páginas estáticas en segundo plano bajo demanda (stale-while-revalidate).',
    advantage: 'Combina la velocidad de SSG con la frescura de SSR.',
    bottleneck: 'Complejidad en la orquestación e invalidación de la caché.',
    verifyHint: 'Pasados 30 s, la primera visita ve el dato viejo y dispara la regeneración; la siguiente ya ve el nuevo.',
    accent: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
];

export function getPattern(id: PatternId): RenderingPattern {
  const pattern = RENDERING_PATTERNS.find((item) => item.id === id);
  if (!pattern) throw new Error(`Unknown rendering pattern: ${id}`);
  return pattern;
}