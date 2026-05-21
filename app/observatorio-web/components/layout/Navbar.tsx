"use client";
import Link from "next/link";
import { BarChart3, Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLang } from "@/lib/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  // Solo renderizar íconos de tema después de montar en cliente
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <nav className="w-full bg-[#1A1D2E] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-turismo/20 p-2 rounded-lg group-hover:bg-turismo/30 transition">
          <BarChart3 className="text-turismo w-5 h-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Observatorio C&T</p>
          <p className="text-xs text-slate-400">Colombia</p>
        </div>
      </Link>

      {/* Links desktop */}
      <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
        <Link href="/"          className="hover:text-white transition">{t("nav_inicio")}</Link>
        <Link href="/turismo"   className="hover:text-turismo transition">{t("nav_turismo")}</Link>
        <Link href="/cultura"   className="hover:text-cultura transition">{t("nav_cultura")}</Link>
        <Link href="/movilidad" className="hover:text-movilidad transition">{t("nav_movilidad")}</Link>
        <Link href="/analisis"  className="hover:text-amber transition">{t("nav_analisis")}</Link>
      </div>

      {/* Controles desktop */}
      <div className="hidden md:flex items-center gap-2">
        {/* Toggle idioma */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 border border-white/10 px-3 py-1.5 rounded-lg hover:border-turismo hover:text-turismo transition"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === "es" ? "EN" : "ES"}
        </button>

        {/* Toggle tema — solo renderiza después de mounted */}
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 border border-white/10 px-3 py-1.5 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {isDark ? "Light" : "Dark"}
          </button>
        )}
      </div>

      {/* Mobile button */}
      <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-[#1A1D2E] border-b border-white/10 flex flex-col gap-4 px-6 py-4 md:hidden">
          <Link href="/"          className="text-slate-400 hover:text-white"      onClick={() => setOpen(false)}>{t("nav_inicio")}</Link>
          <Link href="/turismo"   className="text-slate-400 hover:text-turismo"    onClick={() => setOpen(false)}>{t("nav_turismo")}</Link>
          <Link href="/cultura"   className="text-slate-400 hover:text-cultura"    onClick={() => setOpen(false)}>{t("nav_cultura")}</Link>
          <Link href="/movilidad" className="text-slate-400 hover:text-movilidad"  onClick={() => setOpen(false)}>{t("nav_movilidad")}</Link>
          <Link href="/analisis"  className="text-slate-400 hover:text-amber"      onClick={() => setOpen(false)}>{t("nav_analisis")}</Link>
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button onClick={toggleLang} className="flex items-center gap-1 text-xs text-slate-400 border border-white/10 px-3 py-1.5 rounded-lg">
              <Globe className="w-3 h-3" /> {lang === "es" ? "EN" : "ES"}
            </button>
            {mounted && (
              <button onClick={() => setTheme(isDark ? "light" : "dark")} className="flex items-center gap-1 text-xs text-slate-400 border border-white/10 px-3 py-1.5 rounded-lg">
                {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                {isDark ? "Light" : "Dark"}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}