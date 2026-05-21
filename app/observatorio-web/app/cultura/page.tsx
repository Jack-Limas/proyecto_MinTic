"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, ArrowRight, MapPin, Users, Building2, BookOpen, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useState } from "react";

const ORGANIZACIONES_DASHBOARD_URL = "https://app.powerbi.com/view?r=eyJrIjoiMDU1NGVlMjAtMzU2NC00YWE4LWFkZTYtZWE3YzZlOWRiYWRlIiwidCI6IjhkMzY4MzZlLTZiNzUtNGRlNi1iYWI5LTVmNGIxNzc1NDI3ZiIsImMiOjR9";
const ESPACIOS_DASHBOARD_URL = "https://app.powerbi.com/view?r=eyJrIjoiZGU3ZDFiMDUtMmQzYy00YTNmLTk0Y2QtZDU3NThlZDZlMTM5IiwidCI6IjhkMzY4MzZlLTZiNzUtNGRlNi1iYWI5LTVmNGIxNzc1NDI3ZiIsImMiOjR9";

const POWER_BI_DASHBOARD_URLS: Record<string, string> = {
  general: ORGANIZACIONES_DASHBOARD_URL,
  espacios_tipo: ESPACIOS_DASHBOARD_URL,
  espacios_departamento: ESPACIOS_DASHBOARD_URL,
  organizaciones_tipo: ORGANIZACIONES_DASHBOARD_URL,
  naturaleza_juridica: ORGANIZACIONES_DASHBOARD_URL,
  organizaciones_departamento: ORGANIZACIONES_DASHBOARD_URL,
};

const POWER_BI_PAGE_NAMES: Record<string, string> = {
  general: "3ce7c9b0c4e41d116601",
  espacios_tipo: "275d35ae96de7110e025",
  espacios_departamento: "f86dbd124092524a4c48",
  organizaciones_tipo: "5f30f81c2b1ad878539e",
  naturaleza_juridica: "dbc4a6b707ca35ba5d90",
  organizaciones_departamento: "a696e922b9845425d5dd",
};

const POWER_BI_TITLES: Record<string, string> = {
  general: "Cultura",
  espacios_tipo: "Espacios por Tipo",
  espacios_departamento: "Espacios por Departamento",
  organizaciones_tipo: "Organizaciones por Tipo",
  naturaleza_juridica: "Naturaleza Juridica",
  organizaciones_departamento: "Organizaciones por Departamento",
};

