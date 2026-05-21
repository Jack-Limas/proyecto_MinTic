"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Landmark, Bus, Tent } from "lucide-react";
import ColombiaMap from "@/components/maps/ColombiaMap";
import { useLang } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLang();

  const categories = [
    {
      href: "/turismo",
      icon: Tent,
      label: t("nav_turismo"),
      description: t("cat_turismo_desc"),
      border: "border-turismo/30",
      hover: "hover:border-turismo",
      bg: "bg-turismo/10",
      iconColor: "text-turismo",
      stats: t("cat_turismo_stat"),
    },
    {
      href: "/cultura",
      icon: Landmark,
      label: t("nav_cultura"),
      description: t("cat_cultura_desc"),
      border: "border-cultura/30",
      hover: "hover:border-cultura",
      bg: "bg-cultura/10",
      iconColor: "text-cultura",
      stats: t("cat_cultura_stat"),
    },
    {
      href: "/movilidad",
      icon: Bus,
      label: t("nav_movilidad"),
      description: t("cat_movilidad_desc"),
      border: "border-movilidad/30",
      hover: "hover:border-movilidad",
      bg: "bg-movilidad/10",
      iconColor: "text-movilidad",
      stats: t("cat_movilidad_stat"),
    },
  ];

  const kpis = [
    { label: t("kpi_departamentos"), value: "32",      color: "text-turismo"   },
    { label: t("kpi_sitios_arq"),    value: "19,527",  color: "text-cultura"   },
    { label: t("kpi_prestadores"),   value: "50,000+", color: "text-movilidad" },
    { label: t("kpi_sitios_tur"),    value: "50",      color: "text-amber"     },
  ];

  return (
    <div className="page-bg w-full flex flex-col items-center">

      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 bg-turismo/10 border border-turismo/30 text-turismo text-xs font-medium px-3 py-1 rounded-full mb-6">
            <MapPin className="w-3 h-3" /> {t("home_badge")}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t("home_title_1")}{" "}
            <span className="text-turismo">{t("home_title_2")}</span>{" "}
            {t("home_title_3")}{" "}
            <span className="text-movilidad">{t("home_title_4")}</span>
          </h1>
          <p className="text-textsecondary text-lg max-w-2xl mb-2">
            {t("home_subtitle")}
          </p>
          <p className="text-textsecondary/50 text-sm">{t("home_sources")}</p>
        </motion.div>
      </section>

      {/* Mapa + KPIs */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card p-6 flex flex-col items-center w-full"
        >
          <p className="text-textsecondary text-xs uppercase tracking-widest mb-6 font-medium">
            {t("home_map_label")}
          </p>
          <div className="w-full max-w-sm mx-auto">
            <ColombiaMap />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 w-full">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="text-center">
                <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-textsecondary text-xs mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3 Categorías */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-textsecondary text-xs font-medium uppercase tracking-widest mb-10"
        >
          {t("home_explore")}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.12 }}
              >
                <Link href={cat.href} className="block h-full">
                  <div className={`glass-card p-8 border ${cat.border} ${cat.hover} hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full flex flex-col`}>
                    <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className={`w-7 h-7 ${cat.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{cat.label}</h3>
                    <p className="text-textsecondary text-sm leading-relaxed flex-1">{cat.description}</p>
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className={`text-xs font-medium ${cat.iconColor}`}>{cat.stats}</span>
                      <ArrowRight className={`w-4 h-4 ${cat.iconColor} group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}