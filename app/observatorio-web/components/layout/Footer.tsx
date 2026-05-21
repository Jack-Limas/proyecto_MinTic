import { BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/10 px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-turismo w-5 h-5" />
          <span className="text-sm font-semibold ">Observatorio de Cultura y Turismo</span>
        </div>
        <p className="text-xs text-textsecondary text-center">
          Proyecto TIC — Isabella Tello · Juan Maya · Jack Limas · David Ramírez · 2026
        </p>
        <p className="text-xs text-textsecondary">Colombia 🇨🇴</p>
      </div>
    </footer>
  );
}