function PowerBIModal({ tab, onClose }: { tab: string; onClose: () => void }) {
  const tabName = POWER_BI_TITLES[tab] ?? POWER_BI_TITLES.general;
  const pageName = POWER_BI_PAGE_NAMES[tab] ?? POWER_BI_PAGE_NAMES.general;
  const dashboardUrl = POWER_BI_DASHBOARD_URLS[tab] ?? POWER_BI_DASHBOARD_URLS.general;
  const src = `${dashboardUrl}&pageName=${pageName}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl bg-[#1A1D2E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-cultura" />
              <span className="text-white font-semibold text-sm">{tabName}</span>
              <span className="text-xs text-textsecondary bg-cultura/10 border border-cultura/20 px-2 py-0.5 rounded-full">Power BI</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textsecondary hover:text-cultura transition p-1.5 rounded-lg hover:bg-cultura/10"
                title="Abrir en nueva pestana"
              >
                <Maximize2 className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="text-textsecondary hover:text-white transition p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full" style={{ height: "75vh" }}>
            <iframe
              title={tabName}
              src={src}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="block"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CulturaPage() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const kpis = [
    { id: "espacios", label: "Espacios Culturales", value: "29,976", color: "text-cultura" },
    { id: "organizaciones", label: "Organizaciones", value: "26,944", color: "text-cultura" },
    { id: "entidades", label: "Total Entidades", value: "56,920", color: "text-cultura" },
    { id: "departamentos", label: t("kpi_departamentos"), value: "32", color: "text-cultura" },
  ];

  const indicadores = [
    {
      id: "espacios_tipo",
      titulo: t("cultura_i1_title"),
      descripcion: t("cultura_i1_desc"),
      icono: Building2,
      dataset: "espacios_cultura.csv",
      stat: "29,976 espacios",
      pagina: "pagina 1",
    },
    {
      id: "espacios_departamento",
      titulo: t("cultura_i2_title"),
      descripcion: t("cultura_i2_desc"),
      icono: MapPin,
      dataset: "espacios_cultura.csv",
      stat: `32 ${t("kpi_departamentos").toLowerCase()}`,
      pagina: "pagina 2",
    },
    {
      id: "organizaciones_tipo",
      titulo: t("cultura_i3_title"),
      descripcion: t("cultura_i3_desc"),
      icono: BookOpen,
      dataset: "organizaciones_cultura.csv",
      stat: "26,944 organizaciones",
      pagina: "pagina 2",
    },
    {
      id: "naturaleza_juridica",
      titulo: t("cultura_i4_title"),
      descripcion: t("cultura_i4_desc"),
      icono: Users,
      dataset: "organizaciones_cultura.csv",
      stat: "Multiples figuras juridicas",
      pagina: "pagina 3",
    },
    {
      id: "organizaciones_departamento",
      titulo: t("cultura_i5_title"),
      descripcion: t("cultura_i5_desc"),
      icono: MapPin,
      dataset: "organizaciones_cultura.csv",
      stat: "Cobertura nacional",
      pagina: "pagina 4",
    },
  ];

  return (
    <div className="page-bg w-full flex flex-col items-center">
      {activeTab && (
        <PowerBIModal tab={activeTab} onClose={() => setActiveTab(null)} />
      )}

      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-cultura/10 rounded-2xl flex items-center justify-center mb-6 border border-cultura/30">
            <Landmark className="w-8 h-8 text-cultura" />
          </div>
          <p className="text-cultura text-xs uppercase tracking-widest font-medium mb-2">{t("cat_label")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("cultura_title")}</h1>
          <p className="text-textsecondary text-lg max-w-2xl">{t("cultura_subtitle")}</p>
          <Link href="/" className="mt-4 text-textsecondary/50 text-sm hover:text-cultura transition">{t("back")}</Link>
        </motion.div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={`${lang}-${kpi.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="glass-card p-6 text-center border border-cultura/20">
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-textsecondary text-xs mt-2">{kpi.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button
            onClick={() => setActiveTab("general")}
            className="w-full glass-card p-5 border border-cultura/40 hover:border-cultura hover:shadow-cultura/10 hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cultura/20 rounded-xl flex items-center justify-center">
                <Landmark className="w-6 h-6 text-cultura" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-base">
                  {t("nav_cultura")} - Dashboard General
                </p>
                <p className="text-textsecondary text-xs mt-0.5">
                  Vista completa con los indicadores de organizaciones culturales.
                </p>
                <p className="text-xs font-medium text-cultura mt-1">
                  Al abrir Power BI, se encuentra en la pagina 1.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-cultura text-white text-xs font-semibold px-4 py-2 rounded-lg group-hover:bg-cultura/80 transition">
              {t("ver_dashboard")} <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </motion.div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 pb-16 flex flex-col items-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-textsecondary text-xs uppercase tracking-widest font-medium mb-8 self-start">
          {t("indicators")}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {indicadores.map((ind, i) => {
            const Icon = ind.icono;
            return (
              <motion.div key={ind.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card p-6 border border-cultura/30 hover:border-cultura transition-all duration-300 group flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-cultura/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cultura" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base mb-1">{ind.titulo}</h3>
                    <p className="text-textsecondary text-sm leading-relaxed">{ind.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-textsecondary/50">{ind.dataset}</span>
                    <p className="text-xs font-medium text-cultura mt-0.5">{ind.stat}</p>
                    <p className="text-xs text-textsecondary mt-1">
                      Al abrir Power BI, se encuentra en la {ind.pagina}.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab(ind.id)}
                    className="flex items-center gap-2 text-xs font-semibold text-cultura bg-cultura/10 px-4 py-2 rounded-lg border border-cultura/20 hover:bg-cultura/20 transition"
                  >
                    {t("ver_dashboard")} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
