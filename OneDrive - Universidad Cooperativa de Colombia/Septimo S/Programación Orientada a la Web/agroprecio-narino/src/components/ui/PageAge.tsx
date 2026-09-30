'use client';

import { useEffect, useState } from 'react';
import { formatAge } from '@/lib/format';

export function PageAge({ generatedAt }: { generatedAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  if (now === null) return <span>calculando…</span>;
  const seconds = Math.max(0, Math.round((now - new Date(generatedAt).getTime()) / 1000));
  return <span>{formatAge(seconds)}</span>;
}