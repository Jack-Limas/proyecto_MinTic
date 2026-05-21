import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/lib/Providers";

export const metadata: Metadata = {
  title: "Observatorio de Cultura y Turismo — Colombia",
  description: "Plataforma interactiva de datos para el análisis del turismo y cultura en Colombia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-background text-textprimary min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 min-h-0">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}