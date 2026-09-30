import { PageAge } from '@/components/ui/PageAge';
import { formatDateTime } from '@/lib/format';
import { getPattern, type PatternId } from '@/lib/patterns';

interface RenderBadgeProps {
  readonly pattern: PatternId;
  readonly generatedAt: string | null;
}

export function RenderBadge({ pattern, generatedAt }: RenderBadgeProps) {
  const info = getPattern(pattern);

  return (
    <div className={`rounded-2xl border p-4 ${info.accent}`}>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-xl font-extrabold">{info.label}</span>
        <span className="text-sm font-semibold">{info.title}</span>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Datos generados</dt>
          <dd>{generatedAt ? formatDateTime(generatedAt) : 'Aún cargando…'}</dd>
        </div>
        <div>
          <dt className="font-semibold">Antigüedad de esta vista</dt>
          <dd>{generatedAt ? <PageAge generatedAt={generatedAt} /> : '—'}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs opacity-80">{info.verifyHint}</p>
    </div>
  );
}