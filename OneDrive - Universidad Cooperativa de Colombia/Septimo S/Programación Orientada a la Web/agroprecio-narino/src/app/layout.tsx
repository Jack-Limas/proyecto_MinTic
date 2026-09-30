import type { Metadata } from 'next';
import './globals.css';
import { SiteNav } from '@/components/ui/SiteNav';

export const metadata: Metadata = {
  title: 'AgroPrecio Nariño',
  description: 'Precios agrícolas de Nariño para comparar patrones de rendering: CSR, SSR, SSG e ISR.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-8 text-xs text-stone-500">
          Datos simulados con fines académicos · Taller de patrones clásicos de rendering
        </footer>
      </body>
    </html>
  );
}