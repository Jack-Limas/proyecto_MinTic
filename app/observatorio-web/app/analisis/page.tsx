"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FlaskConical, CheckCircle2, TrendingUp, Users,
  BarChart2, ChevronRight, AlertCircle,
} from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-9 h-9 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
        <span className="text-amber text-sm font-bold">{n}</span>
      </div>
      <h2 className="text-white font-bold text-xl">{title}</h2>
    </div>
  );
}

export default function AnalisisPage() {
  const { t } = useLang();

  const kpis = [
    { label: t("analisis_s1_kpi1"), value: "32",      icon: <Users    className="w-5 h-5" /> },
    { label: t("analisis_s1_kpi2"), value: "49,380",  icon: <BarChart2 className="w-5 h-5" /> },
    { label: t("analisis_s1_kpi3"), value: "273,365", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const groups = [
    {
      id: "alto",
      label: t("analisis_group_high"),
      range: t("analisis_s2_alto_range"),
      accent: "text-turismo", border: "border-turismo/25", bg: "bg-turismo/8", dot: "bg-turismo",
      depts: "Bogotá, Antioquia, Bolívar, Valle del Cauca, Magdalena, Santander, Cundinamarca, San Andrés y Providencia, Meta, Quindío, Boyacá",
      n: 11,
    },
    {
      id: "medio",
      label: t("analisis_group_medium"),
      range: t("analisis_s2_medio_range"),
      accent: "text-amber", border: "border-amber/25", bg: "bg-amber/8", dot: "bg-amber",
      depts: "Atlántico, Tolima, Nariño, Risaralda, Norte de Santander, Caldas, Cesar, Huila, Sucre, Casanare",
      n: 10,
    },
    {
      id: "bajo",
      label: t("analisis_group_low"),
      range: t("analisis_s2_bajo_range"),
      accent: "text-movilidad", border: "border-movilidad/25", bg: "bg-movilidad/8", dot: "bg-movilidad",
      depts: "Cauca, Amazonas, Córdoba, Putumayo, Chocó, Caquetá, Arauca, Guaviare, Vichada, Guainía, Vaupés",
      n: 11,
    },
  ];

  const stats = [
    { id: "alto",  label: t("analisis_group_high"),   avg: "18,606", min: "4,712", max: "65,124", accent: "text-turismo",  bar: "bg-turismo",  pct: "100%", n: 11 },
    { id: "medio", label: t("analisis_group_medium"), avg: "5,386",  min: "1,685", max: "16,771", accent: "text-amber",    bar: "bg-amber",    pct: "29%",  n: 10 },
    { id: "bajo",  label: t("analisis_group_low"),    avg: "1,349",  min: "25",    max: "6,237",  accent: "text-movilidad", bar: "bg-movilidad", pct: "7%",  n: 11 },
  ];

  const tableHeaders = [
    t("analisis_t_g1"), t("analisis_t_g2"),
    t("analisis_t_diff"), t("analisis_t_padj"), t("analisis_t_sig"),
  ];

  const tableRows = [
    { g1: t("analisis_group_high"), g2: t("analisis_group_low"),    diff: "−17,257.18", padj: "0.0020", reject: true },
    { g1: t("analisis_group_high"), g2: t("analisis_group_medium"), diff: "−13,219.80", padj: "0.0222", reject: true },
    { g1: t("analisis_group_low"),  g2: t("analisis_group_medium"), diff: "  4,037.38", padj: "0.6670", reject: false },
  ];

  const tukeyPairs = [
    {
      id: "alto-bajo",
      pair: `${t("analisis_group_high")} vs ${t("analisis_group_low")}`,
      hasDiff: true,
      desc: t("analisis_tukey_alto_bajo"),
    },
    {
      id: "alto-medio",
      pair: `${t("analisis_group_high")} vs ${t("analisis_group_medium")}`,
      hasDiff: true,
      desc: t("analisis_tukey_alto_medio"),
    },
    {
      id: "bajo-medio",
      pair: `${t("analisis_group_low")} vs ${t("analisis_group_medium")}`,
      hasDiff: false,
      desc: t("analisis_tukey_bajo_medio"),
    },
  ];

  const conclusions = [
    { n: 1, text: t("analisis_c1"), stat: t("analisis_c1_stat") },
    { n: 2, text: t("analisis_c2"), stat: t("analisis_c2_stat") },
    { n: 3, text: t("analisis_c3"), stat: t("analisis_c3_stat") },
    { n: 4, text: t("analisis_c4"), stat: t("analisis_c4_stat") },
  ];

  return (
    <div className="page-bg w-full flex flex-col items-center gap-16 pb-28">

      {/* ── HERO ── */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-6 text-center">
        <motion.div {...fadeUp(0)} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-amber/10 rounded-2xl flex items-center justify-center mb-6 border border-amber/30">
            <FlaskConical className="w-8 h-8 text-amber" />
          </div>
          <p className="text-amber text-xs uppercase tracking-widest font-medium mb-2">
            {t("analisis_badge")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("analisis_title")}
          </h1>
          <p className="text-textsecondary text-lg max-w-2xl">
            {t("analisis_question")}
          </p>
          <p className="text-textsecondary/50 text-xs mt-3">
            {t("analisis_methods")}
          </p>
          <Link href="/" className="mt-5 text-textsecondary/50 text-sm hover:text-amber transition">
            {t("back")}
          </Link>
        </motion.div>
      </section>

      {/* ── PASO 1 — DATOS BASE ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.1)} className="glass-card p-8 border border-amber/20">
          <StepHeader n={1} title={t("analisis_s1_title")} />
          <p className="text-textsecondary text-sm mb-8">
            {t("analisis_s1_source_label")}{" "}
            <span className="text-amber font-medium">{t("analisis_s1_source_name")}</span>{" "}
            {t("analisis_s1_source_rest")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kpis.map(({ label, value, icon }) => (
              <div key={label} className="bg-amber/8 border border-amber/20 rounded-2xl p-6 text-center">
                <div className="flex justify-center text-amber mb-3">{icon}</div>
                <p className="text-3xl font-extrabold text-amber mb-2">{value}</p>
                <p className="text-textsecondary text-xs">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PASO 2 — CLASIFICACIÓN ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.15)} className="glass-card p-8 border border-white/10">
          <StepHeader n={2} title={t("analisis_s2_title")} />
          <p className="text-textsecondary text-sm mb-8">{t("analisis_s2_desc")}</p>
          <div className="space-y-5">
            {groups.map(({ id, label, range, accent, border, bg, dot, depts, n }) => (
              <div key={id} className={`border rounded-2xl p-6 ${border} ${bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                    <span className={`font-bold text-base ${accent}`}>{t("analisis_group")} {label}</span>
                    <span className={`text-xs font-medium ${accent} opacity-80`}>— {range}</span>
                  </div>
                  <span className="text-textsecondary text-xs bg-white/5 px-3 py-1 rounded-full">
                    {n} {t("analisis_depts_count")}
                  </span>
                </div>
                <p className="text-textsecondary text-sm leading-relaxed pl-4 border-l border-white/10">
                  {depts}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PASO 3 — ESTADÍSTICAS DESCRIPTIVAS ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.2)} className="glass-card p-8 border border-white/10">
          <StepHeader n={3} title={t("analisis_s3_title")} />
          <p className="text-textsecondary text-sm mb-8">{t("analisis_s3_desc")}</p>
          <div className="space-y-6">
            {stats.map(({ id, label, avg, min, max, accent, bar, pct, n }) => (
              <div key={id}>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className={`text-sm font-bold ${accent}`}>{t("analisis_group")} {label}</span>
                    <span className="text-textsecondary text-xs ml-2">({n} {t("analisis_depts_count")})</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-extrabold ${accent}`}>{avg}</p>
                    <p className="text-textsecondary text-xs">{t("analisis_avg_jobs")}</p>
                  </div>
                </div>
                <div className="h-3 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: pct }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <p className="text-textsecondary/50 text-xs mt-1">{t("analisis_range")}: {min} – {max}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PASO 4 — ANOVA ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.25)} className="glass-card p-8 border border-white/10">
          <StepHeader n={4} title={t("analisis_s4_title")} />
          <p className="text-textsecondary text-sm mb-8">{t("analisis_s4_desc")}</p>

          <div className="bg-white/4 border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-textsecondary text-xs uppercase tracking-widest font-medium mb-4">
              {t("analisis_hypotheses")}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-textsecondary font-medium shrink-0 w-28">{t("analisis_h0")}</span>
                <span className="text-textprimary">{t("analisis_h0_text")}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-textsecondary font-medium shrink-0 w-28">{t("analisis_h1")}</span>
                <span className="text-textprimary">{t("analisis_h1_text")}</span>
              </div>
              <div className="pt-3 border-t border-white/8 flex gap-3">
                <span className="text-textsecondary font-medium shrink-0 w-28">{t("analisis_criterion")}</span>
                <span className="text-textprimary">{t("analisis_criterion_text")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/4 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-textsecondary text-xs uppercase tracking-widest mb-3">{t("analisis_f_stat")}</p>
              <p className="text-4xl font-extrabold text-amber">7.7896</p>
            </div>
            <div className="bg-turismo/8 border border-turismo/25 rounded-2xl p-6 text-center">
              <p className="text-textsecondary text-xs uppercase tracking-widest mb-3">{t("analisis_pvalue")}</p>
              <p className="text-4xl font-extrabold text-turismo">0.0020</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-turismo/8 border border-turismo/25 rounded-2xl p-6">
            <CheckCircle2 className="text-turismo w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-1">{t("analisis_reject_h0")}</p>
              <p className="text-textsecondary text-sm leading-relaxed">
                {t("analisis_anova_conc_pre")}{" "}
                <span className="text-turismo font-bold">0.0020</span>{" "}
                {t("analisis_anova_conc_post")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── PASO 5 — TUKEY HSD ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.3)} className="glass-card p-8 border border-white/10">
          <StepHeader n={5} title={t("analisis_s5_title")} />
          <p className="text-textsecondary text-sm mb-8">{t("analisis_s5_desc")}</p>

          <div className="overflow-x-auto rounded-2xl border border-white/10 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  {tableHeaders.map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-textsecondary font-medium text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ g1, g2, diff, padj, reject }) => (
                  <tr key={`${g1}-${g2}`} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition">
                    <td className="px-5 py-4 text-textprimary font-medium">{g1}</td>
                    <td className="px-5 py-4 text-textprimary font-medium">{g2}</td>
                    <td className="px-5 py-4 text-textsecondary font-mono">{diff}</td>
                    <td className="px-5 py-4 text-textsecondary font-mono">{padj}</td>
                    <td className="px-5 py-4">
                      {reject
                        ? <span className="inline-block bg-turismo/15 text-turismo text-xs font-semibold px-3 py-1 rounded-full">{t("analisis_yes")}</span>
                        : <span className="inline-block bg-white/8 text-textsecondary text-xs font-semibold px-3 py-1 rounded-full">{t("analisis_no")}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            {tukeyPairs.map(({ id, pair, hasDiff, desc }) => (
              <div
                key={id}
                className={`flex items-start gap-4 rounded-2xl p-5 border ${
                  hasDiff ? "bg-turismo/6 border-turismo/25" : "bg-white/3 border-white/8"
                }`}
              >
                {hasDiff
                  ? <CheckCircle2 className="text-turismo w-5 h-5 shrink-0 mt-0.5" />
                  : <AlertCircle  className="text-textsecondary w-5 h-5 shrink-0 mt-0.5" />
                }
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-semibold">{pair}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      hasDiff ? "bg-turismo/15 text-turismo" : "bg-white/8 text-textsecondary"
                    }`}>
                      {hasDiff ? t("analisis_has_diff") : t("analisis_no_diff")}
                    </span>
                  </div>
                  <p className="text-textsecondary text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PASO 6 — PEARSON ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.35)} className="glass-card p-8 border border-white/10">
          <StepHeader n={6} title={t("analisis_s6_title")} />
          <p className="text-textsecondary text-sm mb-8">{t("analisis_s6_desc")}</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-amber/8 border border-amber/25 rounded-2xl p-6 text-center">
              <p className="text-textsecondary text-xs uppercase tracking-widest mb-3">{t("analisis_pearson")}</p>
              <p className="text-5xl font-extrabold text-amber">0.87</p>
              <p className="text-amber/70 text-xs mt-2">{t("analisis_pearson_pos")}</p>
            </div>
            <div className="bg-turismo/8 border border-turismo/25 rounded-2xl p-6 text-center">
              <p className="text-textsecondary text-xs uppercase tracking-widest mb-3">{t("analisis_pvalue")}</p>
              <p className="text-5xl font-extrabold text-turismo">0.000</p>
              <p className="text-turismo/70 text-xs mt-2">{t("analisis_stat_sig")}</p>
            </div>
          </div>

          <div className="mb-8 px-2">
            <div className="flex justify-between text-xs text-textsecondary mb-2">
              <span>{t("analisis_scale_neg")}</span>
              <span>0</span>
              <span>{t("analisis_scale_pos")}</span>
            </div>
            <div className="relative h-3 rounded-full bg-linear-to-r from-movilidad/60 via-white/10 to-turismo/60">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-amber border-2 border-background rounded-full shadow-lg"
                style={{ left: "calc(93.5% - 10px)" }}
              />
            </div>
            <p className="text-center text-amber text-sm font-bold mt-3">r = 0.87</p>
          </div>

          <div className="flex items-start gap-4 bg-turismo/8 border border-turismo/25 rounded-2xl p-6">
            <CheckCircle2 className="text-turismo w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-1">{t("analisis_pearson_title")}</p>
              <p className="text-textsecondary text-sm leading-relaxed">
                {t("analisis_pearson_desc_pre")}{" "}
                <span className="text-white font-medium">{t("analisis_real_engine")}</span>{" "}
                {t("analisis_pearson_desc_post")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CONCLUSIÓN GENERAL ── */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0.4)} className="glass-card p-8 border border-amber/25">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
              <ChevronRight className="text-amber w-5 h-5" />
            </div>
            <h2 className="text-amber font-bold text-xl">{t("analisis_conclusion_title")}</h2>
          </div>

          <div className="space-y-6">
            {conclusions.map(({ n, text, stat }) => (
              <div key={n} className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-amber text-xs font-bold">{n}</span>
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-textprimary text-sm leading-relaxed mb-1">{text}</p>
                  <span className="text-amber/60 text-xs font-medium">{stat}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/8 text-center">
            <p className="text-textsecondary/40 text-xs">{t("analisis_footer")}</p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
