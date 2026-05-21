"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Tent, ArrowRight, MapPin, Users, Building2, TrendingUp, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useState } from "react";

const DASHBOARD_URL = "https://app.powerbi.com/view?r=eyJrIjoiMzUxNGIwYjctZGRjMy00MmEwLTg3M2MtNGVjMWE5ODg4M2ExIiwidCI6IjhkMzY4MzZlLTZiNzUtNGRlNi1iYWI5LTVmNGIxNzc1NDI3ZiIsImMiOjR9";

const TABS: Record<string, string | { title: string; pageName: string }> = {
  general: {
    title: "Turismo",
    pageName: "346c424568355402ce09",
  },
  prestadores_departamento: {
    title: "Prestadores por Departamento",
    pageName: "0100deeb932480c300a0",
  },
  categorias: {
    title: "Categorias de Prestadores",
    pageName: "cd78ec7523e4a3de7758",
  },
  empleos: {
    title: "Empleos generados",
    pageName: "c51f837e7905a9c454d0",
  },
  evolucion:                "Evolucion por año",
};

const POWER_BI_PAGE_NAMES: Record<string, string> = {
  general: "346c424568355402ce09",
  prestadores_departamento: "0100deeb932480c300a0",
  categorias: "cd78ec7523e4a3de7758",
  empleos: "c51f837e7905a9c454d0",
  evolucion: "246bf7053076b54459ec",
};

const POWER_BI_TITLES: Record<string, string> = {
  general: "Turismo",
  prestadores_departamento: "Prestadores por Departamento",
  categorias: "Categorias de Prestadores",
  empleos: "Empleos generados",
  evolucion: "Evolucion por año",
};

function PowerBIModal({ tab, onClose }: { tab: string; onClose: () => void }) {
  const tabInfo = TABS[tab] ?? TABS.general;
  const tabName = POWER_BI_TITLES[tab] ?? (typeof tabInfo === "string" ? tabInfo : tabInfo.title);
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
          {/* Header del modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Tent className="w-5 h-5 text-turismo" />
              <span className="text-white font-semibold text-sm">{tabName}</span>
              <span className="text-xs text-textsecondary bg-turismo/10 border border-turismo/20 px-2 py-0.5 rounded-full">Power BI</span>
            </div>
            <div className="flex items-center gap-2">
              
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textsecondary hover:text-turismo transition p-1.5 rounded-lg hover:bg-turismo/10"
                title="Abrir en nueva pestaña"
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

          {/* Iframe Power BI */}
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

export default function TurismoPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const kpis = [
    { label: t("kpi_prestadores"),   value: "50,000+", color: "text-turismo" },
    { label: t("kpi_departamentos"), value: "32",       color: "text-turismo" },
    { label: t("kpi_sitios_tur"),    value: "50",       color: "text-turismo" },
    { label: t("kpi_sitios_arq"),    value: "19,527",   color: "text-turismo" },
  ];

  const indicadores = [
    {
      id: "prestadores_departamento",
      titulo: t("turismo_i1_title"),
      descripcion: `${t("turismo_i1_desc")} ${t("turismo_i4_desc")}`,
      icono: MapPin,
      dataset: "registro_nacional_turismo.csv",
      stat: `32 ${t("kpi_departamentos").toLowerCase()} · RNT activos incluidos`,
    },
    {
      id: "categorias",
      titulo: t("turismo_i2_title"),
      descripcion: t("turismo_i2_desc"),
      icono: Building2,
      dataset: "registro_nacional_turismo.csv",
      stat: "Múltiples categorías",
    },
    {
      id: "empleos",
      titulo: t("turismo_i3_title"),
      descripcion: t("turismo_i3_desc"),
      icono: Users,
      dataset: "registro_nacional_turismo.csv",
      stat: "Empleos directos por departamento",
    },
    {
      id: "evolucion",
      titulo: t("turismo_i5_title"),
      descripcion: t("turismo_i5_desc"),
      icono: TrendingUp,
      dataset: "registro_nacional_turismo.csv",
      stat: "Serie histórica anual",
    },
  ];

  // IDs que tienen pestaña real en Power BI
  const tabsConDashboard = new Set(["prestadores_departamento", "categorias", "empleos", "evolucion"]);
  const dashboardPages: Record<string, string> = {
    prestadores_departamento: "pagina 2",
    categorias: "pagina 5",
    empleos: "pagina 3",
    evolucion: "pagina 4",
  };

  return (
    <div className="page-bg w-full flex flex-col items-center">

      {/* Modal Power BI */}
      {activeTab && (
        <PowerBIModal tab={activeTab} onClose={() => setActiveTab(null)} />
      )}

      {/* Header */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-turismo/10 rounded-2xl flex items-center justify-center mb-6 border border-turismo/30">
            <Tent className="w-8 h-8 text-turismo" />
          </div>
          <p className="text-turismo text-xs uppercase tracking-widest font-medium mb-2">{t("cat_label")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("turismo_title")}</h1>
          <p className="text-textsecondary text-lg max-w-2xl">{t("turismo_subtitle")}</p>
          <Link href="/" className="mt-4 text-textsecondary/50 text-sm hover:text-turismo transition flex items-center gap-1">
            {t("back")}
          </Link>
        </motion.div>
      </section>

      {/* KPIs */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="glass-card p-6 text-center border border-turismo/20">
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-textsecondary text-xs mt-2">{kpi.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Botón dashboard general */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button
            onClick={() => setActiveTab("general")}
            className="w-full glass-card p-5 border border-turismo/40 hover:border-turismo hover:shadow-turismo/10 hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-turismo/20 rounded-xl flex items-center justify-center">
                <Tent className="w-6 h-6 text-turismo" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-base">
                  {t("nav_turismo")} — Dashboard General
                </p>
                <p className="text-textsecondary text-xs mt-0.5">
                  Vista completa con todos los indicadores del sector turístico
                </p>
                <p className="text-xs font-medium text-turismo mt-1">
                  Al abrir Power BI, se encuentra en la pagina 1.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-turismo text-white text-xs font-semibold px-4 py-2 rounded-lg group-hover:bg-turismo/80 transition">
              {t("ver_dashboard")} <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </motion.div>
      </section>

      {/* Indicadores individuales */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16 flex flex-col items-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-textsecondary text-xs uppercase tracking-widest font-medium mb-8 self-start">
          {t("indicators")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {indicadores.map((ind, i) => {
            const Icon = ind.icono;
            const tieneDashboard = tabsConDashboard.has(ind.id);
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-6 border border-turismo/30 hover:border-turismo transition-all duration-300 group flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-turismo/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-turismo" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base mb-1">{ind.titulo}</h3>
                    <p className="text-textsecondary text-sm leading-relaxed">{ind.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-textsecondary/50">{ind.dataset}</span>
                    <p className="text-xs font-medium text-turismo mt-0.5">{ind.stat}</p>
                    <p className="text-xs text-textsecondary mt-1">
                      Al abrir Power BI, se encuentra en la {dashboardPages[ind.id]}.
                    </p>
                  </div>
                  {tieneDashboard ? (
                    <button
                      onClick={() => setActiveTab(ind.id)}
                      className="flex items-center gap-2 text-xs font-semibold text-turismo bg-turismo/10 px-4 py-2 rounded-lg border border-turismo/20 hover:bg-turismo/20 transition"
                    >
                      {t("ver_dashboard")} <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-xs text-textsecondary/40 italic px-4 py-2">
                      Sin vista separada
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
