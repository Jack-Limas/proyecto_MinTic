"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, ArrowRight, MapPin, BarChart3, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useState } from "react";

const DASHBOARD_URL = "https://app.powerbi.com/view?r=eyJrIjoiZGYwNWVlMmYtMjRiNS00YmQ0LWJjOTEtNzAwMGFmMTcwN2Q1IiwidCI6IjhkMzY4MzZlLTZiNzUtNGRlNi1iYWI5LTVmNGIxNzc1NDI3ZiIsImMiOjR9";

const POWER_BI_PAGE_NAMES: Record<string, string> = {
  general: "08dba7705b63e25d640d",
  sitios_grupo: "e2d8108be97130e3bc30",
  sitios_arqueologicos_departamento: "6bf26e1c972d18475ebb",
};

const POWER_BI_TITLES: Record<string, string> = {
  general: "Sitios y Patrimonio",
  sitios_grupo: "Sitios Turisticos por Grupo",
  sitios_arqueologicos_departamento: "Sitios Arqueologicos por Departamento",
};

function PowerBIModal({ tab, onClose }: { tab: string; onClose: () => void }) {
  const tabName = POWER_BI_TITLES[tab] ?? POWER_BI_TITLES.general;
  const pageName = POWER_BI_PAGE_NAMES[tab] ?? POWER_BI_PAGE_NAMES.general;
  const src = `${DASHBOARD_URL}&pageName=${pageName}`;

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
              <Bus className="w-5 h-5 text-movilidad" />
              <span className="text-white font-semibold text-sm">{tabName}</span>
              <span className="text-xs text-textsecondary bg-movilidad/10 border border-movilidad/20 px-2 py-0.5 rounded-full">Power BI</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textsecondary hover:text-movilidad transition p-1.5 rounded-lg hover:bg-movilidad/10"
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

export default function MovilidadPage() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const kpis = [
    { id: "sitios_turisticos", label: t("kpi_sitios_tur"), value: "50", color: "text-movilidad" },
    { id: "sitios_arqueologicos", label: t("kpi_sitios_arq"), value: "19,527", color: "text-movilidad" },
    { id: "departamentos", label: t("kpi_departamentos"), value: "32", color: "text-movilidad" },
    { id: "patrimonio", label: "Tipos de Patrimonio", value: "4", color: "text-movilidad" },
  ];

  const indicadores = [
    {
      id: "sitios_grupo",
      titulo: t("movilidad_i1_title"),
      descripcion: `${t("movilidad_i1_desc")} ${t("movilidad_i2_desc")}`,
      icono: BarChart3,
      dataset: "sitios_turisticos.csv",
      stat: "50 sitios turisticos - patrimonio nacional incluido",
      pagina: "pagina 2",
    },
    {
      id: "sitios_arqueologicos_departamento",
      titulo: t("movilidad_i3_title"),
      descripcion: `${t("movilidad_i3_desc")} ${t("movilidad_i4_desc")}`,
      icono: MapPin,
      dataset: "sitios_arqueologicos.csv",
      stat: "19,527 sitios - mapa arqueologico incluido",
      pagina: "pagina 3",
    },
  ];

  return (
    <div className="page-bg w-full flex flex-col items-center">
      {activeTab && (
        <PowerBIModal tab={activeTab} onClose={() => setActiveTab(null)} />
      )}

      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-movilidad/10 rounded-2xl flex items-center justify-center mb-6 border border-movilidad/30">
            <Bus className="w-8 h-8 text-movilidad" />
          </div>
          <p className="text-movilidad text-xs uppercase tracking-widest font-medium mb-2">{t("cat_label")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("movilidad_title")}</h1>
          <p className="text-textsecondary text-lg max-w-2xl">{t("movilidad_subtitle")}</p>
          <Link href="/" className="mt-4 text-textsecondary/50 text-sm hover:text-movilidad transition">{t("back")}</Link>
        </motion.div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={`${lang}-${kpi.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="glass-card p-6 text-center border border-movilidad/20">
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
            className="w-full glass-card p-5 border border-movilidad/40 hover:border-movilidad hover:shadow-movilidad/10 hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-movilidad/20 rounded-xl flex items-center justify-center">
                <Bus className="w-6 h-6 text-movilidad" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-base">
                  {t("nav_movilidad")} - Dashboard General
                </p>
                <p className="text-textsecondary text-xs mt-0.5">
                  Vista completa con sitios turisticos, patrimonio nacional y mapa arqueologico.
                </p>
                <p className="text-xs font-medium text-movilidad mt-1">
                  Al abrir Power BI, se encuentra en la pagina 1.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-movilidad text-white text-xs font-semibold px-4 py-2 rounded-lg group-hover:bg-movilidad/80 transition">
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
              <motion.div key={ind.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card p-6 border border-movilidad/30 hover:border-movilidad transition-all duration-300 group flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-movilidad/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-movilidad" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base mb-1">{ind.titulo}</h3>
                    <p className="text-textsecondary text-sm leading-relaxed">{ind.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-textsecondary/50">{ind.dataset}</span>
                    <p className="text-xs font-medium text-movilidad mt-0.5">{ind.stat}</p>
                    <p className="text-xs text-textsecondary mt-1">
                      Al abrir Power BI, se encuentra en la {ind.pagina}.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab(ind.id)}
                    className="flex items-center gap-2 text-xs font-semibold text-movilidad bg-movilidad/10 px-4 py-2 rounded-lg border border-movilidad/20 hover:bg-movilidad/20 transition"
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
